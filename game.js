const gameState = {
    year: 2025,
    week: 0,
    daysElapsed: 0,
    totalDays: 75 * 365,
    elixir: 2,
    maxElixir: 20,
    waterHeight: 0,
    dikeHeight: 0,
    elevation: 0,
    hasGenerator: false,
    hasRoof: false,
    hasSolar: false,
    hasRoom: false,
    defenses: [],
    systems: {
        bedroom: true,
        bathroom: true,
        electrical: true,
        cooling: true
    },
    gameRunning: true,
    isHurricane: false,
    usedHeadlines: new Set()
};

const cards = [
    { id: 'dikes', name: 'Dikes', icon: '🛡️', cost: 5, costPerUnit: true, max: 10 },
    { id: 'elevate', name: 'Elevate', icon: '⬆️', cost: 15, costPerUnit: true, max: 4 },
    { id: 'gen', name: 'Generator', icon: '⚙️', cost: 6 },
    { id: 'roof', name: 'Roof', icon: '🏠', cost: 5 },
    { id: 'solar', name: 'Solar', icon: '☀️', cost: 9 },
    { id: 'room', name: 'Safe Room', icon: '🛡️', cost: 13 }
];

const headlines = [
    'Heat waves in Gainesville kill 56 UF students',
    'City of Tampa formally dissolves due to ongoing floods',
    'Florida man arrested for vandalizing floating house on TikTok',
    'Miami Beach declares emergency over permanent king tide flooding',
    'New solar farm becomes state largest renewable energy source',
    'Cholera outbreak in Sarasota leaves 1,146 dead',
    'Governor approves $20 billion turnpike expansion to 10 lanes',
    'Gainesville proposes $60 million hurricane shelter',
    'Offshore wind farm near Jacksonville powers 500,000 homes',
    'Study: Saltwater intrusion contaminates 30% of aquifers'
];

function getSeaLevel(year) {
    const elapsed = year - 2025;
    return 3 + (elapsed / 75) * 5;
}

function getHurricaneChance(year) {
    const elapsed = year - 2025;
    return 0.05 + (elapsed / 75) * 0.35;
}

function isHurricaneWeek(year, week) {
    const chance = getHurricaneChance(year);
    const seed = (year * 52 + week) % 100 / 100;
    return seed < chance;
}

function updateUI() {
    gameState.daysElapsed++;
    const yearsPassed = Math.floor(gameState.daysElapsed / 365);
    gameState.year = 2025 + yearsPassed;
    gameState.week = Math.floor((gameState.daysElapsed % 365) / 7);

    document.getElementById('year').textContent = gameState.year;
    document.getElementById('week').textContent = gameState.week + 1;

    // Check for hurricane this week
    gameState.isHurricane = isHurricaneWeek(gameState.year, gameState.week);
    
    if (gameState.isHurricane) {
        document.getElementById('status').textContent = '🌀 HURRICANE';
        gameState.waterHeight += 3 + Math.random() * 4;
    } else {
        document.getElementById('status').textContent = '☀️ Normal';
        gameState.waterHeight = Math.max(0, gameState.waterHeight - 0.5);
    }

    // Elixir generation (50% slower)
    if (gameState.elixir < gameState.maxElixir) {
        gameState.elixir += gameState.isHurricane ? 0.075 : 0.25;
        gameState.elixir = Math.min(gameState.elixir, gameState.maxElixir);
    }

    // Water visualization
    const seaLevel = getSeaLevel(gameState.year);
    const totalWater = gameState.waterHeight + seaLevel - gameState.elevation - gameState.dikeHeight;
    const waterPercent = Math.min(totalWater / 15 * 100, 100);
    
    document.getElementById('water').style.height = waterPercent + '%';
    document.getElementById('elixir').textContent = gameState.elixir.toFixed(1);
    document.getElementById('fill').style.width = (gameState.elixir / gameState.maxElixir * 100) + '%';

    // Update systems
    const systems = document.getElementById('systems');
    systems.innerHTML = '';
    Object.keys(gameState.systems).forEach(system => {
        const isUnderwater = totalWater > (system === 'electrical' || system === 'cooling' ? 9 : 6);
        const status = isUnderwater ? '✗ Down' : '✓ OK';
        const color = isUnderwater ? '#f44336' : '#4CAF50';
        systems.innerHTML += `<div class="system-item" style="border-left-color: ${color};">${system}: ${status}</div>`;
    });

    // Update defenses
    const defensesList = document.getElementById('defensesList');
    defensesList.innerHTML = '';
    gameState.defenses.forEach(d => {
        defensesList.innerHTML += `<div class="defense-item">${d.icon} ${d.name}</div>`;
    });

    // Update forecast
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const futureWeek = (gameState.week + i) % 52;
        const isHurr = isHurricaneWeek(gameState.year, futureWeek);
        forecast.innerHTML += `<div class="forecast-item ${isHurr ? 'hurricane' : ''}">W${i+1}</div>`;
    }

    // Update news
    if (gameState.daysElapsed % 56 === 0) { // Every 8 weeks
        updateNews();
    }

    // Render cards
    renderCards();

    // Check loss condition
    if (Object.values(gameState.systems).every(v => !v)) {
        gameState.gameRunning = false;
        alert(`GAME OVER - Year ${gameState.year}\nAll systems failed!`);
    }

    if (gameState.daysElapsed >= gameState.totalDays) {
        gameState.gameRunning = false;
        alert(`VICTORY - Year ${gameState.year}\nYou survived 75 years!`);
    }
}

