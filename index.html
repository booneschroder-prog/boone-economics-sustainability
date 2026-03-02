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
    dailyCounter: 0,
    
    systems: {
        bedroom: { name: 'Bedroom', icon: '🛏️', element: 'systemBedroom', floorLevel: 2 },
        bathroom: { name: 'Bathroom', icon: '🚿', element: 'systemBathroom', floorLevel: 1 },
        kitchen: { name: 'Kitchen', icon: '🍳', element: 'systemKitchen', floorLevel: 1 },
        electrical: { name: 'Electrical', icon: '⚡', element: 'systemElectrical', floorLevel: 0 },
        cooling: { name: 'Cooling', icon: '❄️', element: 'systemCooling', floorLevel: 0 }
    }
};

// Defense cards with consistent properties
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
        chanceOfDamage: 1.0,
        downtime: 0,
        description: 'Evacuate to upper floors',
        effect: (state) => {
            // Mark as using upper floors only
        }
    },
    {
        id: 'elevate',
        name: 'Elevate Structure',
        icon: '🏗️',
        cost: 6,
        chanceOfDamage: 0.1,
        downtime: 24,
        description: 'Raise entire house (+3ft)',
        effect: (state) => {
            // Permanent elevation bonus
        }
    },
    {
        id: 'generator',
        name: 'Backup Generator',
        icon: '⚙️',
        cost: 5,
        chanceOfDamage: 0.05,
        downtime: 12,
        description: 'Backup power supply',
        effect: (state) => {
            // Protects electrical
        }
    },
    {
        id: 'aerodynamic',
        name: 'Aerodynamic Roof',
        icon: '🌪️',
        cost: 4,
        chanceOfDamage: 0.2,
        downtime: 12,
        description: 'Wind-resistant roof',
        effect: (state) => {
            // Reduces wind damage
        }
    },
    {
        id: 'hurricane-room',
        name: 'Hurricane Room',
        icon: '🏠',
        cost: 3,
        chanceOfDamage: 0.0,
        downtime: 12,
        description: 'Reinforced safe room',
        effect: (state) => {
            // Guaranteed protection
        }
    }
];

// Calculate hurricane probability based on year
function getHurricaneChance(year) {
    // Probability increases from 5% in 2025 to 40% in 2100
    const yearsElapsed = year - 2025;
    const baseProbability = 0.05;
    const maxProbability = 0.40;
    const increase = (maxProbability - baseProbability) / 75;
    return Math.min(baseProbability + (yearsElapsed * increase), maxProbability);
}

// Calculate sea level rise based on year
function getSeaLevelRise(year) {
    // Sea level rises from 0 ft in 2025 to 4 ft in 2100
    const yearsElapsed = year - 2025;
    return (yearsElapsed / 75) * 4;
}

