// Game state with 75-year progression (2025-2100)
const gameState = {
    currentYear: 2025,
    daysElapsed: 0,
    totalDays: 75 * 365, // 75 years
    elixir: 10,
    maxElixir: 10,
    gameRunning: true,
    defenses: [],
    downedSystems: new Set(),
    waterHeight: 0,
    maxWaterHeight: 15,
    isHurricaneDay: false,
    windSpeed: 5,
    
    systems: {
        bedroom: { name: 'Bedroom', icon: '🛏️', element: 'systemBedroom', floorLevel: 2 },
        bathroom: { name: 'Bathroom', icon: '🚿', element: 'systemBathroom', floorLevel: 1 },
        kitchen: { name: 'Kitchen', icon: '🍳', element: 'systemKitchen', floorLevel: 1 },
        electrical: { name: 'Electrical', icon: '⚡', element: 'systemElectrical', floorLevel: 0 },
        cooling: { name: 'Cooling', icon: '❄️', element: 'systemCooling', floorLevel: 0 }
    }
};

// Defense cards - defenses only fail on hurricane days
const cards = [
    {
        id: 'dikes',
        name: 'Dikes/Levees',
        icon: '🛡️',
        cost: 2,
        chanceOfDamage: 0.5,
        downtime: 0,
        description: 'Reduce flood level by 2ft',
        effect: (state) => {
            state.waterHeight = Math.max(0, state.waterHeight - 2);
        }
    },
    {
        id: 'abandon',
        name: 'Abandon Lower Floors',
        icon: '🏃',
        cost: 1,
        chanceOfDamage: 0.3,
        downtime: 0,
        description: 'Relocate to upper floors',
        effect: (state) => {
            // Protects ground/1st floor systems
        }
    },
    {
        id: 'elevate',
        name: 'Elevate Structure',
        icon: '🏗️',
        cost: 5,
        chanceOfDamage: 0.05,
        downtime: 12,
        description: 'Raise entire house (+3ft)',
        effect: (state) => {
            // Permanent elevation bonus
        }
    },
    {
        id: 'generator',
        name: 'Backup Generator',
        icon: '⚙️',
        cost: 4,
        chanceOfDamage: 0.2,
        downtime: 10,
        description: 'Backup power supply',
        effect: (state) => {
            // Protects electrical
        }
    },
    {
        id: 'aerodynamic',
        name: 'Aerodynamic Roof',
        icon: '🌪️',
        cost: 3,
        chanceOfDamage: 0.25,
        downtime: 10,
        description: 'Wind-resistant roof',
        effect: (state) => {
            // Reduces wind damage
        }
    },
    {
        id: 'hurricane-room',
        name: 'Hurricane Room',
        icon: '🏠',
        cost: 2,
        chanceOfDamage: 0.1,
        downtime: 8,
        description: 'Reinforced safe room',
        effect: (state) => {
            // Guaranteed protection
        }
    }
];

// Calculate hurricane probability based on year
function getHurricaneChance(year) {
    const yearsElapsed = year - 2025;
    const baseProbability = 0.05;
    const maxProbability = 0.40;
    const increase = (maxProbability - baseProbability) / 75;
    return Math.min(baseProbability + (yearsElapsed * increase), maxProbability);
}

// Calculate sea level rise based on year
function getSeaLevelRise(year) {
    const yearsElapsed = year - 2025;
    return (yearsElapsed / 75) * 4;
}

// Calculate maximum wind speed based on year
function getMaxWindSpeed(year) {
    const yearsElapsed = year - 2025;
    const baseWind = 50;
    const maxWind = 180;
    const increase = (maxWind - baseWind) / 75;
    return baseWind + (yearsElapsed * increase);
}

// Determine if today is a hurricane day
function determineHurricaneDay(year, dayOfYear) {
    const hurricaneChance = getHurricaneChance(year);
    const seed = (year * 365 + dayOfYear) % 100;
    return seed < (hurricaneChance * 100);
}

// Initialize game
function initGame() {
    showInfoModal();
    renderCards();
    updateUI();
    gameLoop();
}

// Show info modal
function showInfoModal() {
    document.getElementById('infoModal').classList.add('active');
}

function closeInfo() {
    document.getElementById('infoModal').classList.remove('active');
}

