// Note: Math utility functions

/**
 * Generates a random number between the specified minimum and maximum values.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A random number between the minimum and maximum values.
 */
export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between the specified minimum and maximum values.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A random integer between the minimum and maximum values.
 */
export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between the specified minimum and maximum values.
 * @param num - The number to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped number.
 */
export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
}

/**
 * Checks if a value is within the specified range.
 * @param value - The value to check.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns True if the value is within the range, false otherwise.
 */
export const valueInRange = (value: number, min: number, max: number) => {
  return (value <= max) && (value >= min);
}
