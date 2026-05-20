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

const DIFFICULTIES = {
    easy: { min: 2, max: 5, label: 'F\u00e1cil' },
    normal: { min: 2, max: 7, label: 'Normal' },
    hard: { min: 2, max: 9, label: 'Dif\u00edcil' }
};

let gameState = {
    playerName: '',
    playerAvatar: '',
    difficulty: 'normal',
    focusedTables: [],
    numQuestions: 20,
    timeMinutes: 5,
    questions: [],
    timeRemaining: 0,
    timerInterval: null,
    gameActive: false,
    currentIndex: 0
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function init() {
    setupAvatarGrid();
    setupDifficultyButtons();
    setupPracticeGrid();
    setupEventListeners();

    $('#configTitle').textContent = 'Juego';
    $('#configSubtitle').textContent = 'de Multiplicar';
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

function setupDifficultyButtons() {
    $$('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.diff-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            gameState.difficulty = btn.dataset.diff;
        });
    });
}

function setupPracticeGrid() {
    const grid = $('#practiceGrid');
    for (let i = 2; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.className = 'practice-btn';
        btn.textContent = `\u00d7${i}`;
        btn.dataset.table = i;
        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            updateFocusedTables();
        });
        grid.appendChild(btn);
    }
}

function updateFocusedTables() {
    const selected = Array.from($$('.practice-btn.selected')).map(b => parseInt(b.dataset.table));
    gameState.focusedTables = selected;
    $('#clearPracticeBtn').style.display = selected.length > 0 ? 'block' : 'none';
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
    $('#skipBtn').addEventListener('click', skipQuestion);
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
    $('#clearPracticeBtn').addEventListener('click', () => {
        $$('.practice-btn').forEach(b => b.classList.remove('selected'));
        updateFocusedTables();
    });
    $('#clearLeaderboardBtn').addEventListener('click', () => {
        if (confirm('\u00bfEst\u00e1s seguro de que quieres borrar todos los marcadores?')) {
            localStorage.removeItem('multiplication_game_leaderboard');
            loadAndShowLeaderboard();
        }
    });

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

    if (screenId === 'configScreen') {
        hideConfetti();
    }
}

function generateQuestions(count) {
    const diff = DIFFICULTIES[gameState.difficulty];
    const tables = gameState.focusedTables.length > 0
        ? gameState.focusedTables
        : [];

    const questions = [];
    let attempts = 0;

    while (questions.length < count && attempts < count * 10) {
        attempts++;
        let a, b;

        if (tables.length > 0) {
            a = tables[Math.floor(Math.random() * tables.length)];
            b = Math.floor(Math.random() * (diff.max - diff.min + 1)) + diff.min;
            if (Math.random() > 0.5) {
                [a, b] = [b, a];
            }
        } else {
            a = Math.floor(Math.random() * (diff.max - diff.min + 1)) + diff.min;
            b = Math.floor(Math.random() * (diff.max - diff.min + 1)) + diff.min;
        }

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

        questions.push({ equation, answer, userAnswer: null, skipped: false });
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

    gameState.currentIndex = 0;
    focusCurrentInput();
}

function focusCurrentInput() {
    const input = document.querySelector(`#question-${gameState.currentIndex} input`);
    if (input) input.focus();
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
    gameState.currentIndex = 0;

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
            gameState.currentIndex = idx + 1;
        } else {
            correctAnswers();
        }
    } else if (e.key === 'ArrowDown' && idx < inputs.length - 1) {
        e.preventDefault();
        inputs[idx + 1].focus();
        gameState.currentIndex = idx + 1;
    } else if (e.key === 'ArrowUp' && idx > 0) {
        e.preventDefault();
        inputs[idx - 1].focus();
        gameState.currentIndex = idx - 1;
    }
}

