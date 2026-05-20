const AVATARS = [
    String.fromCodePoint(128054),
    String.fromCodePoint(128052),
    String.fromCodePoint(128048),
    String.fromCodePoint(128163),
    String.fromCodePoint(129312),
    String.fromCodePoint(128125),
    String.fromCodePoint(128049),
    String.fromCodePoint(129393),
    String.fromCodePoint(128110),
    String.fromCodePoint(129385),
    String.fromCodePoint(129424),
    String.fromCodePoint(127877),
    String.fromCodePoint(128060),
    String.fromCodePoint(129409),
    String.fromCodePoint(128035),
    String.fromCodePoint(128036),
    String.fromCodePoint(129313),
    String.fromCodePoint(129433),
    String.fromCodePoint(128051)
];

const CHECK = String.fromCodePoint(9989);
const CROSS = String.fromCodePoint(10060);
const PARTY = String.fromCodePoint(127881);
const TITLE_EMOJI = String.fromCodePoint(128302);

let gameState = {
    playerName: '',
    playerAvatar: '',
    numQuestions: 20,
    timeMinutes: 5,
    questions: [],
    timeRemaining: 0,
    timerInterval: null,
    gameActive: false
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function init() {
    setupAvatarGrid();
    setupEventListeners();

    const titleEmoji = String.fromCodePoint(128302);
    $('#configTitle').textContent = `Multi ${titleEmoji}`;
}

function setupAvatarGrid() {
    const grid = $('#avatarGrid');
    AVATARS.forEach((avatar) => {
        const div = document.createElement('div');
        div.className = 'avatar-option';
        div.textContent = avatar;
        div.dataset.avatar = avatar;
        div.addEventListener('click', () => selectAvatar(div));
        grid.appendChild(div);
    });
}

function selectAvatar(el) {
    $$('.avatar-option').forEach(a => a.classList.remove('selected'));
    el.classList.add('selected');
    gameState.playerAvatar = el.dataset.avatar;
}

function setupEventListeners() {
    $('#numQuestions').addEventListener('input', (e) => {
        $('#questionsValue').textContent = e.target.value;
    });

    $('#timeMinutes').addEventListener('input', (e) => {
        $('#timeValue').textContent = e.target.value;
    });

    $('#startBtn').addEventListener('click', startGame);
    $('#correctBtn').addEventListener('click', correctAnswers);
    $('#playAgainBtn').addEventListener('click', () => showScreen('configScreen'));
    $('#viewLeaderboardBtn').addEventListener('click', () => {
        loadAndShowLeaderboard();
        showScreen('leaderboardScreen');
    });
    $('#goToLeaderboardBtn').addEventListener('click', () => {
        loadAndShowLeaderboard();
        showScreen('leaderboardScreen');
    });
    $('#saveScoreBtn').addEventListener('click', saveScore);
    $('#backToConfigBtn').addEventListener('click', () => showScreen('configScreen'));
    $('#modalOkBtn').addEventListener('click', () => $('#modalOverlay').style.display = 'none');

    const themeBtn1 = $('#themeToggle');
    const themeBtn2 = $('#themeToggleConfig');
    if (themeBtn1) themeBtn1.addEventListener('click', toggleTheme);
    if (themeBtn2) themeBtn2.addEventListener('click', toggleTheme);
}

function showScreen(screenId) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${screenId}`).classList.add('active');
    $('#gameHeader').style.display = screenId === 'gameScreen' ? 'flex' : 'none';

    if (screenId === 'gameScreen') {
        const themeBtn = $('#themeToggle');
        const theme = getTheme();
        themeBtn.textContent = theme === 'dark' ? String.fromCodePoint(9788) : String.fromCodePoint(9790);
    }
}

function generateQuestions(count) {
    const questions = [];
    for (let i = 0; i < count; i++) {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const result = a * b;
        const missing = Math.floor(Math.random() * 3);

        let equation, answer;
        switch (missing) {
            case 0:
                equation = { left: a, middle: b, equals: result, missing: 'result' };
                answer = result;
                break;
            case 1:
                equation = { left: '?', middle: b, equals: result, missing: 'left' };
                answer = a;
                break;
            case 2:
                equation = { left: a, middle: '?', equals: result, missing: 'middle' };
                answer = b;
                break;
        }

        questions.push({ equation, answer, userAnswer: null });
    }
    return questions;
}

function renderQuestions() {
    const container = $('#questionsContainer');
    container.innerHTML = '';

    gameState.questions.forEach((q, i) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = `question-${i}`;

        const eq = q.equation;
        const inputAttrs = `type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3" data-index="${i}" autocomplete="off"`;
        let html = '';

        if (eq.missing === 'left') {
            html += `<input ${inputAttrs}>`;
            html += ` <span class="operator">\u00d7</span> `;
            html += `<span>${eq.middle}</span>`;
        } else if (eq.missing === 'middle') {
            html += `<span>${eq.left}</span> `;
            html += `<span class="operator">\u00d7</span> `;
            html += `<input ${inputAttrs}>`;
        } else {
            html += `<span>${eq.left}</span> `;
            html += `<span class="operator">\u00d7</span> `;
            html += `<span>${eq.middle}</span>`;
        }

        html += ` <span class="equals">=</span> `;
        if (eq.missing === 'result') {
            html += `<input ${inputAttrs}>`;
        } else {
            html += `<span>${eq.equals}</span>`;
        }

        html += `<span class="question-status"></span>`;

        card.innerHTML = html;
        container.appendChild(card);
    });

    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    });
}

