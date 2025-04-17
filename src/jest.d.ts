// This file tells TypeScript that these Jest globals exist
import '@jest/globals';

declare global {
  // Re-export all Jest globals to make them available without imports
  export const describe: typeof import('@jest/globals').describe;
  export const expect: typeof import('@jest/globals').expect;
  export const it: typeof import('@jest/globals').it;
  export const jest: typeof import('@jest/globals').jest;
  export const test: typeof import('@jest/globals').test;
  export const beforeAll: typeof import('@jest/globals').beforeAll;
  export const afterAll: typeof import('@jest/globals').afterAll;
  export const beforeEach: typeof import('@jest/globals').beforeEach;
  export const afterEach: typeof import('@jest/globals').afterEach;
} 