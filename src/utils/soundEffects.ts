// Web Audio API Synthesizer for rich, dreamy, 100% reliable sound effects and background music
// Zero external audio link failures, works offline and on all mobile devices

class SoundSystem {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private isMuted = false;
  private musicInterval: number | null = null;
  private onMusicStateChange?: (playing: boolean) => void;

  constructor() {
    // Initialized on first user interaction
  }

  public setMusicCallback(cb: (playing: boolean) => void) {
    this.onMusicStateChange = cb;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.gain.value = 0.22;
      this.sfxGain.gain.value = 0.35;

      this.musicGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.musicGain && this.sfxGain) {
      if (this.isMuted) {
        this.musicGain.gain.value = 0;
        this.sfxGain.gain.value = 0;
      } else {
        this.musicGain.gain.value = 0.22;
        this.sfxGain.gain.value = 0.35;
      }
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  // --- SOUND EFFECTS ---

  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(820, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      const now = this.ctx!.currentTime + idx * 0.07;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.65);
    });
  }

  public playCandleExtinguish() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    // Breath / puff (noise buffer)
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    whiteNoise.start(now);

    // Subtle gentle bell ping
    const ping = this.ctx.createOscillator();
    const pingGain = this.ctx.createGain();
    ping.type = 'sine';
    ping.frequency.setValueAtTime(1200, now + 0.04);
    ping.frequency.exponentialRampToValueAtTime(800, now + 0.35);

    pingGain.gain.setValueAtTime(0.15, now + 0.04);
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    ping.connect(pingGain);
    pingGain.connect(this.sfxGain);

    ping.start(now + 0.04);
    ping.stop(now + 0.38);
  }

  public playConfetti() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Celebratory arpeggio
    const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
    arpeggio.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      const now = this.ctx!.currentTime + idx * 0.05;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  }

  public playCardFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playPaperRustle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  public playHugSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const chord = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 warm major
    const now = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.12, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.04);
      osc.stop(now + 0.85);
    });
  }

  // --- BACKGROUND MUSIC: Dreamy Music Box Melody ---

  public toggleMusic() {
    if (this.isMusicPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public startMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    if (this.onMusicStateChange) this.onMusicStateChange(true);

    // Warm, soothing music-box lullaby sequence in F major / D minor
    // F - C - Dm - Bb comforting melody
    const notes = [
      // phrase 1
      349.23, 440.00, 523.25, 440.00, 523.25, 698.46, 523.25, 440.00,
      // phrase 2
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 349.23, 392.00,
      // phrase 3
      293.66, 349.23, 440.00, 587.33, 523.25, 440.00, 392.00, 349.23,
      // phrase 4 (sweet finish)
      466.16, 523.25, 587.33, 698.46, 659.25, 587.33, 523.25, 440.00
    ];

    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;

      const freq = notes[noteIndex % notes.length];
      noteIndex++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Music box bell sound: sine + subtle harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.09, now);
      // music box chime bell decay
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 1.0);

      // Play soft bass root every 4 notes
      if ((noteIndex - 1) % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        const bassFreq = freq / 2;
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.06, now);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + 1.5);
      }
    };

    // Note tempo: every 380ms
    playNextNote();
    this.musicInterval = window.setInterval(playNextNote, 380);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.onMusicStateChange) this.onMusicStateChange(false);
  }
}

export const soundManager = new SoundSystem();