function startGame() {
    const name = $('#playerName').value.trim();
    if (!name) {
        showModal('Por favor, introduce tu nombre.');
        return;
    }
    if (!gameState.playerAvatar) {
        showModal('Por favor, elige un avatar.');
        return;
    }

    gameState.playerName = name;
    gameState.numQuestions = parseInt($('#numQuestions').value);
    gameState.timeMinutes = parseInt($('#timeMinutes').value);
    gameState.timeRemaining = gameState.timeMinutes * 60;
    gameState.questions = generateQuestions(gameState.numQuestions);
    gameState.gameActive = true;

    $('#headerAvatar').textContent = gameState.playerAvatar;
    $('#headerName').textContent = gameState.playerName;

    renderQuestions();
    updateTimerDisplay();
    showScreen('gameScreen');
    hideScoreTracker();

    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timerInterval);
            gameState.gameActive = false;
            disableInputs();
        }
    }, 1000);

    const firstInput = $('#questionsContainer input');
    if (firstInput) firstInput.focus();

    document.addEventListener('keydown', handleKeyboardNav);
}

function disableInputs() {
    const container = $('#questionsContainer');
    container.querySelectorAll('input').forEach(inp => {
        inp.disabled = true;
    });
}

function handleKeyboardNav(e) {
    if (!gameState.gameActive) return;
    const inputs = Array.from($('#questionsContainer input'));
    const current = document.activeElement;
    const idx = inputs.indexOf(current);

    if (e.key === 'Enter') {
        e.preventDefault();
        if (idx < inputs.length - 1) {
            inputs[idx + 1].focus();
        } else {
            correctAnswers();
        }
    } else if (e.key === 'ArrowDown' && idx < inputs.length - 1) {
        e.preventDefault();
        inputs[idx + 1].focus();
    } else if (e.key === 'ArrowUp' && idx > 0) {
        e.preventDefault();
        inputs[idx - 1].focus();
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(gameState.timeRemaining / 60);
    const secs = gameState.timeRemaining % 60;
    $('#timeDisplay').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const timer = $('#timer');
    timer.classList.remove('warning', 'danger');
    if (gameState.timeRemaining <= 60) {
        timer.classList.add('danger');
    } else if (gameState.timeRemaining <= 180) {
        timer.classList.add('warning');
    }
}

function showScoreTracker() {
    $('#scoreTracker').style.display = 'flex';
    $('#trackerCorrect').textContent = '0';
    $('#trackerWrong').textContent = '0';
}

function hideScoreTracker() {
    $('#scoreTracker').style.display = 'none';
}

function updateTracker(correct, wrong) {
    $('#trackerCorrect').textContent = correct;
    $('#trackerWrong').textContent = wrong;
}

async function correctAnswers() {
    if (gameState.gameActive) {
        clearInterval(gameState.timerInterval);
        gameState.gameActive = false;
        disableInputs();
    }

    document.removeEventListener('keydown', handleKeyboardNav);

    const correctBtn = $('#correctBtn');
    correctBtn.disabled = true;
    correctBtn.textContent = 'Corrigiendo...';

    showScoreTracker();

    let correctCount = 0;
    let wrongCount = 0;

    for (let i = 0; i < gameState.questions.length; i++) {
        const q = gameState.questions[i];
        const card = document.getElementById(`question-${i}`);
        const statusEl = card.querySelector('.question-status');
        const input = card.querySelector('input');

        q.userAnswer = input && input.value !== '' ? parseInt(input.value) : null;

        await sleep(150);

        card.classList.remove('correct', 'wrong');
        if (q.userAnswer !== null && q.userAnswer === q.answer) {
            card.classList.add('correct');
            statusEl.textContent = CHECK;
            correctCount++;
        } else {
            card.classList.add('wrong');
            statusEl.textContent = CROSS;
            wrongCount++;
        }

        updateTracker(correctCount, wrongCount);
    }

    await sleep(500);

    const total = correctCount + wrongCount;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    $('#correctCount').textContent = correctCount;
    $('#wrongCount').textContent = wrongCount;
    $('#scorePercent').textContent = `${percent}%`;

    renderReview();

    correctBtn.textContent = 'Corregir';
    correctBtn.disabled = false;

    showScreen('resultsScreen');
    hideScoreTracker();
}

function renderReview() {
    const container = $('#questionsReview');
    container.innerHTML = '<h3 style="margin-bottom: 12px; color: var(--text-muted);">Revisi\u00f3n</h3>';

    gameState.questions.forEach((q) => {
        const eq = q.equation;
        let equation = '';

        if (eq.missing === 'left') {
            equation = `${q.userAnswer !== null ? q.userAnswer : '-'} \u00d7 ${eq.middle} = ${eq.equals}`;
        } else if (eq.missing === 'middle') {
            equation = `${eq.left} \u00d7 ${q.userAnswer !== null ? q.userAnswer : '-'} = ${eq.equals}`;
        } else {
            equation = `${eq.left} \u00d7 ${eq.middle} = ${q.userAnswer !== null ? q.userAnswer : '-'}`;
        }

        const isCorrect = q.userAnswer !== null && q.userAnswer === q.answer;
        const div = document.createElement('div');
        div.className = `review-item ${isCorrect ? 'correct' : 'wrong'}`;
        div.innerHTML = `
            <span class="review-equation">${equation}</span>
            <span class="review-status">${isCorrect ? CHECK : CROSS}</span>
        `;
        container.appendChild(div);
    });
}

function saveScore() {
    const total = gameState.questions.length;
    const correct = gameState.questions.filter(q => q.userAnswer !== null && q.userAnswer === q.answer).length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeUsed = (gameState.timeMinutes * 60) - gameState.timeRemaining;

    const score = {
        name: gameState.playerName,
        avatar: gameState.playerAvatar,
        correct,
        total,
        percent,
        timeUsed,
        date: new Date().toISOString()
    };

    saveToLeaderboard(score);
    showModal(`${PARTY} \u00a1Marcador guardado correctamente!`);
}

function showModal(message) {
    $('#modalMessage').textContent = message;
    $('#modalOverlay').style.display = 'flex';
}

function getTheme() {
    return localStorage.getItem('multi-theme') || 'dark';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('multi-theme', theme);
    updateThemeButtons();
}

function toggleTheme() {
    const current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
}

function updateThemeButtons() {
    const theme = getTheme();
    const icon = theme === 'dark' ? String.fromCodePoint(9788) : String.fromCodePoint(9790);
    const label = theme === 'dark' ? 'Tema Oscuro' : 'Tema Claro';
    const iconEl = $('#themeIcon');
    const labelEl = $('#themeLabel');
    if (iconEl) iconEl.textContent = icon;
    if (labelEl) labelEl.textContent = label;
}

init();
setTheme(getTheme());
