// tests/greet.test.ts
import { describe, it, expect } from 'vitest';
import { greet } from '../src';

describe('greet', () => {
  it('greets by name', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
  });
});