// Render cards
function renderCards() {
    const cardsGrid = document.getElementById('cardsGrid');
    cardsGrid.innerHTML = '';

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.draggable = true;
        cardElement.dataset.cardId = card.id;

        const canAfford = gameState.elixir >= card.cost;
        if (!canAfford) {
            cardElement.classList.add('unavailable');
        }

        cardElement.innerHTML = `
            <div class="card-icon">${card.icon}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-cost">Cost: ${card.cost} 💰</div>
            <div class="card-stats">
                <div>Risk: ${(card.chanceOfDamage * 100).toFixed(0)}%*</div>
                <div>Downtime: ${card.downtime}h</div>
            </div>
        `;

        if (canAfford) {
            cardElement.addEventListener('dragstart', handleDragStart);
            cardElement.addEventListener('dragend', handleDragEnd);
        }

        cardsGrid.appendChild(cardElement);
    });
    
    // Add note about hurricane days
    const note = document.createElement('p');
    note.style.fontSize = '11px';
    note.style.color = '#666';
    note.style.marginTop = '10px';
    note.innerHTML = '* Defenses only fail on HURRICANE DAYS. Safe to build on normal days!';
    document.querySelector('.cards-container').appendChild(note);
}

// Drag and drop
function handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.cardId);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// Play card
function playCard(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    if (gameState.elixir < card.cost) {
        alert('Not enough Budget Points!');
        return;
    }

    gameState.elixir -= card.cost;

    // Defenses only fail on hurricane days
    const failChance = gameState.isHurricaneDay ? card.chanceOfDamage : 0;
    
    if (Math.random() < failChance) {
        addDefense(card, true);
        damageRandomSystem();
    } else {
        card.effect(gameState);
        addDefense(card, false);
    }

    // Trigger downtime
    if (card.downtime > 0) {
        setTimeout(() => {
            removeDefense(cardId);
        }, card.downtime * 3000);
    }

    updateUI();
    renderCards();
}

// Add defense to active list
function addDefense(card, failed) {
    const defense = {
        id: card.id + '_' + Date.now(),
        card: card,
        failed: failed,
        timestamp: Date.now()
    };

    gameState.defenses.push(defense);
    updateDefensesList();
}

// Remove defense
function removeDefense(cardId) {
    gameState.defenses = gameState.defenses.filter(d => !d.id.startsWith(cardId));
    updateDefensesList();
}

// Damage random system
function damageRandomSystem() {
    const systems = Object.keys(gameState.systems);
    const randomSystem = systems[Math.floor(Math.random() * systems.length)];
    damageSystem(randomSystem);
}

// Damage specific system
function damageSystem(systemKey) {
    if (!gameState.downedSystems.has(systemKey)) {
        gameState.downedSystems.add(systemKey);
        const systemElement = document.getElementById(gameState.systems[systemKey].element);
        systemElement.classList.add('damaged');

        // Recovery on normal days
        setTimeout(() => {
            if (!isSystemUnderWater(systemKey) && !gameState.isHurricaneDay) {
                gameState.downedSystems.delete(systemKey);
                const systemElement = document.getElementById(gameState.systems[systemKey].element);
                systemElement.classList.remove('damaged');
            }
        }, 15000);
    }
}

// Check if system is underwater
function isSystemUnderWater(systemKey) {
    const floorHeight = gameState.systems[systemKey].floorLevel * 3;
    return gameState.waterHeight > floorHeight;
}

// Update defenses list
function updateDefensesList() {
    const defensesList = document.getElementById('defensesList');
    defensesList.innerHTML = '';

    if (gameState.defenses.length === 0) {
        defensesList.innerHTML = '<p style="color: #999; font-size: 12px;">No active defenses</p>';
        return;
    }

    gameState.defenses.forEach(defense => {
        const item = document.createElement('div');
        item.className = `defense-item ${defense.failed ? 'inactive' : ''}`;
        item.innerHTML = `
            <div class="defense-item-name">${defense.card.icon} ${defense.card.name}</div>
            <div class="defense-item-status">${defense.failed ? '❌ Failed' : '✓ Active'}</div>
        `;
        defensesList.appendChild(item);
    });
}

// Draw rain on SVG
function drawRain() {
    const rainContainer = document.getElementById('rainContainer');
    rainContainer.innerHTML = '';
    
    if (!gameState.isHurricaneDay) return;
    
    for (let i = 0; i < 20; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', Math.random() * 800);
        line.setAttribute('y1', Math.random() * 200);
        line.setAttribute('x2', Math.random() * 800);
        line.setAttribute('y2', Math.random() * 200 + 50);
        line.setAttribute('stroke', '#4DB8FF');
        line.setAttribute('stroke-width', '2');
        rainContainer.appendChild(line);
    }
    
    rainContainer.style.opacity = gameState.isHurricaneDay ? '0.8' : '0';
}

// Draw wind particles
function drawWind() {
    const windContainer = document.getElementById('windContainer');
    windContainer.innerHTML = '';
    
    if (!gameState.isHurricaneDay) return;
    
    for (let i = 0; i < 15; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', Math.random() * 100);
        line.setAttribute('y1', Math.random() * 300);
        line.setAttribute('x2', Math.random() * 100 + 50);
        line.setAttribute('y2', Math.random() * 300);
        line.setAttribute('stroke', '#CCCCCC');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', '0.6');
        windContainer.appendChild(line);
    }
    
    windContainer.style.opacity = gameState.windSpeed > 30 ? '0.7' : '0';
}

