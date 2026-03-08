import { LEVELS, STRING_BASES } from './constants';
import { parseNote } from './music';
import type { FingerNumber, LevelId, SequenceItem, StringName } from './types';

function pickRandomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

function getFinger(position: number, stepDifference: number): FingerNumber | null {
  if (position === 1 && stepDifference >= 0 && stepDifference <= 4) {
    return stepDifference as FingerNumber;
  }

  if (position > 1 && stepDifference >= position && stepDifference <= position + 3) {
    return (stepDifference - position + 1) as FingerNumber;
  }

  return null;
}

function buildSequenceItemPool(levelId: LevelId) {
  const level = LEVELS[levelId];
  const position = level.position;
  const items: SequenceItem[] = [];

  level.notes.forEach((noteName) => {
    const noteObj = parseNote(noteName);

    if (!noteObj) {
      return;
    }

    level.constraints.forEach((constraint) => {
      const baseNote = parseNote(STRING_BASES[constraint]);

      if (!baseNote) {
        return;
      }

      const stepDifference = noteObj.step - baseNote.step;
      const semitoneDifference = noteObj.midi - baseNote.midi;

      if (semitoneDifference < 0) {
        return;
      }

      if (stepDifference === 0 && semitoneDifference !== 0) {
        return;
      }

      const finger = getFinger(position, stepDifference);

      if (finger === null) {
        return;
      }

      items.push({
        noteObj,
        constraint,
        finger,
      });
    });
  });

  return items;
}

function filterByConstraint(items: readonly SequenceItem[], constraint: StringName) {
  return items.filter((item) => item.constraint === constraint);
}

export function generateSequence(levelId: LevelId, runLength: number) {
  if (runLength < 1) {
    return [] satisfies SequenceItem[];
  }

  const validCombos = buildSequenceItemPool(levelId);

  if (validCombos.length === 0) {
    return [] satisfies SequenceItem[];
  }

  const firstCombo = pickRandomItem(validCombos);

  if (!firstCombo) {
    return [] satisfies SequenceItem[];
  }

  const lockedConstraint = firstCombo.constraint;
  const stringCombos = filterByConstraint(validCombos, lockedConstraint);
  const sequence: SequenceItem[] = [firstCombo];

  for (let index = 1; index < runLength; index += 1) {
    const previousNote = sequence[index - 1]?.noteObj.midi;
    const nonRepeatingPool = stringCombos.filter(
      (item) => item.noteObj.midi !== previousNote,
    );
    const pool = nonRepeatingPool.length > 0 ? nonRepeatingPool : stringCombos;
    const nextItem = pickRandomItem(pool);

    if (!nextItem) {
      break;
    }

    sequence.push(nextItem);
  }

  return sequence;
}
