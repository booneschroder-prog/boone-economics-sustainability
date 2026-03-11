// Hurricane names
const hurricaneNames = [
    'Amalfi', 'Beckett', 'Carlotta', 'Desmond', 'Elena',
    'Fernando', 'Gracie', 'Hector', 'Iris', 'Julian',
    'Kendra', 'Lorenzo', 'Margot', 'Nolan', 'Olympia',
    'Parker', 'Quinn', 'Roslyn', 'Santiago', 'Thalia',
    'Ulysses', 'Valerie', 'Winston', 'Xander', 'Yara'
];

// Year-based news headlines
const headlinesByYear = {
    early: [
        'Cholera outbreak in Sarasota leaves 1,146 people dead',
        'New solar farm in central Florida becomes state\'s largest renewable energy source',
        'Heat waves in Gainesville kill 56 UF students',
        'Miami Beach declares state of emergency as permanent "king tide" flooding worsens',
        'Pensacola halts development of coastal condominium complex'
    ],
    middle: [
        'City of Tampa formally dissolves due to ongoing floods',
        'Florida governor approves $20 billion expansion of Florida\'s turnpike to 10 lanes',
        'Major pharmaceutical company relocates headquarters from Miami to Atlanta',
        'Jacksonville begins major infrastructure relocation project',
        'Deadly crash on Interstate 4 kills 315 drivers during evacuation season'
    ],
    late: [
        'Gainesville City Council proposes $60 million hurricane shelter',
        'Florida man arrested for attempting to vandalize floating house with pickaxe on TikTok',
        'Study: Saltwater intrusion contaminates 30% of South Florida aquifers',
        'Everglades officially declared "ecologically dead" by EPA',
        'Survey: 73% of Floridians considering leaving the state'
    ]
};

// Game state
const gameState = {
    currentYear: 2025,
    currentWeek: 0,
    totalDaysElapsed: 0,
    totalDays: 75 * 365,
    elixir: 2,
    maxElixir: 20,
    gameRunning: true,
    defenses: [],
    waterHeight: 0,
    maxWaterHeight: 15,
    isHurricaneDay: false,
    hurricaneDuration: 0,
    windSpeed: 5,
    downedSystems: new Set(),
    dikeHeight: 0,
    elevationBonus: 0,
    hasHurricaneRoom: false,
    hasBackupGenerator: false,
    hasAerodyanmicRoof: false,
    hasSolarPanels: false,
    lastHurricaneCategory: 0,
    lastHurricaneName: '',
    lastHurricaneDamage: {},
    lastHurricaneCostApplied: false,
    usedHeadlines: new Set(),
    currentHeadlines: [],
    headlinesDuration: 0,
    
    systems: {
        bedroom: { name: 'Bedroom', icon: '🛏️', element: 'systemBedroom', floorLevel: 2 },
        bathroom: { name: 'Bathroom', icon: '🚿', element: 'systemBathroom', floorLevel: 2 },
        electrical: { name: 'Electrical', icon: '⚡', element: 'systemElectrical', floorLevel: 3 },
        cooling: { name: 'Cooling', icon: '❄️', element: 'systemCooling', floorLevel: 3 }
    }
};

