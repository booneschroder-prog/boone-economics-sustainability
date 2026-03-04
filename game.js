// Hurricane names for random generation
const hurricaneNames = [
    'Amalfi', 'Beckett', 'Carlotta', 'Desmond', 'Elena',
    'Fernando', 'Gracie', 'Hector', 'Iris', 'Julian',
    'Kendra', 'Lorenzo', 'Margot', 'Nolan', 'Olympia',
    'Parker', 'Quinn', 'Roslyn', 'Santiago', 'Thalia',
    'Ulysses', 'Valerie', 'Winston', 'Xander', 'Yara',
    'Zachary', 'Aurora', 'Blake', 'Cassandra', 'Dakota'
];

// Expanded climate news headlines - 100+ headlines
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
    'Heat dome breaks temperature records; 500+ deaths reported',

    // Politics & Policy
    'President allocates $15 billion in disaster funds to Miami after catastrophic hurricane',
    'Florida governor approves $20 billion expansion of Florida\'s turnpike to 10 lanes',
    'New coastal protection tax approved: $2,000 per property per year',
    'Protests erupt in West Palm Beach, Fort Lauderdale, Miami, Jacksonville, Tampa, St. Petersburg, and other Florida coastal cities over proposed state ban of climate education in schools',
    'Biden administration declares Miami climate zone "critically endangered"',
    'Florida legislature passes $8.5 billion climate resilience package',
    'Key West mayor proposes mandatory evacuation zones for entire city by 2035',
    'Boca Raton approves $500 million seawall construction project',
    'Governor Desantis blocks major climate legislation citing economic concerns',
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
    'Housing prices in Orlando and Tallahassee surge after climate refugees from Jacksonville flock to the city',
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
    'WATCH LIVE: Tampa City Council debates building code updates for stronger hurricanes and higher seas',
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
    'Gainesville City Council proposes a $60 million hurricane shelter, residents express concerns over costs',
    'Florida man arrested for attempting to vandalize floating house with pickaxe: videos captured on TikTok',
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
    'Sports team discusses moving headquarters inland due to flooding',
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
    
    // Clear old headlines if we've used too many
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

// [Rest of the game.js code continues as before...]
