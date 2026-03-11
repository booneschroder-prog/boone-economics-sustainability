const gameState = {
    year: 2025,
    week: 0,
    daysElapsed: 0,
    totalDays: 75 * 365,
    elixir: 2,
    maxElixir: 20,
    waterHeight: 0,
    maxWaterHeight: 10,
    dikeHeight: 0,
    elevation: 0,
    hasGenerator: false,
    hasRoof: false,
    hasSolar: false,
    hasRoom: false,
    defenses: [],
    systems: {
        bedroom: true,      // 2nd floor - CRITICAL
        bathroom: true,     // 2nd floor - CRITICAL
        electrical: true,   // 2nd floor - CRITICAL
        cooling: true       // 2nd floor - CRITICAL
    },
    gameRunning: true,
    isHurricane: false,
    usedHeadlines: new Set(),
    gameOver: false,
    gameOverReason: ''
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
    'Study: Saltwater intrusion contaminates 30% of aquifers',
    'Protests erupt over proposed ban on climate education',
    'Rising sea levels threaten major infrastructure projects',
    'New floating house technology tested in Miami',
    'Insurance premiums triple for coastal properties',
    'Climate refugees flee South Florida for inland cities'
];

function getSeaLevel(year) {
    const elapsed = year - 2025;
    return 3 + (elapsed / 75) * 5;
}

function getHurricaneChance(year, week) {
    // No hurricanes in first 10 weeks (weeks 0-9)
    if (year === 2025 && week < 10) {
        return 0;
    }
    
    const elapsed = year - 2025;
    return 0.05 + (elapsed / 75) * 0.35;
}

function isHurricaneWeek(year, week) {
    const chance = getHurricaneChance(year, week);
    const seed = (year * 52 + week) % 100 / 100;
    return seed < chance;
}

function checkCriticalSystems() {
    // All critical systems are on 2nd floor
    // They flood when water height exceeds 2nd floor level (6 feet)
    const floorHeight = 6;
    const totalWater = gameState.waterHeight + getSeaLevel(gameState.year) - gameState.elevation - gameState.dikeHeight;
    
    if (totalWater > floorHeight) {
        // All systems on 2nd floor are destroyed
        return false;
    }
    
    return true;
}