// Defense cards
const cards = [
    {
        id: 'dikes',
        name: 'Dikes/Levees',
        icon: '🛡️',
        costPerUnit: 5,
        description: 'Build protective dikes (5 elixir/ft)',
        downtime: 0,
        chanceOfFailure: 0,
        effect: (state, amount) => {
            state.dikeHeight += amount;
            state.waterHeight = Math.max(0, state.waterHeight - amount);
        }
    },
    {
        id: 'elevate',
        name: 'Elevate Structure',
        icon: '⬆️',
        costPerUnit: 15,
        description: 'Raise house (15 elixir/ft)',
        downtime: 2,
        chanceOfFailure: 0.05,
        effect: (state, amount) => {
            state.elevationBonus += amount;
        }
    },
    {
        id: 'generator',
        name: 'Backup Generator',
        icon: '⚙️',
        cost: 6,
        chanceOfFailure: 0.2,
        downtime: 4,
        description: 'Protects electrical (6 elixir)',
        effect: (state) => {
            state.hasBackupGenerator = true;
        }
    },
    {
        id: 'aerodynamic',
        name: 'Aerodynamic Roof',
        icon: '🏠',
        cost: 5,
        chanceOfFailure: 0.25,
        downtime: 2,
        description: 'Strengthens roof (5 elixir)',
        effect: (state) => {
            state.hasAerodyanmicRoof = true;
        }
    },
    {
        id: 'solar',
        name: 'Solar PV Panels',
        icon: '☀️',
        cost: 9,
        chanceOfFailure: 0.75,
        downtime: 5,
        description: 'Solar panels (9 elixir)',
        effect: (state) => {
            state.hasSolarPanels = true;
        }
    },
    {
        id: 'hurricane-room',
        name: 'Hurricane Room',
        icon: '🛡️',
        cost: 13,
        chanceOfFailure: 0.05,
        downtime: 0,
        description: 'Concrete safe room (13 elixir)',
        effect: (state) => {
            state.hasHurricaneRoom = true;
        }
    }
];

function getHeadlinesForYear(year) {
    if (year < 2040) return headlinesByYear.early;
    if (year < 2070) return headlinesByYear.middle;
    return headlinesByYear.late;
}

function generateNews() {
    const headlines = getHeadlinesForYear(gameState.currentYear);
    const available = headlines.filter(h => !gameState.usedHeadlines.has(h));
    
    if (available.length === 0) {
        gameState.currentHeadlines = [];
        return;
    }
    
    const count = Math.floor(Math.random() * 3) + 1;
    const selected = [];
    for (let i = 0; i < Math.min(count, available.length); i++) {
        const idx = Math.floor(Math.random() * available.length);
        const headline = available[idx];
        selected.push(headline);
        gameState.usedHeadlines.add(headline);
        available.splice(idx, 1);
    }
    
    gameState.currentHeadlines = selected;
    gameState.headlinesDuration = Math.floor(Math.random() * 10) + 4;
    updateNewsDisplay();
}

function updateNewsDisplay() {
    const newsHeadlines = document.getElementById('newsHeadlines');
    newsHeadlines.innerHTML = '';
    
    if (gameState.currentHeadlines.length === 0) {
        newsHeadlines.innerHTML = '<p style="color: #999; font-size: 11px;">No current news...</p>';
        return;
    }
    
    gameState.currentHeadlines.forEach(headline => {
        const item = document.createElement('div');
        item.className = 'news-item';
        item.innerHTML = `<p>${headline}</p>`;
        newsHeadlines.appendChild(item);
    });
}

function getHurricaneName(year, weekOfYear) {
    const seed = (year * 52 + weekOfYear) % hurricaneNames.length;
    return hurricaneNames[seed];
}

function getSeaLevelRise(year) {
    const yearsElapsed = year - 2025;
    const baselineSeaLevel = 3;
    const projectedRise = (yearsElapsed / 75) * 5;
    return baselineSeaLevel + projectedRise;
}

function getMaxWindSpeed(year) {
    const yearsElapsed = year - 2025;
    const baseWind = 5;
    const maxWind = 150;
    return baseWind + (yearsElapsed / 75) * (maxWind - baseWind);
}

function getHurricaneChance(year) {
    const yearsElapsed = year - 2025;
    const baseProbability = 0.05;
    const maxProbability = 0.40;
    return baseProbability + (yearsElapsed / 75) * (maxProbability - baseProbability);
}

