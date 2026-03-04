// Hurricane names for random generation
const hurricaneNames = [
    'Amalfi', 'Beckett', 'Carlotta', 'Desmond', 'Elena',
    'Fernando', 'Gracie', 'Hector', 'Iris', 'Julian',
    'Kendra', 'Lorenzo', 'Margot', 'Nolan', 'Olympia',
    'Parker', 'Quinn', 'Roslyn', 'Santiago', 'Thalia',
    'Ulysses', 'Valerie', 'Winston', 'Xander', 'Yara',
    'Zachary', 'Aurora', 'Blake', 'Cassandra', 'Dakota'
];

// Expanded climate news headlines - 140+ headlines
const climateHeadlines = [
    // Disasters & Flooding
    'Cholera outbreak in Sarasota leaves 1,146 people dead',
    'City of Tampa formally dissolves due to ongoing floods',
    'Miami Beach declares state of emergency as permanent "king tide" flooding worsens',
    'Pensacola halts development of coastal condominium complex',
    'Deadly crash on Interstate 4 kills 315 drivers during busy evacuation season',
    'Traffic on Interstate 95 slows evacuation times after hurricane',
    'Broward County proposes $153 billion artificial island city deep in the Atlantic Ocean',
    'Jacksonville flooding reaches historic levels; governor declares state of emergency',
    'St. Petersburg experiences worst storm surge in 50 years',
    'Keys residents ordered to evacuate as storm surge threatens island chain',
    'Entire neighborhood in Fort Myers evacuated due to ground subsidence',
    'Port of Miami suspends operations for third consecutive month',

    // Energy & Emissions
    'Gators Oil Company opens new drilling plant 45 miles offshore',
    'Bipartisan power plant emission regulation bill passes in Congress',
    '6 power company CEOs testify before Congress on reports of alleged emissions reduction violations',
    'Atmosphere methane reaches record high levels',
    'New solar farm in central Florida becomes state\'s largest renewable energy source',
    'Florida legislature votes to phase out natural gas by 2050',
    'Offshore wind farm near Jacksonville begins operation, powering 500,000 homes',
    'Coal power plant in Florida ceases operations after 40 years',
    'Nuclear power facility near Miami approved for 20-year extension',
    'New geothermal energy project aims to heat 100,000 homes in South Florida',
    'Utility company announces $5 billion investment in grid hardening',
    'Texas oil executives lobby against Florida emissions standards',

    // Health & Safety
    'Heat waves in Gainesville kill 56 UF students',
    'Pollution in Miami reaches lethal levels',
    'New heat-related illness reclassified as official cause of death in Florida',
    'Hospitals in Miami overwhelmed with heat exhaustion cases during summer months',
    'EPA issues air quality warnings for entire South Florida region',
    'Dengue fever cases surge in Miami-Dade County to highest levels on record',
    'Study finds 40% increase in respiratory illnesses linked to increased pollen seasons',
    'Zika virus resurges in South Florida communities',
    'Mental health crisis declared in Miami as climate anxiety affects youth',
    'Florida surgeon general warns of increased disease transmission due to flooding',
    'Saltwater contamination of drinking water affects 2 million Floridians',
    'New waterborne illness discovered in flooded areas of South Florida',

    // Politics & Policy
    'President allocates $15 billion in disaster funds to Miami after catastrophic hurricane',
    'Florida governor approves $20 billion expansion of Florida\'s turnpike to 10 lanes',
    'New coastal protection tax approved: $2,000 per property per year',
    'Protests erupt in West Palm Beach, Fort Lauderdale, Miami, Jacksonville, Tampa over climate education ban',
    'Biden administration declares Miami climate zone "critically endangered"',
    'Florida legislature passes $8.5 billion climate resilience package',
    'Key West mayor proposes mandatory evacuation zones for entire city by 2035',
    'Boca Raton approves $500 million seawall construction project',
    'Governor blocks major climate legislation citing economic concerns',
    'Miami City Commission votes to divest from fossil fuel companies',
    'State legislature debates statewide building code overhaul',
    'Federal funding for climate adaptation to Florida reaches $30 billion',

    // Education & Innovation
    'Florida State University adds new elective to structural engineering curriculum focused on floating houses',
    'University of Miami opens Center for Climate Adaptation and Resilience',
    'MIT unveils new amphibious house design tested in Florida neighborhoods',
    'New "floating plane" prototype unveils at New York\'s JFK Airport to respond to rising seas',
    'Car company Chevrolet partners with boat manufacturers to build consumer boats',
    'TIME Magazine ranks Amsterdam and Bangkok as most resilient cities to sea level rise',
    'Stanford researchers publish guide for building "climate-proof" homes in coastal regions',
    'Georgia Tech develops innovative storm surge prediction model',
    'University of Florida launches largest climate resilience research facility in Southeast',
    'TED conference features Florida innovators designing floating architecture',
    'New engineering school in Miami specializes exclusively in climate adaptation',
    'Global universities adopt Florida\'s climate curriculum model',

    // Real Estate & Migration
    'Housing prices in Orlando and Tallahassee surge after climate refugees from Jacksonville flock',
    'Real estate market crashes as climate models revised upward',
    'Miami International Airport installs floating roadways for flood season',
    'Property insurance rates in Florida increase by 35% following hurricane season',
    'Majority of Miami waterfront properties now require flood insurance premiums of $50,000+/year',
    'New development boom in North Florida as residents flee South Florida coasts',
    'Phoenix and Las Vegas see unprecedented migration influx from Florida',
    'Atlanta real estate boom driven by Florida climate refugees',
    'Luxury condo market collapses in Miami Beach as investors flee',
    'Rural Georgia experiences population explosion due to Florida migration',
    'Housing crisis worsens as inland regions become overcrowded',
    'Airbnb listings in Miami drop 60% as owners sell properties',
    'New "climate refuge" communities developed in North Carolina and Tennessee',

    // Infrastructure & Technology
    'Tampa City Council debates building code updates for stronger hurricanes and higher seas',
    'New seawalls completed in Miami Beach; residents debate rising costs',
    'Jacksonville begins major infrastructure relocation project to higher ground',
    'Florida DOT announces $12 billion highway elevation project',
    'Breakthrough in aquaculture allows farming in saltwater environments',
    'Japanese firm proposes underwater city habitat for 10,000 residents off Miami coast',
    'New desalination plant opens in Tampa, providing fresh water for 500,000 residents',
    'Innovative drainage system installed in downtown Miami to combat flooding',
    'Smart flood barriers installed along I-95 corridor',
    'Electric vehicle charging stations now outnumber gas stations in Miami-Dade',
    'Self-driving emergency response vehicles debut in Miami',
    'Advanced weather prediction satellites launch to improve hurricane forecasting',

    // Environmental & Science
    'Scientists warn Arctic sea ice melting faster than predicted',
    'Study: Saltwater intrusion contaminates 30% of South Florida aquifers',
    'Everglades officially declared "ecologically dead" by EPA',
    'Rebel factions in Amazon region in Brazil plant trees in deforested areas',
    'Great Barrier Reef experiences worst bleaching event in recorded history',
    'Atlantic Ocean currents slow to 15% of historical average',
    'Microplastics detected in all major water sources across Florida',
    'Mangrove restoration project in Florida Bay shows promising results',
    'Study links increased hurricane intensity directly to ocean temperature rise',
    'Coral restoration effort in Florida Keys exceeds expectations',
    'New species discovered in deep-sea vents as oceans warm',
    'Atmospheric CO2 reaches 450 ppm, highest in 3 million years',

    // Culture & Media
    'New hit song "Hymn to New Orleans", written by LSU alum, is halftime show in Super Bowl 2065',
    'Netflix releases documentary "Rising Tides: Miami\'s Last Days" breaking viewership records',
    'Florida-based musician wins Grammy for climate change awareness album',
    'New museum opens in Miami documenting the city\'s 100-year climate history',
    'Best-selling novel about climate refugees becomes most banned book in Florida schools',
    'Grammy Award-winning artist announces climate action fund with $100 million commitment',
    'Broadway musical about climate adaptation debuts to standing ovations',
    'Climate-themed video game becomes #1 best seller worldwide',
    'Documentary about Miami\'s resilience efforts nominated for Academy Award',
    'TikTok influencers raise $50 million for Florida climate projects',

    // Financial & Insurance
    'Florida\'s insurance market collapses; state becomes insurer of last resort',
    'Insurance premiums for coastal properties triple in one year',
    'JPMorgan announces climate risk framework for all Florida loans',
    'Federal government to subsidize 50% of coastal property insurance costs',
    'Cryptocurrency-based climate insurance platform launches for homeowners',
    'Credit rating agencies downgrade Florida bonds due to climate risk',
    'Major insurance companies withdraw from Florida market entirely',
    'State Farm announces plans to leave Florida amid rising claims',
    'New climate-specific insurance pools form across Southeast',
    'Financial analysts predict $200 billion in Florida property losses by 2050',
    'Bond market reflects growing climate risk in Florida',

    // International & Global
    'Dutch engineers selected to design $50 billion flood defense system for Miami',
    'Singapore pledges technical support for Florida\'s sea level rise adaptation',
    'UN climate summit in Nairobi focuses on "Florida Solutions" for coastal adaptation',
    'European Union designates Miami as priority climate adaptation region',
    'Panama Canal operations threatened by changing rainfall patterns',
    'Caribbean nations form alliance with Florida on climate resilience',
    'Climate protests in Brazil faced with tear gas and rubber bullets',
    'G7 leaders commit $100 billion to coastal adaptation including Florida',
    'Chinese investors develop new resilience technologies for Miami',
    'Swiss reinsurance firm releases alarming report on Florida climate risk',
    'Australia shares Indigenous climate adaptation strategies with Florida',

    // Business & Innovation
    'Tech billionaire announces plan to terraform Florida with massive pumping system',
    'Aqua-cultured fish farms replace traditional agriculture across South Florida',
    'Major pharmaceutical company relocates headquarters from Miami to Atlanta',
    'SpaceX proposes satellite-based early warning system for hurricanes',
    'Amazon announces plan to build climate-resilient warehouses in Florida',
    'Google develops AI system to predict optimal evacuation routes',
    'Tesla expands manufacturing in inland Florida',
    'Startup creates AI-powered home defense system against flooding',
    'New smart building materials tested on Miami properties',
    'Major tech company opens climate adaptation research lab in Tampa',
    'Venture capital floods into Florida climate tech startups',

    // Local & Community Issues
    'Gainesville City Council proposes $60 million hurricane shelter, residents express concerns over costs',
    'Florida man arrested for attempting to vandalize floating house with pickaxe: videos on TikTok',
    'Community gardens transform neighborhood into urban farm',
    'Residents file lawsuit against city over flood-prone development',
    'Local activist wins mayoral race on climate platform',
    'Neighborhood watch creates citizen flood warning system',
    'Town hall meeting draws 5,000 residents concerned about evacuation plans',
    'Volunteers plant 100,000 mangroves in restoration effort',
    'Community center opens 24/7 as emergency cooling station',
    'Local school implements climate curriculum starting in kindergarten',
    'Homeowners association votes to require climate-resilient building standards',
    'Grassroots movement pressures city council for rapid infrastructure upgrades',

    // Miscellaneous & Opinion
    'Op-ed: "We Should Have Listened to Scientists 30 Years Ago"',
    'Survey: 73% of Floridians considering leaving the state within 10 years',
    'Florida teen becomes youngest climate activist to testify before Congress',
    'Retirees face difficult choice: stay in Florida or move inland',
    'New term "climate mortgage" emerges as buyers factor in long-term flood risk',
    'Florida becomes first state to declare climate emergency',
    'Study: Anxiety and depression rates among Floridians increase 42% year-over-year',
    'Mayor of Miami Beach: "We are fighting for the survival of our city"',
    'Billionaire pledges $10 billion to save Miami from climate crisis',
    'Conspiracy theory about "weather control" gains traction among climate skeptics',
    'Florida author releases memoir about adapting to climate change',
    'Youth-led climate movement demands action from state government',
    'Economist warns of $500 billion in stranded assets in Florida',
    'Religious leaders call for moral action on climate crisis',
    'Popular cruise line announces suspension of Miami port operations',
    'Theme parks begin planning relocation from coastal Florida',
    'Sports team discusses moving headquarters inland due to flooding'
];

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
    windSpeed: 5,
    downedSystems: new Set(),
    dikeHeight: 0,
    elevationBonus: 0,
    hasHurricaneRoom: false,
    hasBackupGenerator: false,
    hasAerodyanmicRoof: false,
    hasSolarPanels: false,
    defenseCount: 0,
    maxDefenses: 3,
    lastHurricaneCategory: 0,
    lastHurricaneName: '',
    lastHurricaneDamage: {},
    lastHurricaneCostApplied: false,
    usedHeadlines: new Set(),
    
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
        costPerUnit: 2,
        description: 'Build protective dikes (2 elixir/ft)',
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
        effect: (state, amount) => {
            state.elevationBonus += amount;
        }
    },
    {
        id: 'generator',
        name: 'Backup Generator',
        icon: '⚙️',
        cost: 6,
        chanceOfDamage: 0.2,
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
        chanceOfDamage: 0.25,
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
        chanceOfDamage: 0.75,
        downtime: 5,
        description: 'Solar panels (9 elixir, high risk)',
        effect: (state) => {
            state.hasSolarPanels = true;
        }
    },
    {
        id: 'hurricane-room',
        name: 'Hurricane Room',
        icon: '🛡️',
        cost: 13,
        chanceOfDamage: 0.05,
        description: 'Concrete safe room (13 elixir)',
        effect: (state) => {
            state.hasHurricaneRoom = true;
        }
    }
];

