import type { Point } from 'slate';
import { Editor, Range } from 'slate';

export function getWord(
  editor: Editor,
  location: Range,
  options: {
    terminator?: string[];
    include?: boolean;
    directions?: 'both' | 'left' | 'right';
  } = {}
): Range | undefined {
  const { terminator = [' '], include = false, directions = 'both' } = options;

  const { selection } = editor;
  if (!selection) return;

  // Get start and end, modify it as we move along.
  let [start, end] = Range.edges(location);

  let point: Point = start;

  function move(direction: 'right' | 'left'): boolean {
    const next =
      direction === 'right'
        ? Editor.after(editor, point, {
            unit: 'character',
          })
        : Editor.before(editor, point, { unit: 'character' });

    const wordNext =
      next &&
      Editor.string(editor, direction === 'right' ? { anchor: point, focus: next } : { anchor: next, focus: point });

    const last = wordNext && wordNext[direction === 'right' ? 0 : wordNext.length - 1];
    if (next && last && !terminator.includes(last)) {
      point = next;

      if (point.offset === 0) {
        // Means we've wrapped to beginning of another block
        return false;
      }
    } else {
      return false;
    }

    return true;
  }

  // Move point and update start & end ranges

  // Move forwards
  if (directions !== 'left') {
    point = end;
    while (move('right'));
    end = point;
  }

  // Move backwards
  if (directions !== 'right') {
    point = start;
    while (move('left'));
    start = point;
  }

  if (include) {
    return {
      anchor: Editor.before(editor, start, { unit: 'offset' }) ?? start,
      focus: Editor.after(editor, end, { unit: 'offset' }) ?? end,
    };
  }

  return { anchor: start, focus: end };
}
