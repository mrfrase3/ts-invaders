import type { BaseSprite } from "../entities/base-sprite";

type EntityFactory<Entity extends BaseSprite> = (x: number, y: number) => Entity;

/**
 * Represents a pool of entities.
 * @template Entity - The type of entity that the pool contains.
 */
export class EntityPool<Entity extends BaseSprite> {
  aliveEntities: Set<Entity>;
  deadEntities: Set<Entity>;
  entityFactory: EntityFactory<Entity>;

  /**
   * Creates an instance of EntityPool.
   * @param {EntityFactory<Entity>} entityFactory - The factory function used to create new entities.
   */
  constructor(entityFactory: EntityFactory<Entity>) {
    this.aliveEntities = new Set<Entity>();
    this.deadEntities = new Set<Entity>();
    this.entityFactory = entityFactory;
  }

  /**
   * Gets the number of alive entities in the pool.
   * @returns {number} The number of alive entities.
   */
  get aliveCount(): number {
    return this.aliveEntities.size;
  }

  /**
   * Gets the number of dead entities in the pool.
   * @returns {number} The number of dead entities.
   */
  get deadCount(): number {
    return this.deadEntities.size;
  }

  /**
   * Creates a new entity and adds it to the pool.
   * If there are dead entities available, it will reuse one of them.
   * @param {number} x - The x-coordinate of the entity's position.
   * @param {number} y - The y-coordinate of the entity's position.
   * @returns {Entity} The created or recycled entity.
   */
  create(x: number, y: number): Entity {
    let entity: Entity;
    if (this.deadEntities.size) {
      entity = this.deadEntities.values().next().value!;
      this.deadEntities.delete(entity);
      entity.position.update(x, y);
    } else {
      entity = this.entityFactory(x, y);
      entity.registerPool(this);
    }
    entity.init();
    this.aliveEntities.add(entity);
    return entity;
  }

  /**
   * Recycles an entity and adds it back to the pool.
   * @param {Entity} entity - The entity to recycle.
   */
  recycle(entity: Entity): void {
    let unalived = false;
    let deadended = false;
    if (this.aliveEntities.has(entity)) {
      this.aliveEntities.delete(entity);
      unalived = true;
    }
    if (!this.deadEntities.has(entity)) {
      this.deadEntities.add(entity);
      deadended = true;
    }
  }

  /**
   * Purges all alive entities in the pool.
   */
  purge(): void {
    this.aliveEntities.forEach(entity => entity.recycle());
  }

  /**
   * Updates all alive entities in the pool.
   * @param {number} dt - The time elapsed since the last update.
   */
  update(dt: number): void {
    this.aliveEntities.forEach(entity => entity.update(dt));
  }

  /**
   * Draws all alive entities in the pool.
   * @param {boolean} resized - Indicates whether the screen has been resized.
   */
  draw(resized: boolean): void {
    this.aliveEntities.forEach(entity => entity.draw(resized));
  }
}