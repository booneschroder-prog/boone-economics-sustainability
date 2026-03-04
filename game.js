// Game state
const gameState = {
    currentYear: 2025,
    currentMonth: 0,
    currentWeek: 0,
    totalDaysElapsed: 0,
    totalDays: 75 * 365,
    elixir: 5,
    maxElixir: 20,
    gameRunning: true,
    defenses: [],
    waterHeight: 0,
    maxWaterHeight: 15,
    isHurricaneDay: false,
    windSpeed: 5,
    downedSystems: new Set(),
    dikeHeight: 0,
    elevationBonus: 0,
    hasHurricaneRoom: false,
    hasBackupGenerator: false,
    hasAerodyanmicRoof: false,
    
    systems: {
        bedroom: { name: 'Bedroom', icon: '🛏️', element: 'systemBedroom', floorLevel: 2, protected: false },
        bathroom: { name: 'Bathroom', icon: '🚿', element: 'systemBathroom', floorLevel: 2, protected: false },
        electrical: { name: 'Electrical', icon: '⚡', element: 'systemElectrical', floorLevel: 3, protected: false },
        cooling: { name: 'Cooling', icon: '❄️', element: 'systemCooling', floorLevel: 3, protected: false }
    }
};

// Defense cards
const cards = [
    {
        id: 'dikes',
        name: 'Dikes/Levees',
        icon: '🛡️',
        costPerUnit: 1, // Cost scales with height
        description: 'Build protective dikes (1 elixir/ft)',
        effect: (state, amount) => {
            state.dikeHeight += amount;
            state.waterHeight = Math.max(0, state.waterHeight - amount);
        }
    },
    {
        id: 'elevate',
        name: 'Elevate Structure',
        icon: '⬆️',
        cost: 4,
        chanceOfDamage: 0.1,
        description: 'Raise house 3ft. Permanent.',
        effect: (state) => {
            state.elevationBonus += 3;
        }
    },
    {
        id: 'generator',
        name: 'Backup Generator',
        icon: '⚙️',
        cost: 3,
        chanceOfDamage: 0.2,
        downtime: 3,
        description: 'Protects electrical (3 day downtime if fails)',
        effect: (state) => {
            state.hasBackupGenerator = true;
        }
    },
    {
        id: 'aerodynamic',
        name: 'Aerodynamic Roof',
        icon: '🏠',
        cost: 2,
        chanceOfDamage: 0.25,
        downtime: 2,
        description: 'Strengthens roof (2 day downtime if fails)',
        effect: (state) => {
            state.hasAerodyanmicRoof = true;
        }
    },
    {
        id: 'hurricane-room',
        name: 'Hurricane Room',
        icon: '🛡️',
        cost: 5,
        chanceOfDamage: 0.05,
        description: 'Concrete safe room. Flood-proof. Permanent.',
        effect: (state) => {
            state.hasHurricaneRoom = true;
        }
    }
];

// Calculate sea level rise (3ft baseline in 2025, +5ft by 2100 = 8ft total in 2100)
function getSeaLevelRise(year) {
    const yearsElapsed = year - 2025;
    const baselineSeaLevel = 3;
    const projectedRise = (yearsElapsed / 75) * 5;
    return baselineSeaLevel + projectedRise;
}

// Calculate max wind speed (5 mph to 150+ mph)
function getMaxWindSpeed(year) {
    const yearsElapsed = year - 2025;
    const baseWind = 5;
    const maxWind = 150;
    return baseWind + (yearsElapsed / 75) * (maxWind - baseWind);
}

// Calculate hurricane probability
function getHurricaneChance(year) {
    const yearsElapsed = year - 2025;
    const baseProbability = 0.05;
    const maxProbability = 0.40;
    return baseProbability + (yearsElapsed / 75) * (maxProbability - baseProbability);
}

// Determine if a specific week is a hurricane week
function isHurricaneWeek(year, weekOfYear) {
    const hurricaneChance = getHurricaneChance(year);
    const seed = (year * 52 + weekOfYear) % 100;
    return seed < (hurricaneChance * 100);
}

// Generate 10-week forecast
function generateForecast() {
    const forecast = [];
    const currentWeekOfYear = gameState.currentWeek;
    
    for (let i = 0; i < 10; i++) {
        const weekOffset = i;
        const futureYear = gameState.currentYear;
        const futureWeek = (currentWeekOfYear + weekOffset) % 52;
        
        const isHurricane = isHurricaneWeek(futureYear, futureWeek);
        forecast.push({
            week: i + 1,
            isHurricane: isHurricane
        });
    }
    
    return forecast;
}

