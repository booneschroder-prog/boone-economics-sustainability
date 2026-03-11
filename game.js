// Hurricane names
const hurricaneNames = [
    'Amalfi', 'Beckett', 'Carlotta', 'Desmond', 'Elena',
    'Fernando', 'Gracie', 'Hector', 'Iris', 'Julian',
    'Kendra', 'Lorenzo', 'Margot', 'Nolan', 'Olympia',
    'Parker', 'Quinn', 'Roslyn', 'Santiago', 'Thalia',
    'Ulysses', 'Valerie', 'Winston', 'Xander', 'Yara',
    'Zachary', 'Aurora', 'Blake', 'Cassandra', 'Dakota'
];

// Year-based news headlines (2025-2100)
const headlinesByYear = {
    early: [ // 2025-2040
        'Cholera outbreak in Sarasota leaves 1,146 people dead',
        'New solar farm in central Florida becomes state\'s largest renewable energy source',
        'Gators Oil Company opens new drilling plant 45 miles offshore',
        'Heat waves in Gainesville kill 56 UF students',
        'Miami Beach declares state of emergency as permanent "king tide" flooding worsens',
        'Pensacola halts development of coastal condominium complex',
        'Florida State University adds new elective to structural engineering curriculum',
        'University of Miami opens Center for Climate Adaptation and Resilience',
        'Housing prices in Orlando and Tallahassee surge after climate refugees from Jacksonville',
        'President allocates $15 billion in disaster funds to Miami',
        'New coastal protection tax approved: $2,000 per property per year',
        'Protests erupt in West Palm Beach, Fort Lauderdale, Miami over climate education ban',
        'Florida legislature passes $8.5 billion climate resilience package',
        'Offshore wind farm near Jacksonville begins operation, powering 500,000 homes',
        'Bipartisan power plant emission regulation bill passes in Congress'
    ],
    middle: [ // 2040-2070
        'City of Tampa formally dissolves due to ongoing floods',
        'Florida governor approves $20 billion expansion of Florida\'s turnpike to 10 lanes',
        'Netherlands engineers selected to design $50 billion flood defense system for Miami',
        'Real estate market crashes as climate models revised upward',
        'Major pharmaceutical company relocates headquarters from Miami to Atlanta',
        'Jacksonville begins major infrastructure relocation project to higher ground',
        'Deadly crash on Interstate 4 kills 315 drivers during evacuation season',
        'New desalination plant opens in Tampa, providing fresh water for 500,000 residents',
        'SpaceX proposes satellite-based early warning system for hurricanes',
        'Atmosphere methane reaches record high levels',
        'Key West mayor proposes mandatory evacuation zones for entire city by 2035',
        'Credit rating agencies downgrade Florida bonds due to climate risk',
        'Theme parks begin planning relocation from coastal Florida',
        'Aqua-cultured fish farms replace traditional agriculture',
        'Atlantic Ocean currents slow to 15% of historical average'
    ],
    late: [ // 2070-2100
        'Gainesville City Council proposes $60 million hurricane shelter',
        'Florida man arrested for attempting to vandalize floating house with pickaxe on TikTok',
        'Climate protests in Brazil faced with tear gas and rubber bullets',
        'New "floating plane" prototype unveiled at New York\'s JFK Airport',
        'Study: Saltwater intrusion contaminates 30% of South Florida aquifers',
        'Everglades officially declared "ecologically dead" by EPA',
        'Great Barrier Reef experiences worst bleaching in recorded history',
        'Miami International Airport installs floating roadways for flood season',
        'Tech billionaire announces plan to terraform Florida with massive pumping system',
        'Cryptocurrency-based climate insurance platform launches',
        'New hit song "Hymn to New Orleans" written by LSU alum wins Grammy',
        'Netflix documentary "Rising Tides: Miami\'s Last Days" breaks viewership records',
        'Survey: 73% of Floridians considering leaving the state',
        'Op-ed: "We Should Have Listened to Scientists 30 Years Ago"',
        'Popular cruise line announces suspension of Miami port operations'
    ]
};

// Game state
const gameState = {
    currentYear: 2025,
    currentMonth: 0,
    currentWeek: 0,
    totalDaysElapsed: 0,
    totalDays: 75 * 365,
    elixir: 2,
    maxElixir: 20,
    gameRunning: true,
    gamePaused: false,
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
    headlinesNewsActive: false,
    gameSpeed: 1,
    
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
        downtime: (amount) => Math.ceil(amount * 2),
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
        description: 'Concrete safe room (13 elixir)',
        effect: (state) => {
            state.hasHurricaneRoom = true;
        }
    }
];

