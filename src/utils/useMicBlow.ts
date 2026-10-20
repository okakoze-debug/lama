import { useState, useRef, useCallback } from 'react';

export function useMicBlow(onBlowDetected: () => void) {
  const [isMicActive, setIsMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const blowCooldownRef = useRef(false);

  const startListening = useCallback(async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.2;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkBlow = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Blowing into the mic produces significant low-to-mid turbulence
        let sumLow = 0;
        const lowBins = Math.min(25, bufferLength);
        for (let i = 0; i < lowBins; i++) {
          sumLow += dataArray[i];
        }
        const avgVolume = sumLow / lowBins;

        // If volume exceeds threshold and not on cooldown
        if (avgVolume > 65 && !blowCooldownRef.current) {
          blowCooldownRef.current = true;
          onBlowDetected();
          setTimeout(() => {
            blowCooldownRef.current = false;
          }, 600);
        }

        animFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch (err: unknown) {
      console.warn('Microphone access denied or unsupported:', err);
      setMicError('Microphone permission not granted or unavailable. You can tap the candles to extinguish them!');
      setIsMicActive(false);
    }
  }, [onBlowDetected]);

  const stopListening = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsMicActive(false);
  }, []);

  return {
    isMicActive,
    micError,
    startListening,
    stopListening
  };
}
