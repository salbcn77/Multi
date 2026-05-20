const AVATARS = [
    '&#128054;', '&#128056;', '&#128061;', '&#128062;', '&#128065;',
    '&#128067;', '&#128068;', '&#128073;', '&#128074;', '&#128076;',
    '&#128078;', '&#128079;', '&#128081;', '&#128082;', '&#128083;',
    '&#129428;', '&#129429;', '&#129430;', '&#129431;', '&#129432;'
];

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
    AVATARS.forEach((avatar, i) => {
        const div = document.createElement('div');
        div.className = 'avatar-option';
        div.innerHTML = avatar;
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
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        const result = a * b;
        const missing = Math.floor(Math.random() * 3);

        let equation, answer;
        switch (missing) {
            case 0:
                equation = { left: a, operator: '&#215;', middle: b, equals: result, missing: 'result' };
                answer = result;
                break;
            case 1:
                equation = { left: '?', operator: '&#215;', middle: b, equals: result, missing: 'left' };
                answer = a;
                break;
            case 2:
                equation = { left: a, operator: '&#215;', middle: '?', equals: result, missing: 'middle' };
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
        card.dataset.index = i;

        const eq = q.equation;
        const missingAttr = `data-index="${i}"`;
        const inputAttrs = `type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" ${missingAttr} autocomplete="off"`;
        let html = '';

        if (eq.missing === 'left') {
            html += `<input ${inputAttrs}>`;
            html += ` <span class="operator">&times;</span> `;
            html += `<span>${eq.middle}</span>`;
        } else if (eq.missing === 'middle') {
            html += `<span>${eq.left}</span> `;
            html += `<span class="operator">&times;</span> `;
            html += `<input ${inputAttrs}>`;
        } else {
            html += `<span>${eq.left}</span> `;
            html += `<span class="operator">&times;</span> `;
            html += `<span>${eq.middle}</span>`;
        }

        html += ` <span class="equals">=</span> `;
        if (eq.missing === 'result') {
            html += `<input ${inputAttrs}>`;
        } else {
            html += `<span>${eq.equals}</span>`;
        }

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
            endGame();
        }
    }, 1000);

    const firstInput = $('#questionsContainer input');
    if (firstInput) firstInput.focus();

    document.addEventListener('keydown', handleKeyboardNav);
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

function endGame() {
    gameState.gameActive = false;
    const inputs = $('#questionsContainer input');
    inputs.forEach(inp => inp.disabled = true);
    $('#correctBtn').disabled = false;
}

function correctAnswers() {
    if (gameState.gameActive) {
        clearInterval(gameState.timerInterval);
        endGame();
    }

    document.removeEventListener('keydown', handleKeyboardNav);

    const inputs = $('#questionsContainer input');
    let correct = 0;
    let wrong = 0;

    gameState.questions.forEach((q, i) => {
        q.userAnswer = null;
    });

    inputs.forEach((inp) => {
        const idx = parseInt(inp.dataset.index);
        const q = gameState.questions[idx];
        const card = inp.closest('.question-card');
        q.userAnswer = parseInt(inp.value);

        const existingStatus = card.querySelector('.question-status');
        if (existingStatus) existingStatus.remove();

        const existingReveal = card.querySelector('.answer-reveal');
        if (existingReveal) existingReveal.remove();

        card.classList.remove('correct', 'wrong');

        if (isNaN(q.userAnswer) || q.userAnswer !== q.answer) {
            card.classList.add('wrong');
            wrong++;
            const status = document.createElement('span');
            status.className = 'question-status';
            status.innerHTML = '&#10008;';
            card.appendChild(status);
            const reveal = document.createElement('span');
            reveal.className = 'answer-reveal';
            reveal.textContent = ` (${q.answer})`;
            card.appendChild(reveal);
        } else {
            card.classList.add('correct');
            correct++;
            const status = document.createElement('span');
            status.className = 'question-status';
            status.innerHTML = '&#10004;';
            card.appendChild(status);
        }
    });

    const total = correct + wrong;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    $('#correctCount').textContent = correct;
    $('#wrongCount').textContent = wrong;
    $('#scorePercent').textContent = `${percent}%`;

    renderReview();
    showScreen('resultsScreen');
}

function renderReview() {
    const container = $('#questionsReview');
    container.innerHTML = '<h3 style="margin-bottom: 12px; color: var(--text-muted);">Revisi&#243;n</h3>';

    gameState.questions.forEach((q) => {
        const eq = q.equation;
        let equation = '';

        if (eq.missing === 'left') {
            equation = `${q.userAnswer !== null ? q.userAnswer : '-'} ${eq.operator} ${eq.middle} = ${eq.equals}`;
        } else if (eq.missing === 'middle') {
            equation = `${eq.left} ${eq.operator} ${q.userAnswer !== null ? q.userAnswer : '-'} = ${eq.equals}`;
        } else {
            equation = `${eq.left} ${eq.operator} ${eq.middle} = ${q.userAnswer !== null ? q.userAnswer : '-'}`;
        }

        const isCorrect = q.userAnswer === q.answer;
        const div = document.createElement('div');
        div.className = `review-item ${isCorrect ? 'correct' : 'wrong'}`;
        div.innerHTML = `
            <span class="review-equation">${equation}</span>
            <span class="review-status">${isCorrect ? '&#10004;' : '&#10008;'}</span>
        `;
        container.appendChild(div);
    });
}

function saveScore() {
    const total = gameState.questions.length;
    const correct = gameState.questions.filter(q => q.userAnswer === q.answer).length;
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
        showModal('&#127881; &#161;Marcador guardado correctamente!');
    }).catch(err => {
        console.error(err);
        showModal('Error al guardar el marcador. Revisa la configuraci&#243;n de GitHub.');
    });
}

function showModal(message) {
    $('#modalMessage').innerHTML = message;
    $('#modalOverlay').style.display = 'flex';
}

init();
