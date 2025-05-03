// tests/greet.test.ts
import { describe, it, expect } from 'vitest';
import { defineCommand, addBinding } from '../src';


describe('add command', () => {
  it('adds a command', () => {
    const command = defineCommand();
    const fn = () => 'Hello, world!';
    const args = ['arg1', 'arg2'];
    const key = addBinding(command,{
        name: 'greet',
        description: 'Greet the world',
        icon: '🌍'
    }, fn, ...args);
    // check the command works
    expect(command('arg1', 'arg2')).toBe('Hello, world!');
    // check the command details can be accessed.
    expect(command.argBindings[key].metadata.name).toBe('greet');
  });
})