function getHurricaneCategory(year, seed) {
    const yearsElapsed = year - 2025;
    const progressionFactor = yearsElapsed / 75;
    
    if (seed < 0.4 + progressionFactor * 0.3) return 1;
    if (seed < 0.65 + progressionFactor * 0.2) return 2;
    if (seed < 0.82 + progressionFactor * 0.1) return 3;
    if (seed < 0.92 + progressionFactor * 0.05) return 4;
    return 5;
}

function isHurricaneWeek(year, weekOfYear) {
    const hurricaneChance = getHurricaneChance(year);
    const seed = (year * 52 + weekOfYear) % 100 / 100;
    return seed < hurricaneChance;
}

function getWeekHurricaneCategory(year, weekOfYear) {
    const seed = ((year * 52 + weekOfYear) * 73) % 100 / 100;
    if (isHurricaneWeek(year, weekOfYear)) {
        return getHurricaneCategory(year, seed);
    }
    return 0;
}

function generateForecast() {
    const forecast = [];
    const currentWeekOfYear = gameState.currentWeek;
    
    for (let i = 0; i < 10; i++) {
        const futureYear = gameState.currentYear;
        const futureWeek = (currentWeekOfYear + i) % 52;
        const category = getWeekHurricaneCategory(futureYear, futureWeek);
        forecast.push({
            week: i + 1,
            isHurricane: category > 0,
            category: category
        });
    }
    
    return forecast;
}

function updateForecast() {
    const forecastDisplay = document.getElementById('forecastDisplay');
    const forecast = generateForecast();
    
    forecastDisplay.innerHTML = '';
    forecast.forEach(item => {
        const forecastItem = document.createElement('div');
        forecastItem.className = `forecast-item ${item.isHurricane ? 'hurricane' : ''}`;
        
        let strengthText = '☀️';
        if (item.category > 0) {
            const colors = ['', '#FFD700', '#FF9800', '#FF6B6B', '#D32F2F', '#8B0000'];
            strengthText = `Cat ${item.category}`;
            forecastItem.style.borderColor = colors[item.category];
            forecastItem.style.backgroundColor = colors[item.category] + '22';
        }
        
        forecastItem.innerHTML = `
            <div class="forecast-week">W${item.week}</div>
            <div class="forecast-icon">${item.isHurricane ? '🌀' : '☀️'}</div>
            ${item.category > 0 ? `<div class="forecast-strength">${strengthText}</div>` : ''}
        `;
        forecastDisplay.appendChild(forecastItem);
    });
}

function initGame() {
    showInfoModal();
    renderCards();
    updateForecast();
    generateNews();
    updateUI();
    gameLoop();
}

function showInfoModal() {
    document.getElementById('infoModal').classList.add('active');
}

function closeInfo() {
    document.getElementById('infoModal').classList.remove('active');
}

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
            costText = '1-10 ft (' + card.costPerUnit + '💰/ft)';
        }

        let statsText = '';
        if (card.downtime > 0) {
            statsText = `Downtime: ${card.downtime}w`;
        }
        if (card.chanceOfFailure > 0) {
            statsText += `<br>Chance of Failure: ${(card.chanceOfFailure * 100).toFixed(0)}%`;
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

function handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.cardId);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function playCard(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    let cost = card.cost || card.costPerUnit;
    
    if (card.costPerUnit) {
        const height = prompt(`How many feet? (1-10, costs ${card.costPerUnit} elixir each)`, '1');
        if (!height || isNaN(height) || height < 1 || height > 10) return;
        cost = parseInt(height) * card.costPerUnit;
    }

    if (gameState.elixir < cost) {
        alert('Not enough Budget!');
        return;
    }

    gameState.elixir -= cost;

    let failChance = gameState.isHurricaneDay ? card.chanceOfFailure : 0;
    
    // Synergy: Solar + Generator reduce failure chance
    if (card.id === 'generator' && gameState.hasSolarPanels) {
        failChance = failChance * 0.5;
    }
    if (card.id === 'solar' && gameState.hasBackupGenerator) {
        failChance = failChance * 0.5;
    }
    
    // Dike special logic
    if (card.id === 'dikes' && gameState.isHurricaneDay) {
        const seaLevel = getSeaLevelRise(gameState.currentYear);
        const totalWater = gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight;
        if (totalWater > cost / 5 * 3) {
            failChance = 1.0;
        } else if (totalWater > 0) {
            failChance = 0.5;
        }
    }
    
    const didFail = Math.random() < failChance;

    if (didFail) {
        addDefense(card, true, cost);
        damageRandomSystem();
    } else {
        card.effect(gameState, cost);
        addDefense(card, false, cost);
    }

    updateUI();
    renderCards();
    updateForecast();
}

