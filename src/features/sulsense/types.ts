export type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Accidental = '' | '#' | 'b';
export type NoteName = `${NoteLetter}${Accidental}${number}`;
export const STRING_NAMES = ['Sul G', 'Sul D', 'Sul A', 'Sul E'] as const;
export type StringName = (typeof STRING_NAMES)[number];
export const MODES = ['explorer', 'trainer'] as const;
export type Mode = (typeof MODES)[number];
export type LevelId = 1 | 2 | 3 | 4;
export type FingerNumber = 0 | 1 | 2 | 3 | 4;

export interface NoteObject {
  string: NoteName;
  letter: NoteLetter;
  acc: Accidental;
  oct: number;
  step: number;
  midi: number;
}

interface SequencedNote<
  TConstraint extends StringName | null,
  TFinger extends FingerNumber | null,
> {
  noteObj: NoteObject;
  constraint: TConstraint;
  finger: TFinger;
}

export type SequenceItem = SequencedNote<StringName, FingerNumber>;
export type DisplaySequenceItem = SequencedNote<StringName | null, FingerNumber | null>;

export interface LevelDefinition {
  name: string;
  notes: NoteName[];
  constraints: readonly StringName[];
  position: number;
}