function skipQuestion() {
    if (!gameState.gameActive) return;
    const inputs = Array.from($('#questionsContainer input'));
    const currentIdx = gameState.currentIndex;

    const next = inputs[currentIdx + 1];
    if (next) {
        next.focus();
        gameState.currentIndex = currentIdx + 1;
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
    const skipBtn = $('#skipBtn');
    correctBtn.disabled = true;
    skipBtn.disabled = true;
    correctBtn.textContent = 'Corrigiendo...';

    showScoreTracker();

    let correctCount = 0;
    let wrongCount = 0;
    const tableStats = {};

    for (let i = 2; i <= 9; i++) {
        tableStats[i] = { correct: 0, wrong: 0, skipped: 0, total: 0 };
    }

    for (let i = 0; i < gameState.questions.length; i++) {
        const q = gameState.questions[i];
        const card = document.getElementById(`question-${i}`);
        const statusEl = card.querySelector('.question-status');
        const input = card.querySelector('input');

        q.userAnswer = input && input.value !== '' ? parseInt(input.value) : null;

        if (!q.userAnswer && input && input.value === '') {
            q.skipped = true;
        }

        await sleep(150);

        card.classList.remove('correct', 'wrong', 'skipped');

        const factors = getFactors(q.equation);
        factors.forEach(f => {
            if (tableStats[f]) {
                tableStats[f].total++;
            }
        });

        if (q.skipped || q.userAnswer === null || q.userAnswer !== q.answer) {
            if (q.skipped) {
                statusEl.textContent = '\u23ed\uFE0F';
                if (tableStats[factors[0]]) tableStats[factors[0]].skipped++;
                if (tableStats[factors[1]]) tableStats[factors[1]].skipped++;
            } else {
                card.classList.add('wrong');
                statusEl.textContent = CROSS;
                factors.forEach(f => {
                    if (tableStats[f]) tableStats[f].wrong++;
                });
            }
            wrongCount++;
        } else {
            card.classList.add('correct');
            statusEl.textContent = CHECK;
            factors.forEach(f => {
                if (tableStats[f]) tableStats[f].correct++;
            });
            correctCount++;
        }
    }

    const total = correctCount + wrongCount;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const timeBonus = correctCount > 0 ? Math.floor(gameState.timeRemaining * correctCount / 10) : 0;
    const finalScore = (correctCount * 10) + timeBonus;

    $('#correctCount').textContent = correctCount;
    $('#wrongCount').textContent = wrongCount;
    $('#scorePercent').textContent = `${percent}%`;
    $('#timeBonus').textContent = timeBonus;
    $('#totalScore').textContent = finalScore;

    renderStats(tableStats);
    renderReview();

    if (percent === 100 && total > 0) {
        launchConfetti();
    }

    await sleep(500);

    correctBtn.textContent = 'Corregir';
    correctBtn.disabled = false;
    skipBtn.disabled = false;

    showScreen('resultsScreen');
    hideScoreTracker();
}

function getFactors(eq) {
    if (eq.missing === 'left') {
        return [parseInt(eq.middle), eq.equals];
    } else if (eq.missing === 'middle') {
        return [parseInt(eq.left), eq.equals];
    } else {
        return [parseInt(eq.left), parseInt(eq.middle)];
    }
}

function renderStats(stats) {
    const container = $('#statsSection');

    const tablesWithData = Object.entries(stats).filter(([_, v]) => v.total > 0);
    if (tablesWithData.length === 0) {
        container.innerHTML = '';
        return;
    }

    const sorted = Object.entries(stats)
        .filter(([_, v]) => v.total > 0)
        .sort((a, b) => b[1].wrong - a[1].wrong);

    let html = '<h3 style="margin-bottom: 12px; color: var(--text-muted);">Estad\u00edsticas por tabla</h3>';
    html += '<div class="stats-tables">';

    sorted.forEach(([table, data]) => {
        const barWidth = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        html += `
            <div class="stat-table-row">
                <span class="stat-table-label">\u00d7${table}</span>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${barWidth}%; background: ${barWidth === 100 ? 'var(--success)' : barWidth >= 50 ? 'var(--warning)' : 'var(--danger)'}"></div>
                </div>
                <span class="stat-table-score">${data.correct}/${data.total}${data.skipped > 0 ? ` (${data.skipped} salt.)` : ''}</span>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function renderReview() {
    const container = $('#questionsReview');
    container.innerHTML = '<h3 style="margin-bottom: 12px; color: var(--text-muted);">Revisi\u00f3n</h3>';

    gameState.questions.forEach((q) => {
        const eq = q.equation;
        let equation = '';

        if (eq.missing === 'left') {
            const val = q.skipped ? '-' : (q.userAnswer !== null ? q.userAnswer : '-');
            equation = `${val} \u00d7 ${eq.middle} = ${eq.equals}`;
        } else if (eq.missing === 'middle') {
            const val = q.skipped ? '-' : (q.userAnswer !== null ? q.userAnswer : '-');
            equation = `${eq.left} \u00d7 ${val} = ${eq.equals}`;
        } else {
            const val = q.skipped ? '-' : (q.userAnswer !== null ? q.userAnswer : '-');
            equation = `${eq.left} \u00d7 ${eq.middle} = ${val}`;
        }

        let status = CROSS;
        let cls = 'wrong';
        if (q.skipped) {
            status = '\u23ED\uFE0F';
            cls = 'skipped';
        } else if (q.userAnswer === q.answer) {
            status = CHECK;
            cls = 'correct';
        }

        const div = document.createElement('div');
        div.className = `review-item ${cls}`;
        div.innerHTML = `
            <span class="review-equation">${equation}</span>
            <span class="review-status">${status}</span>
        `;
        container.appendChild(div);
    });
}

function saveScore() {
    const total = gameState.questions.length;
    const correct = gameState.questions.filter(q => !q.skipped && q.userAnswer === q.answer).length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeUsed = (gameState.timeMinutes * 60) - gameState.timeRemaining;
    const timeBonus = Math.floor(gameState.timeRemaining * correct / 10);
    const finalScore = (correct * 10) + timeBonus;

    const score = {
        name: gameState.playerName,
        avatar: gameState.playerAvatar,
        correct,
        total,
        percent,
        timeUsed,
        score: finalScore,
        difficulty: DIFFICULTIES[gameState.difficulty].label,
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

function launchConfetti() {
    const container = $('#confettiContainer');
    container.innerHTML = '';
    container.style.display = 'block';

    const colors = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    const pieces = 80;

    for (let i = 0; i < pieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '-20px';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.width = (Math.random() * 8 + 6) + 'px';
        piece.style.height = (Math.random() * 14 + 8) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        container.appendChild(piece);
    }

    setTimeout(() => {
        hideConfetti();
    }, 5000);
}

function hideConfetti() {
    const container = $('#confettiContainer');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }
}

init();
setTheme(getTheme());
