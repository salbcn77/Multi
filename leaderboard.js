const LEADERBOARD_STORAGE_KEY = 'multiplication_game_leaderboard';

function getLocalLeaderboard() {
    try {
        return JSON.parse(localStorage.getItem(LEADERBOARD_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveLocalLeaderboard(leaderboard) {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
}

function sortLeaderboard(leaderboard) {
    return leaderboard.slice().sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.percent !== a.percent) return b.percent - a.percent;
        return a.timeUsed - b.timeUsed;
    });
}

function saveToLeaderboard(score) {
    let leaderboard = getLocalLeaderboard();
    leaderboard.push(score);
    leaderboard = sortLeaderboard(leaderboard);
    leaderboard = leaderboard.slice(0, 50);
    saveLocalLeaderboard(leaderboard);
}

function loadAndShowLeaderboard() {
    const leaderboard = sortLeaderboard(getLocalLeaderboard());
    renderLeaderboard(leaderboard);
    $('#clearLeaderboardBtn').style.display = leaderboard.length > 0 ? 'block' : 'none';
}

function renderLeaderboard(leaderboard) {
    const container = $('#leaderboardList');
    container.innerHTML = '';

    if (leaderboard.length === 0) {
        container.innerHTML = '<div class="empty-leaderboard">No hay marcadores todav\u00eda. \u00a1S\u00e9 el primero!</div>';
        return;
    }

    leaderboard.forEach((entry, i) => {
        const rank = i + 1;
        let rankClass = '';
        let rankDisplay = rank;

        if (rank === 1) {
            rankClass = 'gold';
            rankDisplay = String.fromCodePoint(129351);
        } else if (rank === 2) {
            rankClass = 'silver';
            rankDisplay = String.fromCodePoint(129352);
        } else if (rank === 3) {
            rankClass = 'bronze';
            rankDisplay = String.fromCodePoint(129353);
        }

        const mins = Math.floor(entry.timeUsed / 60);
        const secs = entry.timeUsed % 60;
        const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;
        const score = entry.score || (entry.correct * 10);

        const div = document.createElement('div');
        div.className = 'leaderboard-item';
        div.innerHTML = `
            <span class="leaderboard-rank ${rankClass}">${rankDisplay}</span>
            <span class="leaderboard-avatar">${entry.avatar}</span>
            <span class="leaderboard-name">${escapeHtml(entry.name)}</span>
            <span class="leaderboard-score">
                <div class="points">${score} pts</div>
                <div class="time">${entry.percent}% (${entry.correct}/${entry.total})</div>
                ${entry.difficulty ? `<div class="leaderboard-difficulty">${entry.difficulty}</div>` : ''}
            </span>
        `;
        container.appendChild(div);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
