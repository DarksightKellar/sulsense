import { A4_HZ, LETTER_OFFSETS, LETTER_STEPS, SHARP_NAMES } from './constants';
import type { Accidental, NoteLetter, NoteName, NoteObject } from './types';

const NOTE_PATTERN = /^([A-G])([#b]?)(-?\d+)$/;

function positiveModulo(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function parseNote(noteString: string): NoteObject | null {
  const match = noteString.match(NOTE_PATTERN);

  if (!match) {
    return null;
  }

  const rawLetter = match[1];
  const rawAccidental = match[2];
  const rawOctave = match[3];

  if (!rawLetter || !rawOctave) {
    return null;
  }

  const letter = rawLetter as NoteLetter;
  const accidental = (rawAccidental ?? '') as Accidental;
  const octave = Number.parseInt(rawOctave, 10);
  const step = octave * 7 + LETTER_STEPS[letter];

  let midi = (octave + 1) * 12 + LETTER_OFFSETS[letter];

  if (accidental === '#') {
    midi += 1;
  }

  if (accidental === 'b') {
    midi -= 1;
  }

  return {
    string: `${letter}${accidental}${octave}` as NoteName,
    letter,
    acc: accidental,
    oct: octave,
    step,
    midi,
  };
}

export function getSharpName(midi: number) {
  return SHARP_NAMES[positiveModulo(midi, 12)] ?? SHARP_NAMES[0];
}

export function midiToNoteObject(midi: number | null | undefined): NoteObject | null {
  if (midi === null || midi === undefined || !Number.isFinite(midi)) {
    return null;
  }

  const normalizedMidi = Math.round(midi);
  const octave = Math.floor(normalizedMidi / 12) - 1;
  const name = getSharpName(normalizedMidi);
  const letter = name[0] as NoteLetter;
  const accidental = (name.slice(1) as Accidental) ?? '';
  const step = octave * 7 + LETTER_STEPS[letter];

  return {
    string: `${name}${octave}` as NoteName,
    letter,
    acc: accidental,
    oct: octave,
    step,
    midi: normalizedMidi,
  };
}

export function hzToMidi(hz: number) {
  return Math.round(12 * Math.log2(hz / A4_HZ) + 69);
}

export function getCents(hz: number, midi: number) {
  const referenceFrequency = A4_HZ * 2 ** ((midi - 69) / 12);
  return Math.round(1200 * Math.log2(hz / referenceFrequency));
}

export function getTunerColor(cents: number, alpha = 1) {
  const clampedCents = clamp(cents, -50, 50);
  const ratio = Math.abs(clampedCents) / 50;

  const green = { r: 16, g: 185, b: 129 };
  const blue = { r: 59, g: 130, b: 246 };
  const red = { r: 225, g: 10, b: 10 };
  const target = clampedCents > 0 ? red : blue;
  const easedRatio = ratio ** 1.5;

  const r = Math.round(green.r + (target.r - green.r) * easedRatio);
  const g = Math.round(green.g + (target.g - green.g) * easedRatio);
  const b = Math.round(green.b + (target.b - green.b) * easedRatio);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function formatOrdinal(value: number) {
  const remainder10 = value % 10;
  const remainder100 = value % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return `${value}st`;
  }

  if (remainder10 === 2 && remainder100 !== 12) {
    return `${value}nd`;
  }

  if (remainder10 === 3 && remainder100 !== 13) {
    return `${value}rd`;
  }

  return `${value}th`;
}

export function clampCents(cents: number) {
  return clamp(cents, -50, 50);
}
