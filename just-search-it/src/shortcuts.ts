

export type Shortcut = {
  key: string;
  ctrlKey? : boolean;
  altKey? : boolean;
  shiftKey? : boolean;
  metaKey? : boolean;
}

export function matchesShortcut(event: KeyboardEvent, shortcut: Shortcut): boolean {
  return (
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    // Coerce types to boolean from undefined
    event.ctrlKey == !!shortcut.ctrlKey &&
    event.altKey == !!shortcut.altKey &&
    event.shiftKey == !!shortcut.shiftKey &&
    event.metaKey == !!shortcut.metaKey
  );
}

export function hasShortcut(
  event: KeyboardEvent,
  shortcuts?: Shortcut[]
): boolean {
  return shortcuts?.some((shortcut) => matchesShortcut(event, shortcut)) || false;
}

