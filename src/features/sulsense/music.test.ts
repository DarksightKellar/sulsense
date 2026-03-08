import { describe, expect, it } from 'vitest';
import { generateSequence } from './sequence';
import { getCents, midiToNoteObject, parseNote } from './music';

describe('music helpers', () => {
  it('parses note names into pitch metadata', () => {
    expect(parseNote('C#4')).toEqual({
      acc: '#',
      letter: 'C',
      midi: 61,
      oct: 4,
      step: 28,
      string: 'C#4',
    });
  });

  it('reconstructs note names from MIDI values', () => {
    expect(midiToNoteObject(69)?.string).toBe('A4');
    expect(midiToNoteObject(61)?.string).toBe('C#4');
  });

  it('reports zero cents for an in-tune concert A', () => {
    expect(getCents(440, 69)).toBe(0);
  });
});

describe('sequence generation', () => {
  it('keeps every generated run on one string', () => {
    const sequence = generateSequence(2, 4);
    expect(sequence).toHaveLength(4);
    expect(new Set(sequence.map((item) => item.constraint)).size).toBe(1);
  });

  it('avoids immediate repeated notes when alternatives exist', () => {
    const sequence = generateSequence(1, 4);
    sequence.slice(1).forEach((item, index) => {
      const previousItem = sequence[index];
      expect(previousItem).toBeDefined();

      if (!previousItem) {
        return;
      }

      expect(item.noteObj.midi).not.toBe(previousItem.noteObj.midi);
    });
  });
});
