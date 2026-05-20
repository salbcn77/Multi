const AVATARS = [
    String.fromCodePoint(128054),
    String.fromCodePoint(128056),
    String.fromCodePoint(128061),
    String.fromCodePoint(128062),
    String.fromCodePoint(128065),
    String.fromCodePoint(128067),
    String.fromCodePoint(128068),
    String.fromCodePoint(128073),
    String.fromCodePoint(128074),
    String.fromCodePoint(128076),
    String.fromCodePoint(128078),
    String.fromCodePoint(128079),
    String.fromCodePoint(128081),
    String.fromCodePoint(128082),
    String.fromCodePoint(128083),
    String.fromCodePoint(129428),
    String.fromCodePoint(129429),
    String.fromCodePoint(129430),
    String.fromCodePoint(129431),
    String.fromCodePoint(129432)
];

const CHECK = String.fromCodePoint(9989);
const CROSS = String.fromCodePoint(10060);
const TROPHY = String.fromCodePoint(127942);
const PARTY = String.fromCodePoint(127881);

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

function init() {
    setupAvatarGrid();
    setupEventListeners();
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
}

function showScreen(screenId) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${screenId}`).classList.add('active');
    $('#gameHeader').style.display = screenId === 'gameScreen' ? 'flex' : 'none';
}

function generateQuestions(count) {
    const questions = [];
    for (let i = 0; i < count; i++) {
        let a = Math.floor(Math.random() * 8) + 2;
        let b = Math.floor(Math.random() * 8) + 2;
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
        const inputAttrs = `type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" data-index="${i}" autocomplete="off"`;
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

function correctAnswers() {
    if (gameState.gameActive) {
        clearInterval(gameState.timerInterval);
        gameState.gameActive = false;
        disableInputs();
    }

    document.removeEventListener('keydown', handleKeyboardNav);

    const inputs = $('#questionsContainer input');
    let correctCount = 0;
    let wrongCount = 0;

    inputs.forEach((inp) => {
        const idx = parseInt(inp.dataset.index);
        const q = gameState.questions[idx];
        const card = document.getElementById(`question-${idx}`);
        const statusEl = card.querySelector('.question-status');

        q.userAnswer = inp.value !== '' ? parseInt(inp.value) : null;

        if (q.userAnswer !== null && q.userAnswer === q.answer) {
            card.classList.add('correct');
            card.classList.remove('wrong');
            statusEl.textContent = CHECK;
            correctCount++;
        } else {
            card.classList.add('wrong');
            card.classList.remove('correct');
            statusEl.textContent = CROSS;
            wrongCount++;
        }
    });

    const total = correctCount + wrongCount;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    $('#correctCount').textContent = correctCount;
    $('#wrongCount').textContent = wrongCount;
    $('#scorePercent').textContent = `${percent}%`;

    renderReview();

    setTimeout(() => {
        showScreen('resultsScreen');
    }, 800);
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

    saveToLeaderboard(score).then(() => {
        showModal(`${PARTY} \u00a1Marcador guardado correctamente!`);
    }).catch(err => {
        console.error(err);
        showModal('Error al guardar el marcador. Revisa la configuraci\u00f3n de GitHub.');
    });
}

function showModal(message) {
    $('#modalMessage').textContent = message;
    $('#modalOverlay').style.display = 'flex';
}

init();