function addDefense(card, failed, cost) {
    const defense = {
        id: card.id + '_' + Date.now(),
        card: card,
        failed: failed,
        cost: cost
    };

    gameState.defenses.push(defense);
    updateDefensesList();
}

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

function damageRandomSystem() {
    const systems = Object.keys(gameState.systems);
    const randomSystem = systems[Math.floor(Math.random() * systems.length)];
    const systemElement = document.getElementById(gameState.systems[randomSystem].element);
    systemElement.classList.add('damaged');
    gameState.lastHurricaneDamage[randomSystem] = true;
    
    setTimeout(() => {
        systemElement.classList.remove('damaged');
    }, 5000);
}

function isSystemUnderWater(systemKey) {
    const seaLevel = getSeaLevelRise(gameState.currentYear);
    const totalWater = gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight;
    
    if (gameState.hasHurricaneRoom && systemKey === 'bedroom') {
        return false;
    }
    
    const floorHeights = { electrical: 3, cooling: 3, bathroom: 2, bedroom: 2 };
    const waterHeightNeeded = floorHeights[systemKey] * 3;
    
    return totalWater > waterHeightNeeded;
}

function calculateRepairCosts(category) {
    const baseCosts = { 1: 2, 2: 4, 3: 6, 4: 8, 5: 10 };
    let totalCost = baseCosts[category] || 0;
    
    Object.keys(gameState.lastHurricaneDamage).forEach(systemKey => {
        totalCost += category * 1.5;
    });
    
    return totalCost;
}

function applyRepairCosts() {
    if (gameState.lastHurricaneCostApplied || gameState.lastHurricaneCategory === 0) {
        return;
    }
    
    const repairCost = calculateRepairCosts(gameState.lastHurricaneCategory);
    gameState.elixir = Math.max(0, gameState.elixir - repairCost);
    gameState.lastHurricaneCostApplied = true;
}