// Get random hurricane name
function getHurricaneName(year, weekOfYear) {
    const seed = (year * 52 + weekOfYear) % hurricaneNames.length;
    return hurricaneNames[seed];
}

// Get random news headline
function getRandomHeadline() {
    let headline;
    let attempts = 0;
    do {
        headline = climateHeadlines[Math.floor(Math.random() * climateHeadlines.length)];
        attempts++;
    } while (gameState.usedHeadlines.has(headline) && attempts < 10);
    
    gameState.usedHeadlines.add(headline);
    
    if (gameState.usedHeadlines.size > 25) {
        const headlinesToKeep = Math.floor(gameState.usedHeadlines.size * 0.4);
        const headlinesArray = Array.from(gameState.usedHeadlines);
        gameState.usedHeadlines.clear();
        for (let i = 0; i < headlinesToKeep; i++) {
            gameState.usedHeadlines.add(headlinesArray[i]);
        }
    }
    
    return headline;
}

// Update news display
function updateNews() {
    const newsHeadline = document.getElementById('newsHeadline');
    const headline = getRandomHeadline();
    newsHeadline.innerHTML = `<p>${headline}</p>`;
}

// Calculate sea level rise
function getSeaLevelRise(year) {
    const yearsElapsed = year - 2025;
    const baselineSeaLevel = 3;
    const projectedRise = (yearsElapsed / 75) * 5;
    return baselineSeaLevel + projectedRise;
}