// Get headlines for year
function getHeadlinesForYear(year) {
    if (year < 2040) return headlinesByYear.early;
    if (year < 2070) return headlinesByYear.middle;
    return headlinesByYear.late;
}

// Generate news headlines
function generateNews() {
    const headlines = getHeadlinesForYear(gameState.currentYear);
    const available = headlines.filter(h => !gameState.usedHeadlines.has(h));
    
    if (available.length === 0) {
        gameState.usedHeadlines.clear();
        gameState.currentHeadlines = [];
        return;
    }
    
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 headlines
    const selected = [];
    for (let i = 0; i < Math.min(count, available.length); i++) {
        const idx = Math.floor(Math.random() * available.length);
        const headline = available[idx];
        selected.push(headline);
        gameState.usedHeadlines.add(headline);
        available.splice(idx, 1);
    }
    
    gameState.currentHeadlines = selected;
    gameState.headlinesDuration = Math.floor(Math.random() * 10) + 4; // 4-13 weeks
    gameState.headlinesNewsActive = true;
    updateNewsDisplay();
}

// Update news display
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

// Get hurricane name
function getHurricaneName(year, weekOfYear) {
    const seed = (year * 52 + weekOfYear) % hurricaneNames.length;
    return hurricaneNames[seed];
}

// Sea level rise
function getSeaLevelRise(year) {
    const yearsElapsed = year - 2025;
    const baselineSeaLevel = 3;
    const projectedRise = (yearsElapsed / 75) * 5;
    return baselineSeaLevel + projectedRise;
}

// Max wind speed
function getMaxWindSpeed(year) {
    const yearsElapsed = year - 2025;
    const baseWind = 5;
    const maxWind = 150;
    return baseWind + (yearsElapsed / 75) * (maxWind - baseWind);
}

// Hurricane probability
function getHurricaneChance(year) {
    const yearsElapsed = year - 2025;
    const baseProbability = 0.05;
    const maxProbability = 0.40;
    return baseProbability + (yearsElapsed / 75) * (maxProbability - baseProbability);
}

// Hurricane category
function getHurricaneCategory(year, seed) {
    const yearsElapsed = year - 2025;
    const progressionFactor = yearsElapsed / 75;
    
    if (seed < 0.4 + progressionFactor * 0.3) return 1;
    if (seed < 0.65 + progressionFactor * 0.2) return 2;
    if (seed < 0.82 + progressionFactor * 0.1) return 3;
    if (seed < 0.92 + progressionFactor * 0.05) return 4;
    return 5;
}

// Is hurricane week
function isHurricaneWeek(year, weekOfYear) {
    const hurricaneChance = getHurricaneChance(year);
    const seed = (year * 52 + weekOfYear) % 100 / 100;
    return seed < hurricaneChance;
}

// Get hurricane category
function getWeekHurricaneCategory(year, weekOfYear) {
    const seed = ((year * 52 + weekOfYear) * 73) % 100 / 100;
    if (isHurricaneWeek(year, weekOfYear)) {
        return getHurricaneCategory(year, seed);
    }
    return 0;
}

// Generate forecast
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

// Update forecast
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

