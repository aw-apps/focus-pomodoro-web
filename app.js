const MODE_CONFIG = {
  focus: { label: "Focus", seconds: 25 * 60 },
  shortBreak: { label: "Short Break", seconds: 5 * 60 },
  longBreak: { label: "Long Break", seconds: 15 * 60 }
};
const DEFAULT_SETTINGS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4
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
    resetButton: document.querySelector('[data-action="reset"]'),
    settingsForm: document.querySelector("[data-settings-form]"),
    settingsFeedback: document.querySelector("[data-settings-feedback]"),
    settingsInputs: {
      focusMinutes: document.querySelector('[data-setting="focusMinutes"]'),
      shortBreakMinutes: document.querySelector('[data-setting="shortBreakMinutes"]'),
      longBreakMinutes: document.querySelector('[data-setting="longBreakMinutes"]'),
      longBreakInterval: document.querySelector('[data-setting="longBreakInterval"]')
    }
  };
}

function createPomodoroApp() {
  const ui = getUIElements();
  const engine = new PomodoroTimerEngine();
  const settings = { ...DEFAULT_SETTINGS };

  function getValidationErrors(nextSettings) {
    const errors = [];
    if (!Number.isInteger(nextSettings.focusMinutes) || nextSettings.focusMinutes < 1 || nextSettings.focusMinutes > 120) {
      errors.push("Focus duration must be between 1 and 120 minutes.");
    }
    if (!Number.isInteger(nextSettings.shortBreakMinutes) || nextSettings.shortBreakMinutes < 1 || nextSettings.shortBreakMinutes > 60) {
      errors.push("Short break must be between 1 and 60 minutes.");
    }
    if (!Number.isInteger(nextSettings.longBreakMinutes) || nextSettings.longBreakMinutes < 1 || nextSettings.longBreakMinutes > 90) {
      errors.push("Long break must be between 1 and 90 minutes.");
    }
    if (!Number.isInteger(nextSettings.longBreakInterval) || nextSettings.longBreakInterval < 2 || nextSettings.longBreakInterval > 12) {
      errors.push("Long break interval must be between 2 and 12 focus sessions.");
    }
    return errors;
  }

  function updateEngineDurations(nextSettings) {
    engine.config.focus.seconds = nextSettings.focusMinutes * 60;
    engine.config.shortBreak.seconds = nextSettings.shortBreakMinutes * 60;
    engine.config.longBreak.seconds = nextSettings.longBreakMinutes * 60;
    engine.reset();
  }

  function renderSettingsForm(nextSettings) {
    ui.settingsInputs.focusMinutes.value = String(nextSettings.focusMinutes);
    ui.settingsInputs.shortBreakMinutes.value = String(nextSettings.shortBreakMinutes);
    ui.settingsInputs.longBreakMinutes.value = String(nextSettings.longBreakMinutes);
    ui.settingsInputs.longBreakInterval.value = String(nextSettings.longBreakInterval);
  }

  function showSettingsFeedback(message, isError) {
    ui.settingsFeedback.textContent = message;
    ui.settingsFeedback.classList.toggle("is-error", isError);
    ui.settingsFeedback.classList.toggle("is-success", !isError && message.length > 0);
  }

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
    ui.settingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const nextSettings = {
        focusMinutes: Number.parseInt(ui.settingsInputs.focusMinutes.value, 10),
        shortBreakMinutes: Number.parseInt(ui.settingsInputs.shortBreakMinutes.value, 10),
        longBreakMinutes: Number.parseInt(ui.settingsInputs.longBreakMinutes.value, 10),
        longBreakInterval: Number.parseInt(ui.settingsInputs.longBreakInterval.value, 10)
      };
      const errors = getValidationErrors(nextSettings);
      if (errors.length > 0) {
        showSettingsFeedback(errors[0], true);
        return;
      }
      Object.assign(settings, nextSettings);
      updateEngineDurations(settings);
      showSettingsFeedback("Settings updated.", false);
    });
  }

  engine.subscribe(render);
  renderSettingsForm(settings);
  bindEvents();
}

document.addEventListener("DOMContentLoaded", createPomodoroApp);