function updateUI() {
    if (gameState.gameOver) return;

    gameState.daysElapsed += 7; // Advance 1 week
    const yearsPassed = Math.floor(gameState.daysElapsed / 365);
    gameState.year = 2025 + yearsPassed;
    gameState.week = Math.floor((gameState.daysElapsed % 365) / 7);

    document.getElementById('year').textContent = gameState.year;
    document.getElementById('week').textContent = gameState.week + 1;

    // Check for hurricane this week (no hurricanes first 10 weeks)
    gameState.isHurricane = isHurricaneWeek(gameState.year, gameState.week);
    
    if (gameState.isHurricane) {
        document.getElementById('status').textContent = '🌀 HURRICANE';
        document.querySelector('.header').classList.add('hurricane-day');
        gameState.waterHeight += 2 + Math.random() * 5; // Bigger surge during hurricane
    } else {
        document.getElementById('status').textContent = '☀️ Normal';
        document.querySelector('.header').classList.remove('hurricane-day');
        gameState.waterHeight = Math.max(0, gameState.waterHeight - 0.3); // Slow recession
    }

    // Elixir generation (50% slower = half the previous rate)
    if (gameState.elixir < gameState.maxElixir) {
        gameState.elixir += gameState.isHurricane ? 0.05 : 0.15;
        gameState.elixir = Math.min(gameState.elixir, gameState.maxElixir);
    }

    // Calculate total water level
    const seaLevel = getSeaLevel(gameState.year);
    const totalWater = gameState.waterHeight + seaLevel - gameState.elevation - gameState.dikeHeight;

    // Check if critical systems are flooded
    const criticalSafe = checkCriticalSystems();
    if (!criticalSafe) {
        endGame('All critical systems on 2nd floor have been destroyed by flooding!');
        return;
    }

    // Water visualization
    const waterPercent = Math.min(totalWater / gameState.maxWaterHeight * 100, 100);
    document.getElementById('water').style.height = waterPercent + '%';
    document.getElementById('waterHeight').textContent = totalWater.toFixed(1);
    document.getElementById('elixir').textContent = gameState.elixir.toFixed(1);
    document.getElementById('fill').style.width = (gameState.elixir / gameState.maxElixir * 100) + '%';

    // Update floor visualization
    const floor2 = document.querySelector('.floor2');
    if (totalWater > 6) {
        floor2.classList.add('flooded');
    } else {
        floor2.classList.remove('flooded');
    }

    // Update systems display
    const systems = document.getElementById('systems');
    systems.innerHTML = '';
    
    if (totalWater > 6) {
        systems.innerHTML = `
            <div class="system-item critical" style="background: #ffcdd2;">
                ❌ ALL CRITICAL SYSTEMS DESTROYED
            </div>
            <div style="font-size: 11px; color: #666; margin-top: 10px;">
                Water height: ${totalWater.toFixed(1)} ft<br>
                2nd floor flooded!
            </div>
        `;
    } else {
        const statusText = `Water height: ${totalWater.toFixed(1)} ft (Safe)`;
        systems.innerHTML = `
            <div class="system-item" style="border-left-color: #4CAF50;">
                ✓ All systems operational
            </div>
            <div style="font-size: 11px; color: #666; margin-top: 10px;">
                ${statusText}
            </div>
        `;
    }

    // Update defenses
    const defensesList = document.getElementById('defensesList');
    defensesList.innerHTML = '';
    if (gameState.defenses.length === 0) {
        defensesList.innerHTML = '<p style="color: #999; font-size: 11px;">No defenses deployed</p>';
    } else {
        gameState.defenses.forEach(d => {
            defensesList.innerHTML += `<div class="defense-item">✓ ${d.icon} ${d.name}</div>`;
        });
    }

    // Update forecast
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const futureWeek = (gameState.week + i) % 52;
        const isHurr = isHurricaneWeek(gameState.year, futureWeek);
        forecast.innerHTML += `<div class="forecast-item ${isHurr ? 'hurricane' : ''}">
            <div>${isHurr ? '🌀' : '☀️'}</div>
            <div>W${i+1}</div>
        </div>`;
    }

    // Update news occasionally
    if (gameState.daysElapsed % 56 === 0) {
        updateNews();
    }

    // Render cards
    renderCards();

    // Check victory condition
    if (gameState.daysElapsed >= gameState.totalDays) {
        endGame('VICTORY! You survived 75 years!');
        return;
    }
}

function endGame(reason) {
    gameState.gameRunning = false;
    gameState.gameOver = true;
    gameState.gameOverReason = reason;
    
    const year = gameState.year;
    const week = gameState.week;
    const water = (gameState.waterHeight + getSeaLevel(gameState.year) - gameState.elevation - gameState.dikeHeight).toFixed(1);
    
    setTimeout(() => {
        alert(`${reason}\n\nYear: ${year}\nWeek: ${week}\nWater Height: ${water} ft`);
    }, 100);
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
    if (!gameState.gameRunning || gameState.gameOver) return;

    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    let cost = card.cost;
    let amount = 1;
    
    if (card.costPerUnit) {
        const input = prompt(`How many feet? (1-${card.max})`, '1');
        if (!input || isNaN(input) || input < 1 || input > card.max) return;
        amount = parseInt(input);
        cost = amount * card.cost;
    }

    if (gameState.elixir < cost) {
        alert('Not enough budget!');
        return;
    }

    gameState.elixir -= cost;

    // Apply effects
    if (card.id === 'dikes') {
        gameState.dikeHeight += amount;
    } else if (card.id === 'elevate') {
        gameState.elevation += amount;
    } else if (card.id === 'gen') {
        gameState.hasGenerator = true;
    } else if (card.id === 'roof') {
        gameState.hasRoof = true;
    } else if (card.id === 'solar') {
        gameState.hasSolar = true;
    } else if (card.id === 'room') {
        gameState.hasRoom = true;
    }

    gameState.defenses.push({ ...card, amount });
    updateUI();
}

function gameLoop() {
    if (!gameState.gameRunning || gameState.gameOver) return;
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