// Update forecast display
function updateForecast() {
    const forecastDisplay = document.getElementById('forecastDisplay');
    const forecast = generateForecast();
    
    forecastDisplay.innerHTML = '';
    forecast.forEach(item => {
        const forecastItem = document.createElement('div');
        forecastItem.className = `forecast-item ${item.isHurricane ? 'hurricane' : ''}`;
        forecastItem.innerHTML = `
            <div class="forecast-week">W${item.week}</div>
            <div class="forecast-icon">${item.isHurricane ? '🌀' : '☀️'}</div>
        `;
        forecastDisplay.appendChild(forecastItem);
    });
}

// Initialize game
function initGame() {
    showInfoModal();
    renderCards();
    updateForecast();
    updateUI();
    gameLoop();
}

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

        let cost = card.cost || card.costPerUnit;
        const canAfford = gameState.elixir >= cost;
        
        if (!canAfford) {
            cardElement.classList.add('unavailable');
        }

        let costText = cost + ' 💰';
        if (card.costPerUnit) {
            costText = '1-5 ft (1💰/ft)';
        }

        let statsText = '';
        if (card.downtime) {
            statsText = `Downtime: ${card.downtime}d`;
        }
        if (card.chanceOfDamage) {
            statsText += `<br>Risk: ${(card.chanceOfDamage * 100).toFixed(0)}%*`;
        }

        cardElement.innerHTML = `
            <div class="card-icon">${card.icon}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-cost">${costText}</div>
            <div class="card-stats">${statsText || 'Permanent'}</div>
        `;

        if (canAfford) {
            cardElement.addEventListener('dragstart', handleDragStart);
            cardElement.addEventListener('dragend', handleDragEnd);
        }

        cardsGrid.appendChild(cardElement);
    });
}

// Drag handlers
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

    let cost = card.cost || card.costPerUnit;
    
    // Special case for dikes - ask player for height
    if (card.id === 'dikes') {
        const height = prompt('How many feet high? (1-5)', '1');
        if (!height || isNaN(height) || height < 1 || height > 5) return;
        cost = parseInt(height);
    }

    if (gameState.elixir < cost) {
        alert('Not enough Budget Points!');
        return;
    }

    gameState.elixir -= cost;

    // Defenses only fail on hurricane days
    const failChance = gameState.isHurricaneDay ? card.chanceOfDamage : 0;
    const didFail = Math.random() < failChance;

    if (didFail) {
        addDefense(card, true, cost);
        damageRandomSystem();
    } else {
        card.effect(gameState, cost);
        addDefense(card, false, cost);
    }

    // Handle downtime - system goes down temporarily
    if (card.downtime && didFail) {
        const downtimeDays = card.downtime;
        const systemKey = card.id === 'generator' ? 'electrical' : card.id === 'aerodynamic' ? 'bedroom' : null;
        if (systemKey) {
            gameState.downedSystems.add(systemKey);
            setTimeout(() => {
                gameState.downedSystems.delete(systemKey);
            }, downtimeDays * 7 * 1000); // Convert days to game time
        }
    }

    updateUI();
    renderCards();
    updateForecast();
}