// Draw debris
function drawDebris() {
    const debrisContainer = document.getElementById('debrisContainer');
    debrisContainer.innerHTML = '';
    
    if (!gameState.isHurricaneDay) return;
    
    const debris = ['🪵', '📦', '🌳', '⚡'];
    for (let i = 0; i < 10; i++) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', Math.random() * 800);
        text.setAttribute('y', Math.random() * 300);
        text.setAttribute('font-size', '20');
        text.textContent = debris[Math.floor(Math.random() * debris.length)];
        debrisContainer.appendChild(text);
    }
    
    debrisContainer.style.opacity = gameState.windSpeed > 70 ? '0.6' : '0';
}

// Update UI
function updateUI() {
    const dayOfYear = gameState.daysElapsed % 365;
    const yearsElapsed = Math.floor(gameState.daysElapsed / 365);
    gameState.currentYear = 2025 + yearsElapsed;

    document.getElementById('year').textContent = gameState.currentYear;
    document.getElementById('daysElapsed').textContent = gameState.daysElapsed;

    let season = 'Winter';
    if (dayOfYear >= 80 && dayOfYear < 172) season = 'Spring';
    else if (dayOfYear >= 172 && dayOfYear < 264) season = 'Summer';
    else if (dayOfYear >= 264 && dayOfYear < 355) season = 'Fall';
    document.getElementById('season').textContent = season;

    gameState.isHurricaneDay = determineHurricaneDay(gameState.currentYear, dayOfYear);

    const dayStatusElement = document.getElementById('dayStatus');
    const headerElement = document.getElementById('headerBackground');
    const skyBackground = document.getElementById('skyBackground');
    const weatherIndicator = document.getElementById('weatherIndicator');

    if (gameState.isHurricaneDay) {
        dayStatusElement.textContent = '🌀 HURRICANE DAY';
        headerElement.classList.add('hurricane-day');
        skyBackground.setAttribute('fill', '#4a5568');
        weatherIndicator.setAttribute('fill', '#FF6B35');
    } else {
        dayStatusElement.textContent = '☀️ Normal Day';
        headerElement.classList.remove('hurricane-day');
        skyBackground.setAttribute('fill', '#87CEEB');
        weatherIndicator.setAttribute('fill', '#FFD700');
    }

    const seaLevelRise = getSeaLevelRise(gameState.currentYear);
    const maxWindSpeed = getMaxWindSpeed(gameState.currentYear);
    const hurricaneChance = getHurricaneChance(gameState.currentYear) * 100;

    let windSpeed = 5;
    let stormSurge = 0;

    if (gameState.isHurricaneDay) {
        windSpeed = 50 + Math.random() * (maxWindSpeed - 50);
        stormSurge = 2 + Math.random() * 8;
        gameState.waterHeight += stormSurge * 0.2;
    }

    gameState.windSpeed = windSpeed;

    document.getElementById('windSpeed').textContent = windSpeed.toFixed(0) + ' mph';
    document.getElementById('stormSurge').textContent = stormSurge.toFixed(1) + ' ft';
    document.getElementById('waterHeight').textContent = (gameState.waterHeight + seaLevelRise).toFixed(1) + ' ft';
    document.getElementById('seaLevelRise').textContent = seaLevelRise.toFixed(1) + ' ft';
    document.getElementById('hurricaneChance').textContent = hurricaneChance.toFixed(1) + '%';

    // Update water level visualization
    const totalWaterHeight = gameState.waterHeight + seaLevelRise;
    const waterPercentage = Math.min((totalWaterHeight / gameState.maxWaterHeight) * 100, 100);
    
    const waterLevelElement = document.getElementById('waterLevel');
    waterLevelElement.setAttribute('y', 400 - (waterPercentage * 2));
    waterLevelElement.setAttribute('height', waterPercentage * 2);

    updateFloorColors(totalWaterHeight);
    drawRain();
    drawWind();
    drawDebris();

    document.getElementById('elixirCurrent').textContent = gameState.elixir.toFixed(1);
    const elixirPercentage = (gameState.elixir / gameState.maxElixir) * 100;
    document.getElementById('elixirFill').style.width = elixirPercentage + '%';

    Object.keys(gameState.systems).forEach(systemKey => {
        const systemElement = document.getElementById(gameState.systems[systemKey].element);
        const isUnderWater = isSystemUnderWater(systemKey);
        
        if (isUnderWater) {
            systemElement.classList.add('down');
            systemElement.querySelector('.system-status').textContent = '✗';
            systemElement.querySelector('.system-status').style.color = '#f44336';
        } else if (gameState.downedSystems.has(systemKey)) {
            systemElement.classList.add('damaged');
            systemElement.querySelector('.system-status').textContent = '⚠';
            systemElement.querySelector('.system-status').style.color = '#ff9800';
        } else {
            systemElement.classList.remove('damaged', 'down');
            systemElement.querySelector('.system-status').textContent = '✓';
            systemElement.querySelector('.system-status').style.color = '#4CAF50';
        }
    });
}