// Show hurricane report
function showHurricaneReport() {
    const seaLevel = getSeaLevelRise(gameState.currentYear);
    const totalWater = gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight;
    
    let damageHTML = `
        <div class="damage-section">
            <h3>🌪️ Hurricane ${gameState.lastHurricaneName} (Category ${gameState.lastHurricaneCategory})</h3>
            <div class="damage-item">
                <span class="damage-icon">💨</span>
                <span>Max Wind Speed: ${(50 + gameState.windSpeed).toFixed(0)} mph</span>
            </div>
            <div class="damage-item">
                <span class="damage-icon">🌊</span>
                <span>Peak Water Height: ${totalWater.toFixed(1)} ft</span>
            </div>
        </div>
    `;
    
    let structuralDamage = 0;
    let costApplied = 0;
    let damagedSystems = [];
    
    Object.keys(gameState.lastHurricaneDamage).forEach(systemKey => {
        damagedSystems.push(gameState.systems[systemKey].name);
        structuralDamage += 500 * gameState.lastHurricaneCategory;
        costApplied += gameState.lastHurricaneCategory * 1.5;
    });
    
    if (damagedSystems.length > 0) {
        damageHTML += `
            <div class="damage-section">
                <h3>🔧 Damaged Systems</h3>
                <div class="damage-item">
                    <span class="damage-icon">⚠️</span>
                    <span>${damagedSystems.join(', ')}</span>
                </div>
            </div>
        `;
    }
    
    if (structuralDamage > 0) {
        damageHTML += `
            <div class="damage-section">
                <h3>🏗️ Structural Damage</h3>
                <div class="damage-item">
                    <span class="damage-icon">💰</span>
                    <span>Repair Cost: $${structuralDamage.toLocaleString()}</span>
                </div>
                <div class="damage-item">
                    <span class="damage-icon">💾</span>
                    <span>Budget Impact: ${costApplied.toFixed(1)} elixir</span>
                </div>
            </div>
        `;
    }
    
    damageHTML += `
        <div class="damage-section">
            <h3>💰 Repair Costs</h3>
            <div class="damage-item">
                <span class="damage-icon">📊</span>
                <span>Total Repair Cost: ${costApplied.toFixed(1)} elixir</span>
            </div>
            <div class="damage-item">
                <span class="damage-icon">💳</span>
                <span>Remaining Budget: ${Math.max(0, gameState.elixir - costApplied).toFixed(1)} elixir</span>
            </div>
        </div>
    `;
    
    document.getElementById('hurricaneReportContent').innerHTML = damageHTML;
    document.getElementById('hurricaneReportTitle').textContent = `Hurricane ${gameState.lastHurricaneName} - Damage Report`;
    document.getElementById('hurricaneReportModal').classList.add('active');
}

function closeHurricaneReport() {
    document.getElementById('hurricaneReportModal').classList.remove('active');
}

// Initialize game
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
            costText = '1-10 ft (' + card.costPerUnit + '💰/ft)';
        }

        let statsText = '';
        let downtime = typeof card.downtime === 'function' ? 'Variable' : card.downtime;
        if (downtime > 0) {
            statsText = `Downtime: ${downtime}w`;
        }
        if (card.chanceOfFailure) {
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

    const failChance = gameState.isHurricaneDay ? card.chanceOfFailure : 0;
    
    let adjustedFailChance = failChance;
    if (card.id === 'generator' && gameState.hasSolarPanels) {
        adjustedFailChance = failChance * 0.5;
    }
    if (card.id === 'solar' && gameState.hasBackupGenerator) {
        adjustedFailChance = failChance * 0.5;
    }
    
    const didFail = Math.random() < adjustedFailChance;

    // Special dike logic
    let downtime = 0;
    if (card.id === 'dikes') {
        const height = parseInt(prompt('Height:', '1'));
        if (gameState.isHurricaneDay) {
            const seaLevel = getSeaLevelRise(gameState.currentYear);
            const totalWater = gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight;
            
            if (totalWater > height * 3) {
                adjustedFailChance = 1.0; // 100% failure
            } else if (totalWater > 0) {
                adjustedFailChance = 0.5; // 50% failure
            }
        }
    } else {
        downtime = typeof card.downtime === 'function' ? card.downtime(cost) : (card.downtime || 0);
    }

    if (didFail) {
        addDefense(card, true, cost, downtime);
        damageRandomSystem();
    } else {
        card.effect(gameState, cost);
        addDefense(card, false, cost, downtime);
    }

    if (downtime && didFail) {
        const systemKey = card.id === 'generator' ? 'electrical' : null;
        if (systemKey) {
            gameState.downedSystems.add(systemKey);
            setTimeout(() => {
                gameState.downedSystems.delete(systemKey);
            }, downtime * 7 * 1000);
        }
    }

    updateUI();
    renderCards();
    updateForecast();
}

function addDefense(card, failed, cost, downtime) {
    const defense = {
        id: card.id + '_' + Date.now(),
        card: card,
        failed: failed,
        cost: cost,
        downtime: downtime,
        weeksLeft: downtime,
        active: downtime === 0
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
        const status = defense.active ? '✓ Active' : `⏳ ${defense.weeksLeft}w`;
        item.innerHTML = `
            <div class="defense-item-name">${defense.card.icon} ${defense.card.name}</div>
            <div class="defense-item-status">${defense.failed ? '❌ Failed' : status}</div>
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
    const baseCosts = {
        1: 2,
        2: 4,
        3: 6,
        4: 8,
        5: 10
    };
    
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

    const isHurricane = isHurricaneWeek(