function updateUI() {
    const dayOfYear = gameState.totalDaysElapsed % 365;
    const yearsElapsed = Math.floor(gameState.totalDaysElapsed / 365);
    gameState.currentYear = 2025 + yearsElapsed;
    gameState.currentWeek = Math.floor((gameState.totalDaysElapsed % 365) / 7);

    document.getElementById('year').textContent = gameState.currentYear;
    document.getElementById('week').textContent = gameState.currentWeek + 1;
    
    let season = 'Winter';
    if (dayOfYear >= 80 && dayOfYear < 172) season = 'Spring';
    else if (dayOfYear >= 172 && dayOfYear < 264) season = 'Summer';
    else if (dayOfYear >= 264 && dayOfYear < 355) season = 'Fall';
    document.getElementById('season').textContent = season;

    const isHurricane = isHurricaneWeek(gameState.currentYear, gameState.currentWeek);
    gameState.isHurricaneDay = isHurricane;
    
    if (isHurricane) {
        gameState.lastHurricaneCategory = getWeekHurricaneCategory(gameState.currentYear, gameState.currentWeek);
        gameState.lastHurricaneName = getHurricaneName(gameState.currentYear, gameState.currentWeek);
        gameState.lastHurricaneCostApplied = false;
        gameState.hurricaneDuration = 2;
    } else {
        gameState.lastHurricaneCategory = 0;
        if (gameState.hurricaneDuration > 0) {
            gameState.hurricaneDuration--;
        }
    }

    const dayStatusElement = document.getElementById('dayStatus');
    const headerElement = document.getElementById('headerBackground');
    const skyBackground = document.getElementById('skyBackground');
    const weatherIndicator = document.getElementById('weatherIndicator');
    const hurricaneCategory = document.getElementById('hurricaneCategory');

    if (gameState.isHurricaneDay || gameState.hurricaneDuration > 0) {
        dayStatusElement.textContent = `🌀 ${gameState.lastHurricaneName} (Cat ${gameState.lastHurricaneCategory})`;
        headerElement.classList.add('hurricane-day');
        skyBackground.setAttribute('fill', '#4a5568');
        weatherIndicator.setAttribute('fill', '#FF6B35');
        hurricaneCategory.setAttribute('opacity', '1');
        hurricaneCategory.textContent = `CAT ${gameState.lastHurricaneCategory}`;
        
        if (!gameState.lastHurricaneCostApplied) {
            applyRepairCosts();
        }
    } else {
        dayStatusElement.textContent = '☀️ Normal';
        headerElement.classList.remove('hurricane-day');
        skyBackground.setAttribute('fill', '#87CEEB');
        weatherIndicator.setAttribute('fill', '#FFD700');
        hurricaneCategory.setAttribute('opacity', '0');
    }

    const seaLevel = getSeaLevelRise(gameState.currentYear);
    const maxWind = getMaxWindSpeed(gameState.currentYear);

    let windSpeed = 5;
    let stormSurge = 0;

    if (gameState.isHurricaneDay) {
        const categoryMultiplier = gameState.lastHurricaneCategory;
        windSpeed = 50 + Math.random() * (maxWind - 50) * (categoryMultiplier / 5);
        stormSurge = 2 + Math.random() * 8 * (categoryMultiplier / 5);
        gameState.waterHeight += stormSurge * 0.15;
    }

    gameState.windSpeed = windSpeed;

    document.getElementById('windSpeed').textContent = windSpeed.toFixed(0) + ' mph';
    document.getElementById('stormSurge').textContent = stormSurge.toFixed(1) + ' ft';
    document.getElementById('waterHeight').textContent = (gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight).toFixed(1) + ' ft';
    document.getElementById('seaLevelRise').textContent = seaLevel.toFixed(1) + ' ft';
    document.getElementById('waterLevelLabel').textContent = (gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight).toFixed(1) + ' ft';

    const totalWater = gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight;
    const waterPercentage = Math.min((totalWater / gameState.maxWaterHeight) * 100, 100);
    
    const waterLevel = document.getElementById('waterLevel');
    const newY = 450 + (100 - waterPercentage) * 4.5;
    waterLevel.setAttribute('y', newY);
    waterLevel.setAttribute('height', Math.max(0, Math.min(waterPercentage * 4.5, 450)));

    updateDikeVisualization();
    updateElevationVisualization();
    updateHurricaneRoomVisualization();
    updateGeneratorVisualization();
    updateSolarVisualization();
    updateRoofVisualization();

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

function updateDikeVisualization() {
    const dikeHeight = gameState.dikeHeight;
    if (dikeHeight === 0) {
        document.getElementById('dikesLeft').style.opacity = '0';
        document.getElementById('dikesRight').style.opacity = '0';
        return;
    }

    document.getElementById('dikesLeft').style.opacity = '1';
    document.getElementById('dikesRight').style.opacity = '1';

    const scale = Math.min(dikeHeight / 10, 1);
    const heightIncrease = scale * 50;
    
    document.getElementById('dikeLeftBase').setAttribute('points', `80,${400 - heightIncrease} 100,${400 - heightIncrease} 110,${350 - heightIncrease} 70,${350 - heightIncrease}`);
    document.getElementById('dikeRightBase').setAttribute('points', `520,${400 - heightIncrease} 540,${400 - heightIncrease} 550,${350 - heightIncrease} 490,${350 - heightIncrease}`);
}

function updateElevationVisualization() {
    const houseGroup = document.getElementById('houseGroup');
    const elevationBonus = gameState.elevationBonus;
    
    if (elevationBonus > 0) {
        const yOffset = elevationBonus * 15;
        houseGroup.style.transform = `translateY(-${yOffset}px)`;
    } else {
        houseGroup.style.transform = 'translateY(0)';
    }
}

function updateHurricaneRoomVisualization() {
    const hurricaneRoom = document.getElementById('hurricaneRoom');
    hurricaneRoom.style.opacity = gameState.hasHurricaneRoom ? '1' : '0';
}

function updateGeneratorVisualization() {
    const generator = document.getElementById('generatorIcon');
    generator.style.opacity = gameState.hasBackupGenerator ? '1' : '0';
}

function updateSolarVisualization() {
    const solar = document.getElementById('solarIcon');
    solar.style.opacity = gameState.hasSolarPanels ? '1' : '0';
}

function updateRoofVisualization() {
    const roof = document.getElementById('roofElement');
    roof.setAttribute('fill', gameState.hasAerodyanmicRoof ? '#FF6B35' : '#D32F2F');
}

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

function drawDebris() {
    const debrisContainer = document.getElementById('debrisContainer');
    debrisContainer.innerHTML = '';
    
    if (!gameState.isHurricaneDay) return;
    
    const debris = ['🪵', '📦', '🌳', '🚗'];
    for (let i = 0; i < 8; i++) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', Math.random() * 600);
        text.setAttribute('y', Math.random() * 300);
        text.setAttribute('font-size', '18');
        text.textContent = debris[Math.floor(Math.random() * debris.length)];
        debrisContainer.appendChild(text);
    }
    
    debrisContainer.style.opacity = gameState.windSpeed > 70 ? '0.6' : '0';
}