// Update floor colors based on water height
function updateFloorColors(totalWaterHeight) {
    const floors = [
        { element: 'floor0', height: 0 },
        { element: 'floor1', height: 3 },
        { element: 'floor2', height: 6 }
    ];

    floors.forEach(floor => {
        const element = document.getElementById(floor.element);
        if (element && totalWaterHeight > floor.height) {
            element.style.fill = '#1565C0';
        } else if (element) {
            element.style.fill = element.id === 'floor0' ? '#A0826D' : 
                                 element.id === 'floor1' ? '#C19A6B' : '#D4A574';
        }
    });
}

// Check win condition
function checkWinCondition() {
    const allSystemsUp = Object.keys(gameState.systems).every(systemKey => {
        return !isSystemUnderWater(systemKey) && !gameState.downedSystems.has(systemKey);
    });
    return allSystemsUp;
}

// Check lose condition
function checkLoseCondition() {
    const allSystemsDown = Object.keys(gameState.systems).every(systemKey => {
        return isSystemUnderWater(systemKey);
    });

    const seaLevelRise = getSeaLevelRise(gameState.currentYear);
    const totalWaterHeight = gameState.waterHeight + seaLevelRise;

    return allSystemsDown || totalWaterHeight > gameState.maxWaterHeight;
}

// Game loop
function gameLoop() {
    if (!gameState.gameRunning) return;

    gameState.daysElapsed++;

    // Regenerate elixir - 3x faster on normal days
    if (!gameState.isHurricaneDay && gameState.elixir < gameState.maxElixir) {
        gameState.elixir += 0.3;
        gameState.elixir = Math.min(gameState.elixir, gameState.maxElixir);
    } else if (gameState.isHurricaneDay && gameState.elixir < gameState.maxElixir) {
        gameState.elixir += 0.1;
        gameState.elixir = Math.min(gameState.elixir, gameState.maxElixir);
    }

    // Water gradually recedes on normal days
    if (!gameState.isHurricaneDay) {
        gameState.waterHeight = Math.max(0, gameState.waterHeight - 0.3);
    }

    updateUI();
    renderCards();

    // Check game completion (75 years)
    if (gameState.daysElapsed >= gameState.totalDays) {
        endGame(true);
        return;
    }

    if (checkLoseCondition()) {
        endGame(false);
        return;
    }

    setTimeout(gameLoop, 1000);
}

// End game
function endGame(won) {
    gameState.gameRunning = false;

    const modal = document.getElementById('gameOverModal');
    const title = document.getElementById('gameOverTitle');
    const stats = document.getElementById('gameOverStats');

    const seaLevelRise = getSeaLevelRise(gameState.currentYear);
    const maxWater = gameState.waterHeight + seaLevelRise;

    if (won) {
        title.textContent = '✓ Victory! You Protected Miami for 75 Years!';
    } else {
        title.textContent = '✗ Defeat! Your systems failed.';
    }

    stats.innerHTML = `
        <div class="stat-line">
            <span>Final Year:</span>
            <strong>${gameState.currentYear}</strong>
        </div>
        <div class="stat-line">
            <span>Days Survived:</span>
            <strong>${gameState.daysElapsed} / ${gameState.totalDays}</strong>
        </div>
        <div class="stat-line">
            <span>Max Water Height:</span>
            <strong>${maxWater.toFixed(1)} ft</strong>
        </div>
        <div class="stat-line">
            <span>Final Sea Level Rise:</span>
            <strong>${seaLevelRise.toFixed(1)} ft</strong>
        </div>
        <div class="stat-line">
            <span>Max Wind Speed:</span>
            <strong>${getMaxWindSpeed(gameState.currentYear).toFixed(0)} mph</strong>
        </div>
        <div class="stat-line">
            <span>Defenses Deployed:</span>
            <strong>${gameState.defenses.length}</strong>
        </div>
        <div class="stat-line">
            <span>Final Score:</span>
            <strong>${(gameState.daysElapsed * (1 - (maxWater / gameState.maxWaterHeight))).toFixed(0)}</strong>
        </div>
    `;

    modal.classList.add('active');
}

// Event listeners
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    playCard(cardId);
});

window.addEventListener('load', initGame);
