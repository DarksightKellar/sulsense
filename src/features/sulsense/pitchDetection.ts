export function autoCorrelate(buffer: Float32Array, sampleRate: number) {
  let size = buffer.length;
  let rms = 0;

  for (let index = 0; index < size; index += 1) {
    const sample = buffer[index] ?? 0;
    rms += sample * sample;
  }

  rms = Math.sqrt(rms / size);

  if (rms < 0.015) {
    return -1;
  }

  let trimStart = 0;
  let trimEnd = size - 1;
  const threshold = 0.2;

  for (let index = 0; index < size / 2; index += 1) {
    if (Math.abs(buffer[index] ?? 0) < threshold) {
      trimStart = index;
      break;
    }
  }

  for (let index = 1; index < size / 2; index += 1) {
    if (Math.abs(buffer[size - index] ?? 0) < threshold) {
      trimEnd = size - index;
      break;
    }
  }

  const trimmed = buffer.slice(trimStart, trimEnd);
  size = trimmed.length;

  if (size === 0) {
    return -1;
  }

  const correlations = new Float32Array(size);

  for (let delay = 0; delay < size; delay += 1) {
    for (let index = 0; index < size - delay; index += 1) {
      const baseSample = trimmed[index] ?? 0;
      const delayedSample = trimmed[index + delay] ?? 0;
      const currentCorrelation = correlations[delay] ?? 0;
      correlations[delay] = currentCorrelation + baseSample * delayedSample;
    }
  }

  let dip = 0;

  while (
    dip + 1 < size &&
    (correlations[dip] ?? 0) > (correlations[dip + 1] ?? 0)
  ) {
    dip += 1;
  }

  let maxValue = -1;
  let maxPosition = -1;

  for (let index = dip; index < size; index += 1) {
    const correlation = correlations[index] ?? 0;

    if (correlation > maxValue) {
      maxValue = correlation;
      maxPosition = index;
    }

    if (maxValue > (correlations[0] ?? 0) * 0.8 && correlation < maxValue) {
      break;
    }
  }

  if (maxPosition <= 0) {
    return -1;
  }

  let period = maxPosition;
  const x1 = correlations[period - 1] ?? 0;
  const x2 = correlations[period] ?? 0;
  const x3 = correlations[period + 1] ?? 0;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;

  if (a !== 0) {
    period -= b / (2 * a);
  }

  return sampleRate / period;
}