function checkLoseCondition() {
    return Object.keys(gameState.systems).every(systemKey => {
        return isSystemUnderWater(systemKey);
    });
}

function gameLoop() {
    if (!gameState.gameRunning) return;

    gameState.totalDaysElapsed += 7;

    // Slower elixir regeneration
    if (!gameState.isHurricaneDay && gameState.elixir < gameState.maxElixir) {
        gameState.elixir += 0.25;
    } else if (gameState.isHurricaneDay && gameState.elixir < gameState.maxElixir) {
        gameState.elixir += 0.075;
    }
    gameState.elixir = Math.min(gameState.elixir, gameState.maxElixir);

    if (!gameState.isHurricaneDay) {
        gameState.waterHeight = Math.max(0, gameState.waterHeight - 1);
    }

    // Update news duration
    if (gameState.headlinesDuration > 0) {
        gameState.headlinesDuration--;
    } else if (gameState.headlinesDuration === 0 && gameState.currentHeadlines.length > 0) {
        generateNews();
    }

    updateUI();
    renderCards();
    updateForecast();

    if (gameState.totalDaysElapsed >= gameState.totalDays) {
        endGame(true);
        return;
    }

    if (checkLoseCondition()) {
        endGame(false);
        return;
    }

    // Slower during hurricanes
    const speed = gameState.isHurricaneDay || gameState.hurricaneDuration > 0 ? 2000 : 1000;
    setTimeout(gameLoop, speed);
}

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
            <span>Dike Height:</span>
            <strong>${gameState.dikeHeight.toFixed(1)} ft</strong>
        </div>
        <div class="stat-line">
            <span>Total Elevation:</span>
            <strong>${gameState.elevationBonus.toFixed(1)} ft</strong>
        </div>
    `;

    modal.classList.add('active');
}

function closeHurricaneReport() {
    document.getElementById('hurricaneReportModal').classList.remove('active');
}

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