function updateNews() {
    const available = headlines.filter(h => !gameState.usedHeadlines.has(h));
    if (available.length === 0) {
        gameState.usedHeadlines.clear();
    }
    
    const selected = available[Math.floor(Math.random() * available.length)];
    gameState.usedHeadlines.add(selected);
    
    const news = document.getElementById('news');
    news.innerHTML = `<div class="news-item">${selected}</div>`;
}

function renderCards() {
    const grid = document.getElementById('cardsGrid');
    grid.innerHTML = '';

    cards.forEach(card => {
        const canAfford = gameState.elixir >= card.cost;
        const div = document.createElement('div');
        div.className = `card ${!canAfford ? 'unavailable' : ''}`;
        div.draggable = canAfford;
        div.dataset.cardId = card.id;

        let costText = card.cost + '';
        if (card.costPerUnit) costText += '/ft';

        div.innerHTML = `
            <div class="card-icon">${card.icon}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-cost">${costText} 💰</div>
        `;

        if (canAfford) {
            div.addEventListener('dragstart', e => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.id);
            });
        }

        grid.appendChild(div);
    });
}

function playCard(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    let cost = card.cost;
    
    if (card.costPerUnit) {
        const amount = prompt(`How many feet? (1-${card.max})`, '1');
        if (!amount || amount < 1 || amount > card.max) return;
        cost = parseInt(amount) * card.cost;
    }

    if (gameState.elixir < cost) {
        alert('Not enough budget!');
        return;
    }

    gameState.elixir -= cost;

    // Apply effects
    if (card.id === 'dikes') {
        gameState.dikeHeight += parseInt(cost / card.cost);
    } else if (card.id === 'elevate') {
        gameState.elevation += parseInt(cost / card.cost);
    } else if (card.id === 'gen') {
        gameState.hasGenerator = true;
    } else if (card.id === 'roof') {
        gameState.hasRoof = true;
    } else if (card.id === 'solar') {
        gameState.hasSolar = true;
    } else if (card.id === 'room') {
        gameState.hasRoom = true;
    }

    gameState.defenses.push(card);
    updateUI();
}

function gameLoop() {
    if (!gameState.gameRunning) return;
    updateUI();
    setTimeout(gameLoop, gameState.isHurricane ? 2000 : 1000);
}

document.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
});

document.addEventListener('drop', e => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    playCard(cardId);
});

window.addEventListener('load', () => {
    updateNews();
    gameLoop();
});
