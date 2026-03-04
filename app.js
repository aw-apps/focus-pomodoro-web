const MODE_CONFIG = {
  focus: { label: "Focus", seconds: 25 * 60 },
  shortBreak: { label: "Short Break", seconds: 5 * 60 },
  longBreak: { label: "Long Break", seconds: 15 * 60 }
};

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

class PomodoroTimerEngine {
  constructor(config = MODE_CONFIG) {
    this.config = config;
    this.mode = "focus";
    this.remainingSeconds = config[this.mode].seconds;
    this.isRunning = false;
    this.intervalId = null;
    this.listener = null;
  }

  subscribe(listener) {
    this.listener = listener;
    this.#notify();
  }

  getState() {
    return {
      mode: this.mode,
      remainingSeconds: this.remainingSeconds,
      isRunning: this.isRunning,
      formattedTime: formatTime(this.remainingSeconds)
    };
  }

  setMode(mode) {
    if (!this.config[mode]) {
      throw new Error(`Unsupported mode: ${mode}`);
    }

    this.pause();
    this.mode = mode;
    this.remainingSeconds = this.config[mode].seconds;
    this.#notify();
  }

  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.intervalId = window.setInterval(() => {
      this.remainingSeconds = Math.max(0, this.remainingSeconds - 1);
      this.#notify();

      if (this.remainingSeconds === 0) {
        this.pause();
      }
    }, 1000);
    this.#notify();
  }

  pause() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.#notify();
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.config[this.mode].seconds;
    this.#notify();
  }

  #notify() {
    if (typeof this.listener === "function") {
      this.listener(this.getState());
    }
  }
}

window.Pomodoro = {
  MODE_CONFIG,
  formatTime,
  PomodoroTimerEngine
};

function getUIElements() {
  return {
    modeTabs: Array.from(document.querySelectorAll("[data-mode]")),
    modeLabel: document.querySelector("[data-current-mode]"),
    timeDisplay: document.querySelector("[data-time-display]"),
    startButton: document.querySelector('[data-action="start"]'),
    pauseButton: document.querySelector('[data-action="pause"]'),
    resetButton: document.querySelector('[data-action="reset"]')
  };
}

function createPomodoroApp() {
  const ui = getUIElements();
  const engine = new PomodoroTimerEngine();

  function render(state) {
    ui.modeTabs.forEach((tab) => {
      const isActive = tab.dataset.mode === state.mode;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    ui.modeLabel.textContent = MODE_CONFIG[state.mode].label;
    ui.timeDisplay.textContent = state.formattedTime;
    ui.startButton.disabled = state.isRunning;
    ui.pauseButton.disabled = !state.isRunning;
  }

  function bindEvents() {
    ui.startButton.addEventListener("click", () => engine.start());
    ui.pauseButton.addEventListener("click", () => engine.pause());
    ui.resetButton.addEventListener("click", () => engine.reset());
    ui.modeTabs.forEach((tab) => {
      tab.addEventListener("click", () => engine.setMode(tab.dataset.mode));
    });
  }

  engine.subscribe(render);
  bindEvents();
}

document.addEventListener("DOMContentLoaded", createPomodoroApp);
