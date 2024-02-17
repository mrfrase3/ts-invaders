# 👾 TS Invaders 👾

## Description
A Typescript re-write/refactor/overhaul of a space invaders gist/codepen I found

[Original CodePen](https://codepen.io/anthdeldev/pen/BHuGL) by [Anthony Del Ciotto](https://codepen.io/anthdeldev)

[Gist](https://gist.github.com/insipx/c3d3eae31016c1e16ba6bd1a7e19b2fe) By insipx

### [Example](https://mrfrase3.github.io/ts-invaders/)

## Features
- Fully typed
- Importable by other projects, just feed it a canvas element
- Fairly configurable and simple to use
- Improvements for optimisation/memory leaks (entity recycling, etc)
- 4.0kB compressed

## TODO
- [ ] Add space ships
- [ ] Add barriers
- [ ] Allow configuring colors

## Installation

### npm
```bash
npm i @mrfrase3/ts-invaders
```

### yarn
```bash
yarn add @mrfrase3/ts-invaders
```

### pnpm
```bash
pnpm add @mrfrase3/ts-invaders
```

### Browser
Versioned: (replace `<version>` with the latest release version)
```html
<script src="
  https://unpkg.com/@mrfrase3/ts-invaders@<version>/dist/index.umd.min.js
"></script>
```

Latest: (can break in the future)
```html
<script src="
  https://unpkg.com/@mrfrase3/ts-invaders/dist/index.umd.min.js
"></script>
```

## Usage
```html
<canvas id="game-canvas" width="640" height="640"></canvas>
```
**Note:** The canvas will be transparent, and the default assets are white.
make sure you set the background to be a dark color, e.g. `#121212`

```ts
// you don't need to import if using the browser install
import TSInvaders from '@mrfrase3/ts-invaders';

const canvas = document.getElementById('game-canvas');
const game = new TSInvaders(canvas, { /* config go here */ });
game.start();

// later on
game.destroy();

```

You can check out the [example code here](https://github.com/mrfrase3/ts-invaders/blob/main/example/index.html)

The main class has the following methods:
- `constructor(canvas: HTMLCanvasElement, config: InvaderConfig = {})`
- `async start(): Promise<void>` (async loads assets)
- `destroy(): void` (cleans up event listeners)

The `InvaderConfig` has the following:
```ts
export interface InvaderConfig {
  // where to get the sprite PNG from
  spriteUrl?: string; // 'https://mrfrase3.github.io/ts-invaders/sprites.png'
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
  leftKeys?: string[]; // ['ArrowLeft', 'KeyA']
  rightKeys?: string[]; // ['ArrowRight', 'KeyD']
  fireKeys?: string[]; // ['Space', 'KeyW', 'ArrowUp']
  textBlinkFrequency?: number; // 750 (ms)
  playerLives?: number; // 3
  scores?: ScoreMap; // see below
  font?: string; // 'monospace'
  title?: string; // 'TS Invaders'
  startText?: string; // 'Press space to play!'
  // methods to get/set the high score from somewhere
  // defaults to local storage under 'invaders-high-score'
  getHighScore?: () => number;
  setHighScore?: (score: number) => void;
}

const defaultScores: ScoreMap = {
  'alien-kill': 25, // when you kill an alien
  'player-kill': 0, // when an alien kills you
  'wave-clear': 500, // when you complete a wave (get rid of all visible aliens)
  'wave-modifier': 1, // increases alien-kill each wave by a multiple (kill * wave * modifier) 0 to disable
};
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
- Author: mrfrase3
- GitHub: [mrfrase3](https://github.com/mrfrase3)
- [My Stuff](https://mrfrase3.bio.link/)
- [Buy Me a Coffee](https://www.buymeacoffee.com/mrfrase3)