// Add defense to list
function addDefense(card, failed, cost) {
    const defense = {
        id: card.id + '_' + Date.now(),
        card: card,
        failed: failed,
        cost: cost,
        permanent: !card.downtime && !failed
    };

    gameState.defenses.push(defense);
    updateDefensesList();
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
            <div class="defense-item-status">${defense.failed ? '❌ Failed' : '✓ Active'} (${defense.cost} elixir)</div>
        `;
        defensesList.appendChild(item);
    });
}

// Damage random system
function damageRandomSystem() {
    const systems = Object.keys(gameState.systems);
    const randomSystem = systems[Math.floor(Math.random() * systems.length)];
    const systemElement = document.getElementById(gameState.systems[randomSystem].element);
    systemElement.classList.add('damaged');
    
    setTimeout(() => {
        systemElement.classList.remove('damaged');
    }, 5000);
}

// Check if system is underwater
function isSystemUnderWater(systemKey) {
    const seaLevel = getSeaLevelRise(gameState.currentYear);
    const totalWater = gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight;
    
    if (gameState.hasHurricaneRoom && systemKey === 'bedroom') {
        return false; // Hurricane room is immune
    }
    
    const floorHeights = { electrical: 3, cooling: 3, bathroom: 2, bedroom: 2 };
    const waterHeightNeeded = floorHeights[systemKey] * 3;
    
    return totalWater > waterHeightNeeded;
}

// Update UI
function updateUI() {
    // Time calculations
    const dayOfYear = gameState.totalDaysElapsed % 365;
    const yearsElapsed = Math.floor(gameState.totalDaysElapsed / 365);
    gameState.currentYear = 2025 + yearsElapsed;
    gameState.currentWeek = Math.floor((gameState.totalDaysElapsed % 365) / 7);
    gameState.currentMonth = Math.floor(dayOfYear / 30);

    // Update header
    document.getElementById('year').textContent = gameState.currentYear;
    document.getElementById('week').textContent = gameState.currentWeek + 1;
    
    let season = 'Winter';
    if (dayOfYear >= 80 && dayOfYear < 172) season = 'Spring';
    else if (dayOfYear >= 172 && dayOfYear < 264) season = 'Summer';
    else if (dayOfYear >= 264 && dayOfYear < 355) season = 'Fall';
    document.getElementById('season').textContent = season;

    // Determine if hurricane week
    gameState.isHurricaneDay = isHurricaneWeek(gameState.currentYear, gameState.currentWeek);

    const dayStatusElement = document.getElementById('dayStatus');
    const headerElement = document.getElementById('headerBackground');
    const skyBackground = document.getElementById('skyBackground');
    const weatherIndicator = document.getElementById('weatherIndicator');

    if (gameState.isHurricaneDay) {
        dayStatusElement.textContent = '🌀 HURRICANE';
        headerElement.classList.add('hurricane-day');
        skyBackground.setAttribute('fill', '#4a5568');
        weatherIndicator.setAttribute('fill', '#FF6B35');
    } else {
        dayStatusElement.textContent = '☀️ Normal';
        headerElement.classList.remove('hurricane-day');
        skyBackground.setAttribute('fill', '#87CEEB');
        weatherIndicator.setAttribute('fill', '#FFD700');
    }

    // Environmental calculations
    const seaLevel = getSeaLevelRise(gameState.currentYear);
    const maxWind = getMaxWindSpeed(gameState.currentYear);
    const hurricaneChance = getHurricaneChance(gameState.currentYear) * 100;

    let windSpeed = 5;
    let stormSurge = 0;

    if (gameState.isHurricaneDay) {
        windSpeed = 50 + Math.random() * (maxWind - 50);
        stormSurge = 2 + Math.random() * 8;
        gameState.waterHeight += stormSurge * 0.15;
    }

    gameState.windSpeed = windSpeed;

    // Update weather display
    document.getElementById('windSpeed').textContent = windSpeed.toFixed(0) + ' mph';
    document.getElementById('stormSurge').textContent = stormSurge.toFixed(1) + ' ft';
    document.getElementById('waterHeight').textContent = (gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight).toFixed(1) + ' ft';
    document.getElementById('seaLevelRise').textContent = seaLevel.toFixed(1) + ' ft';

    // Update water visualization
    const totalWater = gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight;
    const waterPercentage = Math.min((totalWater / gameState.maxWaterHeight) * 100, 100);
    
    const waterLevel = document.getElementById('waterLevel');
    const newY = 400 + (100 - waterPercentage) * 3;
    waterLevel.setAttribute('y', newY);
    waterLevel.setAttribute('height', Math.max(0, Math.min(waterPercentage * 3, 300)));

    // Update dike visualization
    updateDikeVisualization();
    updateElevationVisualization();
    updateHurricaneRoomVisualization();
    updateGeneratorVisualization();
    updateRoofVisualization();

    drawRain();
    drawWind();
    drawDebris();

    // Update elixir
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

// Update dike visualization
function updateDikeVisualization() {
    const dikeHeight = gameState.dikeHeight;
    if (dikeHeight === 0) {
        document.getElementById('dikesLeft').style.opacity = '0';
        document.getElementById('dikesRight').style.opacity = '0';
        return;
    }

    document.getElementById('dikesLeft').style.opacity = '1';
    document.getElementById('dikesRight').style.opacity = '1';

    // Scale dike height (each foot raises the dike)
    const scale = Math.min(dikeHeight / 5, 1);
    const heightIncrease = scale * 30;
    
    const dikeLeftBase = document.getElementById('dikeLeftBase');
    dikeLeftBase.setAttribute('points', `80,${350 - heightIncrease} 100,${350 - heightIncrease} 110,${320 - heightIncrease} 70,${320 - heightIncrease}`);
    
    const dikeRightBase = document.getElementById('dikeRightBase');
    dikeRightBase.setAttribute('points', `520,${350 - heightIncrease} 540,${350 - heightIncrease} 550,${320 - heightIncrease} 490,${320 - heightIncrease}`);
}

// Update elevation visualization
function updateElevationVisualization() {
    const houseGroup = document.getElementById('houseGroup');
    const elevationBonus = gameState.elevationBonus;
    
    if (elevationBonus > 0) {
        const yOffset = elevationBonus * 10; // Visual scaling
        houseGroup.style.transform = `translateY(-${yOffset}px)`;
    } else {
        houseGroup.style.transform = 'translateY(0)';
    }
}

// Update hurricane room visualization
function updateHurricaneRoomVisualization() {
    const hurricaneRoom = document.getElementById('hurricaneRoom');
    if (gameState.hasHurricaneRoom) {
        hurricaneRoom.style.opacity = '1';
    } else {
        hurricaneRoom.style.opacity = '0';
    }
}

// Update generator visualization
function updateGeneratorVisualization() {
    const generator = document.getElementById('generatorIcon');
    if (gameState.hasBackupGenerator) {
        generator.style.opacity = '1';
    } else {
        generator.style.opacity = '0';
    }
}

// Update roof visualization
function updateRoofVisualization() {
    const roof = document.getElementById('roofElement');
    if (gameState.hasAerodyanmicRoof) {
        roof.setAttribute('fill', '#FF6B35');
    } else {
        roof.setAttribute('fill', '#D32F2F');
    }
}

// Draw rain
function drawRain() {
    const rainContainer = document.getElementById('rainContainer');
    rainContainer.innerHTML = '';
    
    if (!gameState.isHurricaneDay) return;
    
    for (let i = 0; i < 20; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', Math.random() * 600);
        line.setAttribute('y1', Math.random() * 200);
        line.setAttribute('x2', Math.random() * 600 - 30);
        line.setAttribute('y2', Math.random() * 200 + 50);
        line.setAttribute('stroke', '#4DB8FF');
        line.setAttribute('stroke-width', '2');
        rainContainer.appendChild(line);
    }
    
    rainContainer.style.opacity = gameState.isHurricaneDay ? '0.8' : '0';
}

// Draw wind
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
    
    const debris = ['🪵', '📦', '🌳', '🚗'];
    for (let i = 0; i < 8; i++) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', Math.random() * 600);
        text.setAttribute('y', Math.random() * 250);
        text.setAttribute('font-size', '18');
        text.textContent = debris[Math.floor(Math.random() * debris.length)];
        debrisContainer.appendChild(text);
    }
    
    debrisContainer.style.opacity = gameState.windSpeed > 70 ? '0.6' : '0';
}

// Check lose condition
function checkLoseCondition() {
    const allSystemsDown = Object.keys(gameState.systems).every(systemKey => {
        return isSystemUnderWater(systemKey);
    });

    return allSystemsDown;
}

// Game loop - advances one week per iteration
function gameLoop() {
    if (!gameState.gameRunning) return;

    gameState.totalDaysElapsed += 7; // Advance 1 week = 7 days

    // Regenerate elixir
    if (!gameState.isHurricaneDay) {
        gameState.elixir += 0.5;
    } else {
        gameState.elixir += 0.15;
    }
    gameState.elixir = Math.min(gameState.elixir, gameState.maxElixir);

    // Water gradually recedes on normal weeks
    if (!gameState.isHurricaneDay) {
        gameState.waterHeight = Math.max(0, gameState.waterHeight - 1);
    }

    updateUI();
    renderCards();
    updateForecast();

    // Check game completion (75 years)
    if (gameState.totalDaysElapsed >= gameState.totalDays) {
        endGame(true);
        return;
    }

    if (checkLoseCondition()) {
        endGame(false);
        return;
    }

    // Advance time: 1 real second = 1 week in game
    setTimeout(gameLoop, 1000);
}

// End game
function endGame(won) {
    gameState.gameRunning = false;

    const modal = document.getElementById('gameOverModal');
    const title = document.getElementById('gameOverTitle');
    const stats = document.getElementById('gameOverStats');

    const seaLevel = getSeaLevelRise(gameState.currentYear);
    const totalWater = gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight;

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
            <span>Years Survived:</span>
            <strong>${Math.floor(gameState.totalDaysElapsed / 365)} / 75</strong>
        </div>
        <div class="stat-line">
            <span>Final Water Height:</span>
            <strong>${totalWater.toFixed(1)} ft</strong>
        </div>
        <div class="stat-line">
            <span>Sea Level Rise:</span>
            <strong>${seaLevel.toFixed(1)} ft</strong>
        </div>
        <div class="stat-line">
            <span>Dike Height Built:</span>
            <strong>${gameState.dikeHeight.toFixed(1)} ft</strong>
        </div>
        <div class="stat-line">
            <span>Total Elevation Bonus:</span>
            <strong>${gameState.elevationBonus.toFixed(1)} ft</strong>
        </div>
        <div class="stat-line">
            <span>Final Score:</span>
            <strong>${Math.max(0, (gameState.totalDaysElapsed * (1 - (Math.max(0, totalWater) / gameState.maxWaterHeight))).toFixed(0))}</strong>
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
