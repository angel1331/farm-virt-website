const INITIAL_TIMES = {
    '1': 3600,
    '2': 1800,
    '3': 600,
};

const timerStates = {
    '1': { totalSeconds: INITIAL_TIMES['1'], intervalId: null },
    '2': { totalSeconds: INITIAL_TIMES['2'], intervalId: null },
    '3': { totalSeconds: INITIAL_TIMES['3'], intervalId: null },
};

function getDisplayElements(id) {
    return {
        hoursEl: document.getElementById(`hours-${id}`),
        minutesEl: document.getElementById(`minutes-${id}`),
        secondsEl: document.getElementById(`seconds-${id}`),
    };
}

Object.keys(timerStates).forEach(id => {
    updateDisplay(id);
});

function updateDisplay(id) {
    const state = timerStates[id];
    const elements = getDisplayElements(id);
    const total = state.totalSeconds;

    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    if (elements.hoursEl) elements.hoursEl.textContent = String(hours).padStart(2, '0');
    if (elements.minutesEl) elements.minutesEl.textContent = String(minutes).padStart(2, '0');
    if (elements.secondsEl) elements.secondsEl.textContent = String(seconds).padStart(2, '0');
}

function tick(id) {
    const state = timerStates[id];

    if (state.totalSeconds <= 0) {
        stopTimer(id);
        state.totalSeconds = 0;
        updateDisplay(id);
        alert(`Время для таймера ${id} вышло!`);
        return;
    }

    state.totalSeconds--;
    updateDisplay(id);
}

function startTimer(id) {
    const state = timerStates[id];
    
    if (state.totalSeconds === 0) {
        resetTimer(id);
    }
    
    stopTimer(id);

    state.intervalId = setInterval(() => tick(id), 1000);
}

function stopTimer(id) {
    const state = timerStates[id];
    clearInterval(state.intervalId);
    state.intervalId = null;
}

function resetTimer(id) {
    const state = timerStates[id];
    stopTimer(id);
    state.totalSeconds = INITIAL_TIMES[id];
    updateDisplay(id);
}

document.addEventListener('click', (event) => {
    const target = event.target;
    const timerId = target.getAttribute('data-timer-id');
    
    if (!timerId) return;

    if (target.classList.contains('start')) {
        startTimer(timerId);
    } else if (target.classList.contains('stop')) {
        stopTimer(timerId);
    } else if (target.classList.contains('reset')) {
        resetTimer(timerId);
    }
});