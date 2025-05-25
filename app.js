// Create audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Drum synthesizer functions
function createKick() {
  const pitch = instrumentPitch.kick;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(getEffectDestination());
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(200 * pitch, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  gainNode.gain.setValueAtTime(1.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(150, audioContext.currentTime);
  filter.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}

function createSnare() {
  const pitch = instrumentPitch.snare;
  const noise = audioContext.createBufferSource();
  const noiseGain = audioContext.createGain();
  const oscillator = audioContext.createOscillator();
  const oscillatorGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const filter2 = audioContext.createBiquadFilter();
  
  const bufferSize = audioContext.sampleRate * 0.3;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  noise.buffer = buffer;
  noise.connect(filter);
  filter.connect(filter2);
  filter2.connect(noiseGain);
  noiseGain.connect(getEffectDestination());
  
  oscillator.connect(oscillatorGain);
  oscillatorGain.connect(getEffectDestination());
  
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(180 * pitch, audioContext.currentTime);
  
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(800, audioContext.currentTime);
  filter.Q.setValueAtTime(1, audioContext.currentTime);
  
  filter2.type = 'bandpass';
  filter2.frequency.setValueAtTime(2000, audioContext.currentTime);
  filter2.Q.setValueAtTime(2, audioContext.currentTime);
  
  noiseGain.gain.setValueAtTime(1.2, audioContext.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  
  oscillatorGain.gain.setValueAtTime(0.7, audioContext.currentTime);
  oscillatorGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  noise.start();
  oscillator.start();
  noise.stop(audioContext.currentTime + 0.15);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function createHiHat(closed = true) {
  const pitch = closed ? instrumentPitch.closedhat : instrumentPitch.openhat;
  const noise = audioContext.createBufferSource();
  const noiseGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const filter2 = audioContext.createBiquadFilter();
  const filter3 = audioContext.createBiquadFilter();
  
  const bufferSize = audioContext.sampleRate * 0.1;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  noise.buffer = buffer;
  noise.connect(filter);
  filter.connect(filter2);
  filter2.connect(filter3);
  filter3.connect(noiseGain);
  noiseGain.connect(getEffectDestination());
  
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(8000 * pitch, audioContext.currentTime);
  filter.Q.setValueAtTime(1, audioContext.currentTime);
  
  filter2.type = 'highpass';
  filter2.frequency.setValueAtTime(12000 * pitch, audioContext.currentTime);
  filter2.Q.setValueAtTime(1, audioContext.currentTime);
  
  filter3.type = 'bandpass';
  filter3.frequency.setValueAtTime(10000 * pitch, audioContext.currentTime);
  filter3.Q.setValueAtTime(2, audioContext.currentTime);
  
  if (closed) {
    noiseGain.gain.setValueAtTime(0.6, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
  } else {
    noiseGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
  }
  
  noise.start();
  noise.stop(audioContext.currentTime + (closed ? 0.08 : 0.4));
}

function createTom(frequency, name) {
  const pitch = instrumentPitch[name];
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const filter2 = audioContext.createBiquadFilter();
  
  oscillator.connect(filter);
  filter.connect(filter2);
  filter2.connect(gainNode);
  gainNode.connect(getEffectDestination());
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency * 1.2 * pitch, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.1 * pitch, audioContext.currentTime + 0.4);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(frequency * 2.5 * pitch, audioContext.currentTime);
  filter.Q.setValueAtTime(2, audioContext.currentTime);
  
  filter2.type = 'bandpass';
  filter2.frequency.setValueAtTime(frequency * 1.5 * pitch, audioContext.currentTime);
  filter2.Q.setValueAtTime(3, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(1.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.4);
}

// Sound generation functions
const sounds = {
  kick: () => createKick(),
  snare: () => createSnare(),
  closedhat: () => createHiHat(true),
  openhat: () => createHiHat(false),
  tom1: () => createTom(180, 'tom1'),
  tom2: () => createTom(140, 'tom2'),
  tom3: () => createTom(100, 'tom3'),
  crash: () => {
    const pitch = instrumentPitch.crash;
    const oscillator = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const filter2 = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    oscillator2.connect(filter2);
    filter.connect(gainNode);
    filter2.connect(gainNode);
    gainNode.connect(getEffectDestination());
    
    oscillator.type = 'sine';
    oscillator2.type = 'triangle';
    
    oscillator.frequency.setValueAtTime(1200 * pitch, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800 * pitch, audioContext.currentTime + 1);
    
    oscillator2.frequency.setValueAtTime(1800 * pitch, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(1200 * pitch, audioContext.currentTime + 1);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2500 * pitch, audioContext.currentTime);
    filter.Q.setValueAtTime(15, audioContext.currentTime);
    
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(3000 * pitch, audioContext.currentTime);
    filter2.Q.setValueAtTime(10, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(1.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start();
    oscillator2.start();
    oscillator.stop(audioContext.currentTime + 1);
    oscillator2.stop(audioContext.currentTime + 1);
  }
};

const sequencer = document.getElementById("sequencer");
let currentStep = 0;
let interval = null;

// Store pitch values for each instrument
const instrumentPitch = {
  kick: 1,
  snare: 1,
  closedhat: 1,
  openhat: 1,
  tom1: 1,
  tom2: 1,
  tom3: 1,
  crash: 1,
};

// Build sequencer grid
const instruments = [
  { name: "kick", file: "kick.wav" },
  { name: "snare", file: "snare.wav" },
  { name: "closedhat", file: "closedhat.wav" },
  { name: "openhat", file: "openhat.wav" },
  { name: "tom1", file: "tom1.wav" },
  { name: "tom2", file: "tom2.wav" },
  { name: "tom3", file: "tom3.wav" },
  { name: "crash", file: "crash.wav" },
];

instruments.forEach(inst => {
  const row = document.createElement("div");
  row.classList.add("row");
  row.dataset.instrument = inst.name;

  const label = document.createElement("label");
  label.innerText = inst.name;
  row.appendChild(label);

  for (let i = 0; i < 16; i++) {
    const step = document.createElement("button");
    step.classList.add("step");
    step.dataset.step = i;
    step.addEventListener("click", () => {
      step.classList.toggle("active");
    });
    row.appendChild(step);
  }

  // Add pitch slider
  const pitchSlider = document.createElement("input");
  pitchSlider.type = "range";
  pitchSlider.min = 0.5;
  pitchSlider.max = 2;
  pitchSlider.step = 0.01;
  pitchSlider.value = 1;
  pitchSlider.className = "pitch-slider";
  pitchSlider.addEventListener("input", (e) => {
    instrumentPitch[inst.name] = parseFloat(e.target.value);
    pitchValueLabel.textContent = e.target.value;
  });
  row.appendChild(pitchSlider);

  // Add pitch value label
  const pitchValueLabel = document.createElement("span");
  pitchValueLabel.className = "pitch-label";
  pitchValueLabel.textContent = "1";
  row.appendChild(pitchValueLabel);

  sequencer.appendChild(row);
});

// Playback engine
function playStep() {
  document.querySelectorAll(".step").forEach(btn => btn.classList.remove("playing"));

  instruments.forEach(inst => {
    const row = document.querySelector(`.row[data-instrument="${inst.name}"]`);
    const step = row.querySelector(`.step[data-step="${currentStep}"]`);
    step.classList.add("playing");
    if (step.classList.contains("active")) {
      sounds[inst.name]();
    }
  });

  currentStep = (currentStep + 1) % 16;
}

// Add click handler to start audio context
document.getElementById("start").addEventListener("click", () => {
  // Resume audio context if it was suspended
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  
  // Update button states
  startButton.classList.add("active");
  stopButton.classList.remove("active");
  
  // Set a fixed BPM since we removed the BPM control
  const bpm = 120;
  const intervalTime = 60000 / bpm / 4; // 16 steps = 4 beats
  interval = setInterval(playStep, intervalTime);
});

document.getElementById("stop").addEventListener("click", () => {
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  
  // Update button states
  startButton.classList.remove("active");
  stopButton.classList.add("active");
  
  clearInterval(interval);
  currentStep = 0;
  
  // Reset all playing steps
  document.querySelectorAll(".step").forEach(btn => {
    btn.classList.remove("playing");
  });
});

// Effect selection and display logic
const effectSelect = document.getElementById('effect');
const display = document.getElementById('display');
let currentEffect = 'none';

// Create a global lowpass filter node
const globalLowpass = audioContext.createBiquadFilter();
globalLowpass.type = 'lowpass';
globalLowpass.frequency.value = 800;

effectSelect.addEventListener('change', (e) => {
  currentEffect = e.target.value;
  display.textContent = `Effect: ${effectSelect.options[effectSelect.selectedIndex].text}`;
});

display.textContent = `Effect: ${effectSelect.options[effectSelect.selectedIndex].text}`;

// Helper to get the destination node based on effect
function getEffectDestination() {
  if (currentEffect === 'lowpass') {
    return globalLowpass;
  }
  return audioContext.destination;
}

// Audio Visualizer Setup
const analyser = audioContext.createAnalyser();
analyser.fftSize = 64;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Master Volume Node
const masterGain = audioContext.createGain();
masterGain.gain.value = 1;

// Connect analyser to masterGain, then to destination
analyser.disconnect();
analyser.connect(masterGain);
masterGain.connect(audioContext.destination);

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

function drawVisualizer() {
  // Smooth fading effect
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1.0;
  analyser.getByteFrequencyData(dataArray);
  const barWidth = (canvas.width / bufferLength) * 1.5;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 0.9;
    // Gradient for each bar
    const grad = ctx.createLinearGradient(x, canvas.height - barHeight, x, canvas.height);
    grad.addColorStop(0, '#00ffaa');
    grad.addColorStop(0.5, '#00ffff');
    grad.addColorStop(1, '#0066ff');
    ctx.fillStyle = grad;
    ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
    x += barWidth;
  }
  requestAnimationFrame(drawVisualizer);
}

drawVisualizer();

// Master volume slider logic
const masterVolumeSlider = document.getElementById('master-volume');
masterVolumeSlider.addEventListener('input', (e) => {
  masterGain.gain.value = parseFloat(e.target.value);
});
