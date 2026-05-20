const LEADERBOARD_STORAGE_KEY = 'multiplication_game_leaderboard';

function getGitHubConfig() {
    const repo = $('#githubRepo').value.trim();
    const token = $('#githubToken').value.trim();
    if (repo && token) {
        const [owner, repoName] = repo.split('/');
        return { owner, repo: repoName, token };
    }
    return null;
}

async function fetchLeaderboardFromGitHub() {
    const config = getGitHubConfig();
    if (!config) return null;

    try {
        const resp = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/leaderboard.json`, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (resp.status === 404) return [];

        if (!resp.ok) throw new Error('Failed to fetch leaderboard');

        const data = await resp.json();
        const decoded = atob(data.content);
        return JSON.parse(decoded);
    } catch (err) {
        console.error('GitHub fetch error:', err);
        return null;
    }
}

async function saveLeaderboardToGitHub(leaderboard) {
    const config = getGitHubConfig();
    if (!config) throw new Error('No GitHub config');

    const content = btoa(JSON.stringify(leaderboard, null, 2));

    let sha = '';
    try {
        const resp = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/leaderboard.json`, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (resp.ok) {
            const data = await resp.json();
            sha = data.sha;
        }
    } catch (e) {
    }

    const body = {
        message: 'Update leaderboard',
        content: content
    };
    if (sha) body.sha = sha;

    const resp = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/leaderboard.json`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${config.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || 'Failed to save leaderboard');
    }
}

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
    return leaderboard.sort((a, b) => {
        if (b.percent !== a.percent) return b.percent - a.percent;
        if (b.total !== a.total) return b.total - a.total;
        return a.timeUsed - b.timeUsed;
    });
}

async function saveToLeaderboard(score) {
    let leaderboard = [];

    try {
        const githubData = await fetchLeaderboardFromGitHub();
        if (githubData !== null) {
            leaderboard = githubData;
        } else {
            leaderboard = getLocalLeaderboard();
        }
    } catch {
        leaderboard = getLocalLeaderboard();
    }

    leaderboard.push(score);
    leaderboard = sortLeaderboard(leaderboard);

    leaderboard = leaderboard.slice(0, 50);

    saveLocalLeaderboard(leaderboard);

    const config = getGitHubConfig();
    if (config) {
        try {
            await saveLeaderboardToGitHub(leaderboard);
        } catch (err) {
            console.error('Failed to save to GitHub:', err);
        }
    }
}

async function loadAndShowLeaderboard() {
    let leaderboard = [];

    try {
        const githubData = await fetchLeaderboardFromGitHub();
        if (githubData !== null) {
            leaderboard = githubData;
        } else {
            leaderboard = getLocalLeaderboard();
        }
    } catch {
        leaderboard = getLocalLeaderboard();
    }

    leaderboard = sortLeaderboard(leaderboard);
    renderLeaderboard(leaderboard);
}

function renderLeaderboard(leaderboard) {
    const container = $('#leaderboardList');
    container.innerHTML = '';

    if (leaderboard.length === 0) {
        container.innerHTML = '<div class="empty-leaderboard">No hay marcadores todav&#237;a. &#161;S&#233; el primero!</div>';
        return;
    }

    leaderboard.forEach((entry, i) => {
        const rank = i + 1;
        let rankClass = '';
        let rankDisplay = rank;

        if (rank === 1) {
            rankClass = 'gold';
            rankDisplay = '&#129351;';
        } else if (rank === 2) {
            rankClass = 'silver';
            rankDisplay = '&#129352;';
        } else if (rank === 3) {
            rankClass = 'bronze';
            rankDisplay = '&#129353;';
        }

        const mins = Math.floor(entry.timeUsed / 60);
        const secs = entry.timeUsed % 60;
        const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;

        const div = document.createElement('div');
        div.className = 'leaderboard-item';
        div.innerHTML = `
            <span class="leaderboard-rank ${rankClass}">${rankDisplay}</span>
            <span class="leaderboard-avatar">${entry.avatar}</span>
            <span class="leaderboard-name">${escapeHtml(entry.name)}</span>
            <span class="leaderboard-score">
                <div class="points">${entry.percent}% (${entry.correct}/${entry.total})</div>
                <div class="time">${timeStr}</div>
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