// Calculate max wind speed
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

// Determine hurricane category
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

// Get hurricane category for week
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
    gameState.gamePaused = false;
}

// Initialize game
function initGame() {
    showInfoModal();
    renderCards();
    updateForecast();
    updateNews();
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
        const atMaxDefenses = gameState.defenseCount >= gameState.maxDefenses;
        
        if (!canAfford) {
            cardElement.classList.add('unavailable');
        }
        
        if (atMaxDefenses) {
            cardElement.classList.add('maxed');
        }

        let costText = cost + ' 💰';
        if (card.costPerUnit) {
            costText = '1-4 ft (' + card.costPerUnit + '💰/ft)';
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

        if (canAfford && !atMaxDefenses) {
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

    if (gameState.defenseCount >= gameState.maxDefenses) {
        alert('Maximum 3 defenses between hurricanes!');
        return;
    }

    let cost = card.cost || card.costPerUnit;
    
    if (card.costPerUnit) {
        const height = prompt(`How many feet? (1-4, costs ${card.costPerUnit} elixir each)`, '1');
        if (!height || isNaN(height) || height < 1 || height > 4) return;
        cost = parseInt(height) * card.costPerUnit;
    }

    if (gameState.elixir < cost) {
        alert('Not enough Budget!');
        return;
    }

    gameState.elixir -= cost;

    const failChance = gameState.isHurricaneDay ? card.chanceOfDamage : 0;
    
    let adjustedFailChance = failChance;
    if (card.id === 'generator' && gameState.hasSolarPanels) {
        adjustedFailChance = failChance * 0.5;
    }
    if (card.id === 'solar' && gameState.hasBackupGenerator) {
        adjustedFailChance = failChance * 0.5;
    }
    
    const didFail = Math.random() < adjustedFailChance;

    if (didFail) {
        addDefense(card, true, cost);
        damageRandomSystem();
    } else {
        card.effect(gameState, cost);
        addDefense(card, false, cost);
    }

    if (card.downtime && didFail) {
        const systemKey = card.id === 'generator' ? 'electrical' : card.id === 'aerodynamic' ? 'bedroom' : null;
        if (systemKey) {
            gameState.downedSystems.add(systemKey);
            setTimeout(() => {
                gameState.downedSystems.delete(systemKey);
            }, card.downtime * 7 * 1000);
        }
    }

    gameState.defenseCount++;
    updateUI();
    renderCards();
    updateForecast();
}

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

function updateDefensesList() {
    const defensesList = document.getElementById('defensesList');
    defensesList.innerHTML = '';
    
    document.getElementById('defenseCount').textContent = gameState.defenseCount;

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

    const isHurricane = isHurricaneWeek(gameState.currentYear, gameState.currentWeek);
    gameState.isHurricaneDay = isHurricane;
    
    if (isHurricane) {
        gameState.lastHurricaneCategory = getWeekHurricaneCategory(gameState.currentYear, gameState.currentWeek);
        gameState.lastHurricaneName = getHurricaneName(gameState.currentYear, gameState.currentWeek);
        gameState.lastHurricaneCostApplied = false;
    } else {
        gameState.lastHurricaneCategory = 0;
    }

    const dayStatusElement = document.getElementById('dayStatus');
    const headerElement = document.getElementById('headerBackground');
    const skyBackground = document.getElementById('skyBackground');
    const weatherIndicator = document.getElementById('weatherIndicator');
    const hurricaneCategory = document.getElementById('hurricaneCategory');

    if (gameState.isHurricaneDay) {
        dayStatusElement.textContent = `🌀 ${gameState.lastHurricaneName}`;
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
        
        gameState.defenseCount = 0;
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

    const totalWater = gameState.waterHeight + seaLevel - gameState.elevationBonus - gameState.dikeHeight;
    const waterPercentage = Math.min((totalWater / gameState.maxWaterHeight) * 100, 100);
    
    const waterLevel = document.getElementById('waterLevel');
    const newY = 400 + (100 - waterPercentage) * 3;
    waterLevel.setAttribute('y', newY);
    waterLevel.setAttribute('height', Math.max(0, Math.min(waterPercentage * 3, 300)));

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

    const scale = Math.min(dikeHeight / 4, 1);
    const heightIncrease = scale * 30;
    
    const dikeLeftBase = document.getElementById('dikeLeftBase');
    dikeLeftBase.setAttribute('points', `80,${350 - heightIncrease} 100,${350 - heightIncrease} 110,${320 - heightIncrease} 70,${320 - heightIncrease}`);
    
    const dikeRightBase = document.getElementById('dikeRightBase');
    dikeRightBase.setAttribute('points', `520,${350 - heightIncrease} 540,${350 - heightIncrease} 550,${320 - heightIncrease} 490,${320 - heightIncrease}`);
}

function updateElevationVisualization() {
    const houseGroup = document.getElementById('houseGroup');
    const elevationBonus = gameState.elevationBonus;
    
    if (elevationBonus > 0) {
        const yOffset = elevationBonus * 10;
        houseGroup.style.transform = `translateY(-${yOffset}px)`;
    } else {
        houseGroup.style.transform = 'translateY(0)';
    }
}

function updateHurricaneRoomVisualization() {
    const hurricaneRoom = document.getElementById('hurricaneRoom');
    if (gameState.hasHurricaneRoom) {
        hurricaneRoom.style.opacity = '1';
    } else {
        hurricaneRoom.style.opacity = '0';
    }
}

function updateGeneratorVisualization() {
    const generator = document.getElementById('generatorIcon');
    if (gameState.hasBackupGenerator) {
        generator.style.opacity = '1';
    } else {
        generator.style.opacity = '0';
    }
}

function updateSolarVisualization() {
    const solar = document.getElementById('solarIcon');
    if (gameState.hasSolarPanels) {
        solar.style.opacity = '1';
    } else {
        solar.style.opacity = '0';
    }
}

function updateRoofVisualization() {
    const roof = document.getElementById('roofElement');
    if (gameState.hasAerodyanmicRoof) {
        roof.setAttribute('fill', '#FF6B35');
    } else {
        roof.setAttribute('fill', '#D32F2F');
    }
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
        text.setAttribute('y', Math.random() * 250);
        text.setAttribute('font-size', '18');
        text.textContent = debris[Math.floor(Math.random() * debris.length)];
        debrisContainer.appendChild(text);
    }
    
    debrisContainer.style.opacity = gameState.windSpeed > 70 ? '0.6' : '0';
}

function checkLoseCondition() {
    const allSystemsDown = Object.keys(gameState.systems).every(systemKey => {
        return isSystemUnderWater(systemKey);
    });

    return allSystemsDown;
}

function gameLoop() {
    if (!gameState.gameRunning) return;

    gameState.totalDaysElapsed += 7;

    if (!gameState.isHurricaneDay && gameState.elixir < gameState.maxElixir) {
        gameState.elixir += 0.5;
    } else if (gameState.isHurricaneDay && gameState.elixir < gameState.maxElixir) {
        gameState.elixir += 0.15;
    }
    gameState.elixir = Math.min(gameState.elixir, gameState.maxElixir);

    if (!gameState.isHurricaneDay) {
        gameState.waterHeight = Math.max(0, gameState.waterHeight - 1);
    }

    updateUI();
    renderCards();
    updateForecast();
    
    if (gameState.totalDaysElapsed % 14 === 0) {
        updateNews();
    }

    if (gameState.totalDaysElapsed >= gameState.totalDays) {
        endGame(true);
        return;
    }

    if (checkLoseCondition()) {
        endGame(false);
        return;
    }

    setTimeout(gameLoop, 1000);
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
