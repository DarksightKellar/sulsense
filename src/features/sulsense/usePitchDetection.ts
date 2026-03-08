import { useCallback, useEffect, useRef, useState } from 'react';
import { autoCorrelate } from './pitchDetection';
import { getCents, hzToMidi, midiToNoteObject } from './music';
import type { NoteObject } from './types';

const MIN_DETECTABLE_HZ = 180;
const MAX_DETECTABLE_HZ = 4500;

interface PitchState {
  cents: number;
  frequency: number | null;
  note: NoteObject | null;
}

interface AudioRuntime {
  analyser: AnalyserNode | null;
  context: AudioContext | null;
  filter: BiquadFilterNode | null;
  frameId: number | null;
  source: MediaStreamAudioSourceNode | null;
  stream: MediaStream | null;
}

interface WindowWithWebkitAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const INITIAL_PITCH_STATE: PitchState = {
  cents: 0,
  frequency: null,
  note: null,
};

function createEmptyAudioRuntime(): AudioRuntime {
  return {
    analyser: null,
    context: null,
    filter: null,
    frameId: null,
    source: null,
    stream: null,
  };
}

async function stopAudioRuntime(runtime: AudioRuntime) {
  if (runtime.frameId !== null) {
    window.cancelAnimationFrame(runtime.frameId);
  }

  runtime.source?.disconnect();
  runtime.filter?.disconnect();
  runtime.stream?.getTracks().forEach((track) => track.stop());

  if (runtime.context && runtime.context.state !== 'closed') {
    await runtime.context.close();
  }
}

function getMicrophoneErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return 'Please allow microphone access to use SulSense.';
    }

    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return 'No microphone input was found on this device.';
    }
  }

  return 'Unable to access the microphone.';
}

export function usePitchDetection() {
  const audioRuntimeRef = useRef<AudioRuntime>(createEmptyAudioRuntime());
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pitchState, setPitchState] = useState<PitchState>(INITIAL_PITCH_STATE);

  const processFrame = useCallback(() => {
    const runtime = audioRuntimeRef.current;

    if (!runtime.analyser || !runtime.context) {
      return;
    }

    const buffer = new Float32Array(runtime.analyser.fftSize);
    runtime.analyser.getFloatTimeDomainData(buffer);

    const frequency = autoCorrelate(buffer, runtime.context.sampleRate);

    if (
      frequency !== -1 &&
      frequency > MIN_DETECTABLE_HZ &&
      frequency < MAX_DETECTABLE_HZ
    ) {
      const midi = hzToMidi(frequency);

      setPitchState({
        cents: getCents(frequency, midi),
        frequency,
        note: midiToNoteObject(midi),
      });
    } else {
      setPitchState(INITIAL_PITCH_STATE);
    }

    runtime.frameId = window.requestAnimationFrame(processFrame);
  }, []);

  async function startListening() {
    if (isListening) {
      return;
    }

    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Browser microphone APIs are unavailable.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextConstructor =
        window.AudioContext ?? (window as WindowWithWebkitAudioContext).webkitAudioContext;

      if (!AudioContextConstructor) {
        throw new Error('Web Audio is not supported in this browser.');
      }

      const context = new AudioContextConstructor();
      const filter = context.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 160;

      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;

      const source = context.createMediaStreamSource(stream);
      source.connect(filter);
      filter.connect(analyser);

      audioRuntimeRef.current = {
        analyser,
        context,
        filter,
        frameId: null,
        source,
        stream,
      };

      setIsListening(true);
      processFrame();
    } catch (error) {
      const runtime = audioRuntimeRef.current;
      audioRuntimeRef.current = createEmptyAudioRuntime();
      await stopAudioRuntime(runtime);
      setPitchState(INITIAL_PITCH_STATE);
      setIsListening(false);
      setErrorMessage(getMicrophoneErrorMessage(error));
    }
  }

  async function stopListening() {
    const runtime = audioRuntimeRef.current;
    audioRuntimeRef.current = createEmptyAudioRuntime();
    await stopAudioRuntime(runtime);
    setPitchState(INITIAL_PITCH_STATE);
    setIsListening(false);
    setErrorMessage(null);
  }

  async function toggleListening() {
    if (isListening) {
      await stopListening();
      return;
    }

    await startListening();
  }

  useEffect(() => {
    return () => {
      const runtime = audioRuntimeRef.current;
      audioRuntimeRef.current = createEmptyAudioRuntime();
      void stopAudioRuntime(runtime);
    };
  }, []);

  return {
    ...pitchState,
    errorMessage,
    isListening,
    startListening,
    stopListening,
    toggleListening,
  };
}