// Determine if today is a hurricane day
function determineHurricaneDay(year, dayOfYear) {
    const hurricaneChance = getHurricaneChance(year);
    // Use day-based seeding for consistency
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
                <div>Damage: ${(card.chanceOfDamage * 100).toFixed(0)}%</div>
                <div>Downtime: ${card.downtime}h</div>
            </div>
        `;

        if (canAfford) {
            cardElement.addEventListener('dragstart', handleDragStart);
            cardElement.addEventListener('dragend', handleDragEnd);
        }

        cardsGrid.appendChild(cardElement);
    });
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

    // Check for failure
    if (Math.random() < card.chanceOfDamage) {
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
        }, card.downtime * 3000); // Scale down for demo
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
    gameState.downedSystems.add(systemKey);
    const systemElement = document.getElementById(gameState.systems[systemKey].element);
    systemElement.classList.add('damaged');

    // Recovery after delay
    setTimeout(() => {
        if (!isSystemUnderWater(systemKey)) {
            gameState.downedSystems.delete(systemKey);
            const systemElement = document.getElementById(gameState.systems[systemKey].element);
            systemElement.classList.remove('damaged');
        }
    }, 20000);
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

// Update UI
function updateUI() {
    // Calculate current year and day
    const dayOfYear = gameState.daysElapsed % 365;
    const yearsElapsed = Math.floor(gameState.daysElapsed / 365);
    gameState.currentYear = 2025 + yearsElapsed;

    // Update time displays
    document.getElementById('year').textContent = gameState.currentYear;
    document.getElementById('daysElapsed').textContent = gameState.daysElapsed;

    // Determine season
    let season = 'Winter';
    if (dayOfYear >= 80 && dayOfYear < 172) season = 'Spring';
    else if (dayOfYear >= 172 && dayOfYear < 264) season = 'Summer';
    else if (dayOfYear >= 264 && dayOfYear < 355) season = 'Fall';
    document.getElementById('season').textContent = season;

    // Determine if hurricane day
    gameState.isHurricaneDay = determineHurricaneDay(gameState.currentYear, dayOfYear);

    // Update day status
    const dayStatusElement = document.getElementById('dayStatus');
    const headerElement = document.getElementById('headerBackground');
    const floodVizElement = document.getElementById('floodVisualization');

    if (gameState.isHurricaneDay) {
        dayStatusElement.textContent = '🌀 HURRICANE DAY';
        headerElement.classList.add('hurricane-day');
        floodVizElement.classList.add('hurricane-day');
    } else {
        dayStatusElement.textContent = '☀️ Normal Day';
        headerElement.classList.remove('hurricane-day');
        floodVizElement.classList.remove('hurricane-day');
    }

    // Calculate environmental factors
    const seaLevelRise = getSeaLevelRise(gameState.currentYear);
    const hurricaneChance = getHurricaneChance(gameState.currentYear) * 100;

    // Update weather info
    let windSpeed = '5 mph';
    let stormSurge = 0;
    let waterHeightDisplay = gameState.waterHeight.toFixed(1);

    if (gameState.isHurricaneDay) {
        windSpeed = (50 + Math.random() * 100).toFixed(0) + ' mph';
        stormSurge = (2 + Math.random() * 8).toFixed(1);
        gameState.waterHeight += parseFloat(stormSurge) * 0.3;
    }

    document.getElementById('windSpeed').textContent = windSpeed;
    document.getElementById('stormSurge').textContent = stormSurge + ' ft';
    document.getElementById('waterHeight').textContent = (gameState.waterHeight + seaLevelRise).toFixed(1) + ' ft';
    document.getElementById('seaLevelRise').textContent = seaLevelRise.toFixed(1) + ' ft';
    document.getElementById('hurricaneChance').textContent = hurricaneChance.toFixed(1) + '%';

    // Water level visualization
    const totalWaterHeight = gameState.waterHeight + seaLevelRise;
    const waterPercentage = Math.min((totalWaterHeight / gameState.maxWaterHeight) * 100, 100);
    document.getElementById('waterLevel').style.height = waterPercentage + '%';

    // Update floor colors
    updateFloorColors(seaLevelRise);

    // Elixir
    document.getElementById('elixirCurrent').textContent = gameState.elixir.toFixed(1);
    const elixirPercentage = (gameState.elixir / gameState.maxElixir) * 100;
    document.getElementById('elixirFill').style.width = elixirPercentage + '%';

    // Update system status
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

// Update floor colors
function updateFloorColors(seaLevelRise) {
    const floors = [
        { element: 'floorGround', level: 0, height: 0 },
        { element: 'floorFirst', level: 1, height: 3 },
        { element: 'floorSecond', level: 2, height: 6 },
        { element: 'floorRoof', level: 3, height: 9 }
    ];

    const totalWaterHeight = gameState.waterHeight + seaLevelRise;

    floors.forEach(floor => {
        const element = document.getElementById(floor.element);
        if (totalWaterHeight > floor.height) {
            element.classList.add('flooded');
        } else {
            element.classList.remove('flooded');
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

// Game loop - advances one day per iteration
function gameLoop() {
    if (!gameState.gameRunning) return;

    // Advance to next day
    gameState.daysElapsed++;

    // Regenerate elixir during normal days
    if (!gameState.isHurricaneDay && gameState.elixir < gameState.maxElixir) {
        gameState.elixir += 0.3;
        gameState.elixir = Math.min(gameState.elixir, gameState.maxElixir);
    }

    // During hurricane days, slow regeneration
    if (gameState.isHurricaneDay && gameState.elixir < gameState.maxElixir) {
        gameState.elixir += 0.05;
        gameState.elixir = Math.min(gameState.elixir, gameState.maxElixir);
    }

    // Water gradually recedes during normal days
    if (!gameState.isHurricaneDay) {
        gameState.waterHeight = Math.max(0, gameState.waterHeight - 0.5);
    }

    updateUI();
    renderCards();

    // Check game over
    if (gameState.daysElapsed >= gameState.totalDays) {
        endGame(true);
        return;
    }

    if (checkLoseCondition()) {
        endGame(false);
        return;
    }

    // Game speed: 1 real second = 1 day in game
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
        title.textContent = '✓ Victory! You Protected Miami!';
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
            <span>Sea Level Rise:</span>
            <strong>${seaLevelRise.toFixed(1)} ft</strong>
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
