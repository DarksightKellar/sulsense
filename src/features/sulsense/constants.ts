import { STRING_NAMES } from './types';
import type { LevelDefinition, LevelId, NoteLetter, StringName } from './types';

export const A4_HZ = 440;
export const IN_TUNE_CENTS_THRESHOLD = 20;

export const SHARP_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export const LETTER_OFFSETS: Record<NoteLetter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export const LETTER_STEPS: Record<NoteLetter, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

export const STRING_BASES: Record<StringName, `${NoteLetter}${'' | '#'}${number}`> = {
  'Sul G': 'G3',
  'Sul D': 'D4',
  'Sul A': 'A4',
  'Sul E': 'E5',
};

export const LEVEL_IDS = [1, 2, 3, 4] as const satisfies readonly LevelId[];
export const NOTES_PER_RUN_OPTIONS = [1, 2, 3, 4] as const;

export const LEVELS: Record<LevelId, LevelDefinition> = {
  1: {
    name: '1. Foundation: 1st Position',
    notes: [
      'G3',
      'A3',
      'B3',
      'C#4',
      'D4',
      'E4',
      'F#4',
      'G4',
      'A4',
      'B4',
      'C#5',
      'D5',
      'E5',
      'F#5',
      'G#5',
      'A5',
      'B5',
    ],
    constraints: STRING_NAMES,
    position: 1,
  },
  2: {
    name: '2. The Free Hand: 2nd Position',
    notes: [
      'A3',
      'B3',
      'C4',
      'D4',
      'E4',
      'F4',
      'G4',
      'A4',
      'B4',
      'C5',
      'D5',
      'E5',
      'F5',
      'G5',
      'A5',
      'Bb5',
    ],
    constraints: STRING_NAMES,
    position: 2,
  },
  3: {
    name: '3. The Body Anchor: 3rd Position',
    notes: [
      'B3',
      'C#4',
      'D4',
      'E4',
      'F#4',
      'G4',
      'A4',
      'B4',
      'C#5',
      'D5',
      'E5',
      'F#5',
      'G#5',
      'A5',
      'B5',
      'C#6',
    ],
    constraints: STRING_NAMES,
    position: 3,
  },
  4: {
    name: '4. The Upper Free Hand: 4th Position',
    notes: [
      'C4',
      'D4',
      'E4',
      'F4',
      'G4',
      'A4',
      'B4',
      'C5',
      'D5',
      'E5',
      'F#5',
      'G5',
      'A5',
      'B5',
      'C#6',
      'D6',
    ],
    constraints: STRING_NAMES,
    position: 4,
  },
};
