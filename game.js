// Fixed game.js — ensures repairElectric and repairCooling are defined before use,
// keeps generator -> cooling behavior, cooling grace, HP model, repairs-anytime, and tuned hurricane progression.

// -------------------------
// Global endGame
// -------------------------
function endGame(reason) {
  if (window.gameState) {
    window.gameState.gameOver = true;
    window.gameState.gameRunning = false;
  }

  const modal = document.getElementById('repairModal');
  if (modal) {
    try {
      const active = document.activeElement;
      if (active && modal.contains(active)) active.blur();
    } catch (e) {}
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  setTimeout(() => {
    const y = window.gameState ? window.gameState.year : '';
    const w = window.gameState ? (window.gameState.week + 1) : '';
    const tw = (typeof getTotalWaterFt === 'function') ? getTotalWaterFt().toFixed(1) : '';
    const th = (typeof getSecondFloorFloodThresholdFt === 'function') ? getSecondFloorFloodThresholdFt().toFixed(1) : '';
    alert(`${reason}\n\nYear: ${y}\nWeek: ${w}\nTotal water: ${tw} ft\n2nd floor flood threshold: ${th} ft`);
  }, 60);
}

// -------------------------
// State & config
// -------------------------
const gameState = {
  year: 2025, week: 0, daysElapsed: 0, totalDays: 75 * 365,
  elixir: 2, maxElixir: 20,
  waterHeight: 0, maxWaterHeight: 20,
  dikeHeight: 0, elevation: 0,
  hasGenerator: false, hasAerodynamicRoof: false, hasSafeRoom: false,
  construction: [], safeRoomBuiltOrQueued: false, defenses: [],
  isHurricane: false, hurricaneCategory: 0, lastHurricaneCategory: 0,
  hp: { bedroom: 100, bathroom: 100, electrical: 100, cooling: 100, safeRoom: 0 },
  coolingGraceStart: 6, coolingGraceEnd: 2, coolingGraceWeeksLeft: 6,
  inRepairWindow: false, repairWeeksLeft: 0, repairWeeksMax: 3, lastHurricaneSummary: null,
  gameRunning: true, gameOver: false, wasHurricaneLastWeek: false
};

const powerOutageChanceDuringHurricane = 0.9;
const generatorFailByCategory = {1:0.10,2:0.20,3:0.35,4:0.50,5:0.65};
const baseRepairElectric = 6;
const baseRepairCooling = 4;

const cards = [
  {id:'dikes', name:'Dikes/Levees', icon:'🛡️', cost:5, costPerUnit:true, max:10},
  {id:'elevate', name:'Elevate Structure', icon:'⬆️', cost:15, costPerUnit:true, max:4, downtimeWeeksPerFoot:3},
  {id:'aero', name:'Aerodynamic Roof', icon:'🏠', cost:5, downtimeWeeks:2},
  {id:'gen', name:'Backup Generator', icon:'⚙️', cost:6, downtimeWeeks:2},
  {id:'room', name:'Hurricane Room', icon:'🛡️', cost:13, downtimeWeeks:6, unique:true}
];

const headlines = [
  'Heat waves in Gainesville kill 56 UF students',
  'City of Tampa formally dissolves due to ongoing floods',
  'Miami Beach declares emergency over permanent king tide flooding',
  'Cholera outbreak in Sarasota leaves 1,146 dead',
  'Gainesville City Council proposes a $60 million hurricane shelter',
  'Florida man arrested for attempting to vandalize floating house with pickaxe',
  'Bipartisan power plant emission regulation bill passes in Congress'
];
const usedHeadlines = new Set();

// -------------------------
// Utilities
// -------------------------
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function yearsElapsed(){return gameState.year-2025;}
function progressionFactor(){return clamp(yearsElapsed()/75,0,1);}
function getSeaLevelFt(year){ const e = year-2025; return 3 + (e/75)*5; }
function getTotalWaterFt(){ return gameState.waterHeight + getSeaLevelFt(gameState.year) - gameState.elevation - gameState.dikeHeight; }
function getSecondFloorFloodThresholdFt(){ return 10 + gameState.elevation; }
function computeCoolingGraceMaxWeeksForYear(year){ const t = clamp((year-2025)/75,0,1); return Math.round(gameState.coolingGraceStart + (gameState.coolingEnd ? 0 : (gameState.coolingGraceEnd - gameState.coolingGraceStart) * t)); }
// simpler safe impl:
function computeCoolingGraceMaxWeeksForYear(year){ const t = clamp((year-2025)/75,0,1); return Math.round(gameState.coolingGraceStart + (gameState.coolingGraceEnd - gameState.coolingGraceStart) * t); }

// -------------------------
// Hurricane progression (easier early, harder late)
// -------------------------
function getHurricaneChance(year, week) {
  if (year === 2025 && week < 10) return 0;
  const elapsed = year - 2025;
  return 0.05 + (elapsed / 75) * 0.35;
}

function isHurricaneWeek(year, week) {
  const chance = getHurricaneChance(year, week);
  const seed = ((year*52 + week) % 100) / 100;
  return seed < chance;
}

function getHurricaneCategory(year, week) {
  const elapsed = year - 2025;
  const t = clamp(elapsed/75,0,1);
  const seed = (((year*92821 + week*6899) % 1000) / 1000);

  const p1 = 0.55 - 0.25*t;
  const p2 = 0.28 - 0.05*t;
  const p3 = 0.12 + 0.05*t;
  const p4 = 0.03 + 0.08*t;
  const p5 = 0.02 + 0.17*t;

  const cut1 = p1, cut2 = cut1 + p2, cut3 = cut2 + p3, cut4 = cut3 + p4;
  if (seed < cut1) return 1;
  if (seed < cut2) return 2;
  if (seed < cut3) return 3;
  if (seed < cut4) return 4;
  return 5;
}

// -------------------------
// News
// -------------------------
function updateNews(){
  const el = document.getElementById('news'); if(!el) return;
  const available = headlines.filter(h=>!usedHeadlines.has(h));
  if(available.length===0) usedHeadlines.clear();
  const pick = (available.length ? available[Math.floor(Math.random()*available.length)] : headlines[Math.floor(Math.random()*headlines.length)]);
  usedHeadlines.add(pick);
  el.innerHTML = `<div class="news-item">${pick}</div>`;
}

// -------------------------
// Construction
// -------------------------
function addConstruction(job){ gameState.construction.push(job); }
function tickConstruction(){
  if(!gameState.construction.length) return;
  for(const j of gameState.construction) j.weeksLeft -= 1;
  const finished = gameState.construction.filter(j=>j.weeksLeft <= 0);
  gameState.construction = gameState.construction.filter(j=>j.weeksLeft > 0);
  for(const job of finished){
    if(job.kind==='elevate'){ gameState.elevation = clamp(gameState.elevation + job.payload.feet,0,10); gameState.defenses.push(`⬆️ Elevation completed: +${job.payload.feet} ft (total ${gameState.elevation})`); }
    else if(job.kind==='gen'){ gameState.hasGenerator = true; gameState.defenses.push('⚙️ Generator installed (active)'); }
    else if(job.kind==='aero'){ gameState.hasAerodynamicRoof = true; gameState.defenses.push('🏠 Aerodynamic roof installed (reduces wind damage)'); }
    else if(job.kind==='room'){ gameState.hasSafeRoom = true; gameState.hp.safeRoom = 200; gameState.defenses.push('🛡️ Hurricane Room completed (substitutes bedroom + bathroom)'); }
  }
}

// -------------------------
// Repair functions (modal) - DECLARED before wiring
// -------------------------
function getRepairCostElectric(cat){ const c = Math.max(1, cat||1); return baseRepairElectric * c; }
function getRepairCostCooling(cat){ const c = Math.max(1, cat||1); return baseRepairCooling * c; }
function bedroomOrBathroomDead(){ if(gameState.hasSafeRoom) return gameState.hp.safeRoom <= 0; return (gameState.hp.bedroom <= 0 || gameState.hp.bathroom <= 0); }

// Repair while in modal
function repairElectric(){
  if(!gameState.inRepairWindow) return;
  const cat = Math.max(1, gameState.lastHurricaneSummary?.category || gameState.lastHurricaneCategory || 1);
  const cost = getRepairCostElectric(cat);
  if(gameState.elixir < cost) { alert('Not enough elixir'); return; }
  gameState.elixir -= cost;
  gameState.hp.electrical = 100;
  // don't reset repairWeeksLeft; refresh modal
  openRepairModal(gameState.lastHurricaneSummary);
  updateAllUI();
}

function repairCooling(){
  if(!gameState.inRepairWindow) return;
  const cat = Math.max(1, gameState.lastHurricaneSummary?.category || gameState.lastHurricaneCategory || 1);
  const cost = getRepairCostCooling(cat);
  if(gameState.elixir < cost) { alert('Not enough elixir'); return; }
  gameState.elixir -= cost;
  gameState.hp.cooling = 100;
  gameState.coolingGraceWeeksLeft = computeCoolingGraceMaxWeeksForYear(gameState.year);
  openRepairModal(gameState.lastHurricaneSummary);
  updateAllUI();
}

// Immediate repairs allowed on normal days (outside modal)
function repairElectricImmediate(){
  if(gameState.isHurricane){ alert('Cannot repair during hurricane week'); return; }
  const cat = Math.max(1, gameState.lastHurricaneCategory || 1);
  const cost = getRepairCostElectric(cat);
  if(gameState.elixir < cost){ alert(`Need ${cost} elixir`); return; }
  gameState.elixir -= cost;
  gameState.hp.electrical = 100;
  updateAllUI();
}

function repairCoolingImmediate(){
  if(gameState.isHurricane){ alert('Cannot repair during hurricane week'); return; }
  const cat = Math.max(1, gameState.lastHurricaneCategory || 1);
  const cost = getRepairCostCooling(cat);
  if(gameState.elixir < cost){ alert(`Need ${cost} elixir`); return; }
  gameState.elixir -= cost;
  gameState.hp.cooling = 100;
  gameState.coolingGraceWeeksLeft = computeCoolingGraceMaxWeeksForYear(gameState.year);
  updateAllUI();
}

// -------------------------
// Repair modal & continue logic
// -------------------------
function openRepairModal(summary){
  // refresh only; don't reset repairWeeksLeft (set where repair window is opened)
  gameState.inRepairWindow = true;
  gameState.lastHurricaneSummary = summary;
  const modal = document.getElementById('repairModal'); if(!modal) return;
  if(modal.parentNode !== document.body) document.body.appendChild(modal);
  modal.classList.add('active'); modal.setAttribute('aria-hidden','false');
  modal.style.zIndex = '99999'; modal.style.pointerEvents = 'auto';
  const title = document.getElementById('repairTitle'); const body = document.getElementById('repairBody'); const foot = document.getElementById('repairFootnote');
  const cat = Math.max(1, summary.category || gameState.lastHurricaneCategory || 1);
  const costE = getRepairCostElectric(cat); const costC = getRepairCostCooling(cat);
  title.textContent = `Repair Window (${gameState.repairWeeksLeft}w left) — Hurricane Cat ${cat}`;
  const electricLine = gameState.hp.electrical < 100 ? `<li><strong>Electric HP:</strong> ${Math.round(gameState.hp.electrical)}/100 - repair cost ${costE} elixir</li>` : `<li><strong>Electric HP:</strong> OK</li>`;
  const coolingLine = gameState.hp.cooling < 100 ? `<li><strong>Cooling HP:</strong> ${Math.round(gameState.hp.cooling)}/100 - repair cost ${costC} elixir</li>` : `<li><strong>Cooling HP:</strong> OK</li>`;
  body.innerHTML = `<div><strong>Storm Summary</strong></div>
    <div style="margin:6px 0 10px 0;">
      <div>Category: ${cat}</div>
      <div>Outage occurred: ${summary.outage ? 'Yes' : 'No'}</div>
      <div>Generator used: ${summary.generatorUsed ? 'Yes' : 'No'}</div>
      <div>Generator failed: ${summary.generatorFailed ? 'Yes' : 'No'}</div>
      <div>Peak water: ${summary.peakWaterFt.toFixed(1)} ft</div>
    </div>
    <div><strong>Systems</strong></div>
    <ul style="margin-left:18px;">
      ${electricLine}
      ${coolingLine}
    </ul>`;
  foot.textContent = `Repair costs scale with hurricane category.`;

  // bind buttons deterministically
  const btnE = document.getElementById('repairElectricBtn');
  const btnC = document.getElementById('repairCoolingBtn');
  const cont = document.getElementById('continueBtn');

  if(btnE){ btnE.disabled = gameState.hp.electrical >= 100 || gameState.elixir < costE; btnE.onclick = repairElectric; btnE.removeEventListener('click', repairElectric); btnE.addEventListener('click', repairElectric); }
  if(btnC){ btnC.disabled = gameState.hp.cooling >= 100 || gameState.elixir < costC; btnC.onclick = repairCooling; btnC.removeEventListener('click', repairCooling); btnC.addEventListener('click', repairCooling); }
  if(cont){ cont.disabled = false; cont.style.pointerEvents = 'auto'; cont.onclick = continueRepairWindow; cont.removeEventListener('click', continueRepairWindow); cont.addEventListener('click', continueRepairWindow); cont.focus({preventScroll:false}); cont.scrollIntoView({behavior:'smooth', block:'center'}); }
}

function closeRepairModalIfOpen(){
  const modal = document.getElementById('repairModal'); if(!modal) return;
  try{ const active = document.activeElement; if(active && modal.contains(active)) active.blur(); } catch(e){}
  modal.classList.remove('active'); modal.setAttribute('aria-hidden','true'); gameState.inRepairWindow = false;
}

// debounce guard
let __lastContinueCallTs = 0;
const __CONTINUE_DEBOUNCE_MS = 250;

function continueRepairWindow(){
  const now = Date.now();
  if(now - __lastContinueCallTs < __CONTINUE_DEBOUNCE_MS){
    console.log('continueRepairWindow() ignored (debounce)');
    return;
  }
  __lastContinueCallTs = now;

  console.log('continueRepairWindow() called — inRepairWindow:', gameState.inRepairWindow, 'repairWeeksLeft:', gameState.repairWeeksLeft);
  if(!gameState.inRepairWindow){
    closeRepairModalIfOpen();
    return;
  }

  // decrement
  gameState.repairWeeksLeft = Math.max(0, (gameState.repairWeeksLeft || 0) - 1);
  console.log('continueRepairWindow() after decrement — repairWeeksLeft:', gameState.repairWeeksLeft);

  if(gameState.repairWeeksLeft <= 0){
    // blur active inside modal to avoid aria-hidden focus warning
    const modal = document.getElementById('repairModal');
    if(modal){
      try{ const active = document.activeElement; if(active && modal.contains(active)) active.blur(); } catch(e){}
    }

    gameState.inRepairWindow = false;
    closeRepairModalIfOpen();

    if(gameState.hp.electrical <= 0 || gameState.hp.cooling <= 0 || bedroomOrBathroomDead()){
      endGame('GAME OVER: Critical systems were not repaired in time.');
      return;
    }

    updateAllUI();
    return;
  }

  // refresh modal UI with remaining weeks
  openRepairModal(gameState.lastHurricaneSummary);
  updateAllUI();
}

// -------------------------
// Damage model (late-game harder)
function applyHurricaneDamage(category){
  const yearsFactor = 1 + progressionFactor() * 1.6;
  const totalWater = getTotalWaterFt(); const threshold = getSecondFloorFloodThresholdFt();
  const floodScalar = clamp(totalWater / Math.max(1, threshold),0,3);
  const baseWind = 6 * category; const baseFlood = 8 * category;
  const roofReduction = gameState.hasAerodynamicRoof ? 0.5 : 0;
  const elevationReduction = clamp(gameState.elevation * 0.08, 0, 0.6);
  const bedBathWind = baseWind * (1 - roofReduction);
  const bedBathFlood = baseFlood * floodScalar * (1 - elevationReduction);
  const extraDepthFactor = 1 + Math.max(0, (totalWater - threshold)/2) * 0.25;
  const bedroomDamage = (bedBathWind + bedBathFlood) * extraDepthFactor * yearsFactor;
  const bathroomDamage = (bedBathWind * 0.9 + bedBathFlood * 0.95) * extraDepthFactor * yearsFactor;
  const safeRoomDamage = (bedroomDamage * 0.4) * (1 + progressionFactor() * 0.4);
  let electricDamage = (baseWind * 0.6 + baseFlood * 0.4 * floodScalar) * yearsFactor;
  if(gameState.hasGenerator) electricDamage *= 0.5;
  let coolingDamage = (baseWind * 0.4 + baseFlood * 0.6 * floodScalar) * yearsFactor;
  if(gameState.hasGenerator) coolingDamage *= 0.6;
  if(gameState.hasSafeRoom){ gameState.hp.safeRoom = clamp(gameState.hp.safeRoom - safeRoomDamage,0,200); }
  else { gameState.hp.bedroom = clamp(gameState.hp.bedroom - bedroomDamage,0,100); gameState.hp.bathroom = clamp(gameState.hp.bathroom - bathroomDamage,0,100); }
  gameState.hp.electrical = clamp(gameState.hp.electrical - electricDamage,0,100);
  gameState.hp.cooling = clamp(gameState.hp.cooling - coolingDamage,0,100);
  return { bedroomDamage, bathroomDamage, safeRoomDamage, electricDamage, coolingDamage, totalWater };
}

// -------------------------
// Week tick
// -------------------------
function tickOneWeek(){
  if(gameState.inRepairWindow) return {};
  gameState.daysElapsed += 7;
  const years = Math.floor(gameState.daysElapsed/365);
  gameState.year = 2025 + years;
  gameState.week = Math.floor((gameState.daysElapsed % 365)/7);
  const newGraceMax = computeCoolingGraceMaxWeeksForYear(gameState.year);
  if(gameState.coolingGraceWeeksLeft > newGraceMax) gameState.coolingGraceWeeksLeft = newGraceMax;
  tickConstruction();
  gameState.isHurricane = isHurricaneWeek(gameState.year, gameState.week);
  gameState.hurricaneCategory = gameState.isHurricane ? getHurricaneCategory(gameState.year, gameState.week) : 0;
  if(gameState.isHurricane) gameState.lastHurricaneCategory = gameState.hurricaneCategory;
  const hurricaneEndedThisWeek = gameState.wasHurricaneLastWeek && !gameState.isHurricane;
  gameState.wasHurricaneLastWeek = gameState.isHurricane;
  const header = document.getElementById('header'); const status = document.getElementById('status');
  if(gameState.isHurricane){ if(status) status.textContent = `🌀 HURRICANE (Cat ${gameState.hurricaneCategory})`; if(header) header.classList.add('hurricane-day'); const cat = gameState.hurricaneCategory; gameState.waterHeight += (1.5 + Math.random()*2.5) * (0.6 + cat/3.5); }
  else { if(status) status.textContent = '☀️ Normal'; if(header) header.classList.remove('hurricane-day'); gameState.waterHeight = Math.max(0, gameState.waterHeight - 0.35); }
  if(!gameState.isHurricane){ if(gameState.elixir < gameState.maxElixir) gameState.elixir = Math.min(gameState.maxElixir, gameState.elixir + 0.25); }
  if(gameState.daysElapsed % 56 === 0) updateNews();

  let outageThisWeek=false, generatorNeeded=false, generatorWorked=true, damageSummary=null;
  if(gameState.isHurricane){
    damageSummary = applyHurricaneDamage(gameState.hurricaneCategory);
    outageThisWeek = Math.random() < powerOutageChanceDuringHurricane;
    if(outageThisWeek){
      generatorNeeded = true;
      if(!gameState.hasGenerator){
        const outE = 18 * gameState.hurricaneCategory * (1 + progressionFactor()*0.6);
        gameState.hp.electrical = clamp(gameState.hp.electrical - outE,0,100);
        const outC = 10 * gameState.hurricaneCategory * (1 + progressionFactor()*0.5);
        gameState.hp.cooling = clamp(gameState.hp.cooling - outC,0,100);
        generatorWorked = false;
      } else {
        const cat = gameState.hurricaneCategory;
        const failChance = generatorFailByCategory[cat] ?? 0.35;
        generatorWorked = Math.random() >= failChance;
        if(!generatorWorked){
          const outE = 12 * gameState.hurricaneCategory * (1 + progressionFactor()*0.4);
          gameState.hp.electrical = clamp(gameState.hp.electrical - outE,0,100);
          const outC = 8 * gameState.hurricaneCategory * (1 + progressionFactor()*0.4);
          gameState.hp.cooling = clamp(gameState.hp.cooling - outC,0,100);
        }
      }
    }
  } else {
    const totalWater = getTotalWaterFt();
    if(totalWater > 2){
      const seep = Math.max(0, (totalWater - 2) * 0.4);
      if(!gameState.hasSafeRoom){ gameState.hp.bedroom = clamp(gameState.hp.bedroom - seep*0.12,0,100); gameState.hp.bathroom = clamp(gameState.hp.bathroom - seep*0.1,0,100); }
      else gameState.hp.safeRoom = clamp(gameState.hp.safeRoom - seep*0.06,0,200);
    }
  }

  // cooling grace only decrements on non-hurricane weeks
  if(gameState.hp.cooling < 100){
    if(!gameState.isHurricane && !gameState.inRepairWindow){
      gameState.coolingGraceWeeksLeft -= 1;
      if(gameState.coolingGraceWeeksLeft <= 0){ endGame('GAME OVER: Cooling was down too long; heat lethal.'); return {outageThisWeek,generatorNeeded,generatorWorked,damageSummary}; }
    }
  } else {
    gameState.coolingGraceWeeksLeft = computeCoolingGraceMaxWeeksForYear(gameState.year);
  }

  // open repair window when hurricane ends and any critical system damaged
  if(hurricaneEndedThisWeek){
    const needRepair = gameState.hp.electrical < 100 || gameState.hp.cooling < 100 || (!gameState.hasSafeRoom && (gameState.hp.bedroom < 100 || gameState.hp.bathroom < 100)) || (gameState.hasSafeRoom && gameState.hp.safeRoom < 200);
    if(needRepair){
      gameState.inRepairWindow = true;
      gameState.repairWeeksLeft = gameState.repairWeeksMax;
      gameState.lastHurricaneCategory = gameState.lastHurricaneCategory || gameState.hurricaneCategory || 1;
      const summary = { category: gameState.lastHurricaneCategory, outage: outageThisWeek, generatorUsed: outageThisWeek && gameState.hasGenerator, generatorFailed: outageThisWeek && !generatorWorked, peakWaterFt: getTotalWaterFt() };
      gameState.lastHurricaneSummary = summary;
      openRepairModal(summary);
      return {outageThisWeek,generatorNeeded,generatorWorked,damageSummary};
    }
  }

  // fatal checks
  if(gameState.hasSafeRoom){ if(gameState.hp.safeRoom <= 0){ endGame('GAME OVER: Hurricane Room destroyed.'); return {outageThisWeek,generatorNeeded,generatorWorked,damageSummary}; } }
  else { if(gameState.hp.bedroom <= 0 || gameState.hp.bathroom <= 0){ endGame('GAME OVER: Bedroom/Bathroom destroyed.'); return {outageThisWeek,generatorNeeded,generatorWorked,damageSummary}; } }
  if(gameState.hp.electrical <= 0){ endGame('GAME OVER: Electrical systems destroyed.'); return {outageThisWeek,generatorNeeded,generatorWorked,damageSummary}; }
  if(gameState.hp.cooling <= 0){ endGame('GAME OVER: Cooling destroyed (heat lethal).'); return {outageThisWeek,generatorNeeded,generatorWorked,damageSummary}; }
  if(gameState.daysElapsed >= gameState.totalDays){ endGame('VICTORY: You survived to 2100!'); return {outageThisWeek,generatorNeeded,generatorWorked,damageSummary}; }
  return {outageThisWeek,generatorNeeded,generatorWorked,damageSummary};
}

// -------------------------
// Rendering & UI
// -------------------------
function renderCards(){
  const grid = document.getElementById('cardsGrid'); if(!grid) return; grid.innerHTML='';
  for(const card of cards){
    let canAfford = gameState.elixir >= card.cost;
    if(card.id==='room' && gameState.safeRoomBuiltOrQueued) canAfford=false;
    if(card.id==='gen'){ const queued = gameState.construction.some(j=>j.kind==='gen'); if(gameState.hasGenerator || queued) canAfford=false; }
    if(card.id==='aero'){ const queued = gameState.construction.some(j=>j.kind==='aero'); if(gameState.hasAerodynamicRoof || queued) canAfford=false; }
    const div = document.createElement('div'); div.className = `card ${canAfford ? '' : 'unavailable'}`.trim(); div.draggable = canAfford && !gameState.inRepairWindow; div.dataset.cardId = card.id;
    let costText = `${card.cost} 💰`; if(card.costPerUnit) costText = `${card.cost}/ft 💰`; let downtimeText = card.downtimeWeeksPerFoot ? `Downtime: ${card.downtimeWeeksPerFoot}w/ft` : `Downtime: ${card.downtimeWeeks ?? 0}w`;
    if(card.id==='room' && gameState.safeRoomBuiltOrQueued) downtimeText = `Unique (built/queued)`;
    div.innerHTML = `<div class="card-icon">${card.icon}</div><div class="card-name">${card.name}</div><div class="card-cost">${costText}</div><div class="card-stats">${downtimeText}</div>`;
    if(canAfford && !gameState.inRepairWindow){ div.addEventListener('dragstart', e=>{ div.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain', card.id); }); div.addEventListener('dragend', ()=>div.classList.remove('dragging')); }
    grid.appendChild(div);
  }
}

function renderDefenses(){ const list = document.getElementById('defensesList'); if(!list) return; list.innerHTML=''; if(!gameState.defenses.length && !gameState.construction.length){ list.innerHTML = `<div class="defense-item">No defenses deployed</div>`; return; } for(const d of gameState.defenses) list.innerHTML += `<div class="defense-item">${d}</div>`; for(const c of gameState.construction) list.innerHTML += `<div class="defense-item">⏳ ${c.label} (${c.weeksLeft}w left)</div>`; }

function renderForecast(){ const forecast = document.getElementById('forecast'); if(!forecast) return; forecast.innerHTML=''; for(let i=0;i<10;i++){ const futureWeek = gameState.week + i; const isH = isHurricaneWeek(gameState.year, futureWeek); let label = isH ? `🌀` : `☀️`; if(isH){ const cat = getHurricaneCategory(gameState.year, futureWeek); label = `🌀<br/>C${cat}`; } forecast.innerHTML += `<div class="forecast-item ${isH ? 'hurricane' : ''}">${label}<br/>W${i+1}</div>`; } }

function setRoomBadgesAndColors(extra={}){ const safeBadge = document.getElementById('safeRoomBadge'); if(safeBadge) safeBadge.style.display = gameState.hasSafeRoom ? 'block' : 'none'; const constructionBadge = document.getElementById('constructionBadge'); if(constructionBadge) constructionBadge.style.display = gameState.construction.length ? 'block' : 'none'; const totalWater = getTotalWaterFt(); const threshold = getSecondFloorFloodThresholdFt(); const flooded2nd = totalWater >= threshold; const elBedroom = document.getElementById('roomBedroom'); const elBathroom = document.getElementById('roomBathroom'); const elElectric = document.getElementById('roomElectric'); const elCooling = document.getElementById('roomCooling'); for(const el of [elBedroom,elBathroom,elElectric,elCooling]) if(el) el.classList.remove('failed','protected'); if(gameState.hasSafeRoom){ if(elBedroom) elBedroom.classList.add('protected'); if(elBathroom) elBathroom.classList.add('protected'); } if(flooded2nd){ if(!gameState.hasSafeRoom){ if(elBedroom) elBedroom.classList.add('failed'); if(elBathroom) elBathroom.classList.add('failed'); } if(elElectric) elElectric.classList.add('failed'); if(elCooling) elCooling.classList.add('failed'); } if(extra.outageThisWeek && extra.generatorNeeded && extra.generatorWorked){ if(elElectric) elElectric.classList.add('protected'); } }

function renderSystemsStatus(extra={}) {
  const systems = document.getElementById('systems'); if(!systems) return;
  const totalWater = getTotalWaterFt(); const threshold = getSecondFloorFloodThresholdFt(); const flooded2nd = totalWater >= threshold;
  const graceMax = computeCoolingGraceMaxWeeksForYear(gameState.year);
  const lines = [];
  lines.push(`<div class="system-item">2nd floor threshold: ${threshold.toFixed(1)} ft (10 + elevation)</div>`);
  lines.push(`<div class="system-item ${flooded2nd ? 'critical' : ''}">Flood status: ${flooded2nd ? '2ND FLOOR FLOODED' : 'OK'}</div>`);
  lines.push(`<div class="system-item">🌡️ Cooling grace (this era): ${graceMax} weeks</div>`);
  if(gameState.hasSafeRoom) lines.push(`<div class="system-item">🛡️ Hurricane Room HP: ${Math.round(gameState.hp.safeRoom)}/200</div>`);
  else { lines.push(`<div class="system-item">🛏️ Bedroom HP: ${Math.round(gameState.hp.bedroom)}/100</div>`); lines.push(`<div class="system-item">🚿 Bathroom HP: ${Math.round(gameState.hp.bathroom)}/100</div>`); }
  lines.push(gameState.hp.electrical < 100 ? `<div class="system-item critical">⚡ Electric HP: ${Math.round(gameState.hp.electrical)}/100</div>` : `<div class="system-item">⚡ Electric HP: ${Math.round(gameState.hp.electrical)}/100</div>`);
  lines.push(gameState.hp.cooling < 100 ? `<div class="system-item critical">❄️ Cooling HP: ${Math.round(gameState.hp.cooling)}/100</div>` : `<div class="system-item">❄️ Cooling HP: ${Math.round(gameState.hp.cooling)}/100</div>`);
  if(!gameState.isHurricane && !gameState.inRepairWindow){
    if(gameState.hp.electrical < 100){ const costE = getRepairCostElectric(Math.max(1, gameState.lastHurricaneCategory||1)); lines.push(`<div class="system-item">Repair Electric now — Cost: ${costE} 💰 <button id="sysRepairElectric" class="btn">Repair</button></div>`); }
    if(gameState.hp.cooling < 100){ const costC = getRepairCostCooling(Math.max(1, gameState.lastHurricaneCategory||1)); lines.push(`<div class="system-item">Repair Cooling now — Cost: ${costC} 💰 <button id="sysRepairCooling" class="btn">Repair</button></div>`); }
  }
  if(extra.outageThisWeek){ const msg = extra.generatorWorked ? 'Generator succeeded' : 'Generator failed / not present'; lines.push(`<div class="system-item ${extra.generatorWorked ? '' : 'critical'}">⚡ Outage this week: ${msg}</div>`); }
  else if(gameState.isHurricane) lines.push(`<div class="system-item">⚡ Outage chance this hurricane week: ${(powerOutageChanceDuringHurricane*100).toFixed(0)}%</div>`);
  systems.innerHTML = lines.join('');
  const sysBtnE = document.getElementById('sysRepairElectric'); if(sysBtnE){ sysBtnE.onclick = repairElectricImmediate; sysBtnE.removeEventListener('click', repairElectricImmediate); sysBtnE.addEventListener('click', repairElectricImmediate); }
  const sysBtnC = document.getElementById('sysRepairCooling'); if(sysBtnC){ sysBtnC.onclick = repairCoolingImmediate; sysBtnC.removeEventListener('click', repairCoolingImmediate); sysBtnC.addEventListener('click', repairCoolingImmediate); }
}

function renderMeters(){ const el = document.getElementById('elixir'), fill=document.getElementById('fill'); if(el) el.textContent = gameState.elixir.toFixed(1); if(fill) fill.style.width = `${(gameState.elixir / gameState.maxElixir)*100}%`; const sea = document.getElementById('seaLevel'); if(sea) sea.textContent = getSeaLevelFt(gameState.year).toFixed(1); const elev = document.getElementById('elevation'); if(elev) elev.textContent = `${gameState.elevation}`; const d=document.getElementById('dikes'); if(d) d.textContent = `${gameState.dikeHeight}`; const c=document.getElementById('cat'); if(c) c.textContent = `${gameState.hurricaneCategory}`; const totalWater=getTotalWaterFt(); const pct = clamp((totalWater / gameState.maxWaterHeight)*100,0,100); const waterEl=document.getElementById('water'); if(waterEl) waterEl.style.height = `${pct}%`; const wl=document.getElementById('waterLabel'); if(wl) wl.textContent = `Water: ${totalWater.toFixed(1)} ft`; const th=document.getElementById('thresholdLabel'); if(th) th.textContent = `2nd floor flood threshold: ${getSecondFloorFloodThresholdFt().toFixed(1)} ft`; if(gameState.hasSafeRoom){ const hpSR=document.getElementById('hpSafeRoomVal'); if(hpSR) hpSR.textContent = Math.max(0, Math.round(gameState.hp.safeRoom)); const hpB=document.getElementById('hpBedroomVal'), hpBa=document.getElementById('hpBathroomVal'); if(hpB) hpB.textContent='-'; if(hpBa) hpBa.textContent='-'; } else { const hpB=document.getElementById('hpBedroomVal'), hpBa=document.getElementById('hpBathroomVal'); if(hpB) hpB.textContent=Math.max(0, Math.round(gameState.hp.bedroom)); if(hpBa) hpBa.textContent=Math.max(0, Math.round(gameState.hp.bathroom)); const hpSR=document.getElementById('hpSafeRoomVal'); if(hpSR) hpSR.textContent = gameState.hp.safeRoom ? Math.round(gameState.hp.safeRoom) : 0; } const hpE=document.getElementById('hpElectricVal'), hpC=document.getElementById('hpCoolingVal'); if(hpE) hpE.textContent = Math.max(0, Math.round(gameState.hp.electrical)); if(hpC) hpC.textContent = Math.max(0, Math.round(gameState.hp.cooling)); }

function renderFloodedFloors(){ const totalWater=getTotalWaterFt(); const threshold=getSecondFloorFloodThresholdFt(); const lower=document.getElementById('floorL'); const floor2=document.getElementById('floor2'); if(lower){ if(totalWater>0.1) lower.classList.add('flooded'); else lower.classList.remove('flooded'); } if(floor2){ if(totalWater>=threshold) floor2.classList.add('flooded'); else floor2.classList.remove('flooded'); } }

// -------------------------
// Controls & loop
// -------------------------
function updateAllUI(extra={}){ const y=document.getElementById('year'), w=document.getElementById('week'); if(y) y.textContent = `${gameState.year}`; if(w) w.textContent = `${gameState.week+1}`; renderCards(); renderDefenses(); renderForecast(); renderFloodedFloors(); renderMeters(); setRoomBadgesAndColors(extra); renderSystemsStatus(extra); }

function playCard(cardId){
  if(!gameState.gameRunning || gameState.gameOver) return;
  if(gameState.inRepairWindow){ alert('Cannot deploy defenses during repair window.'); return; }
  const card = cards.find(c=>c.id===cardId); if(!card) return;
  if(card.id==='room' && gameState.safeRoomBuiltOrQueued){ alert('Hurricane Room already built/queued.'); return; }
  if(card.id==='gen'){ const queued = gameState.construction.some(j=>j.kind==='gen'); if(gameState.hasGenerator || queued){ alert('Generator active/queued'); return; } }
  if(card.id==='aero'){ const queued = gameState.construction.some(j=>j.kind==='aero'); if(gameState.hasAerodynamicRoof || queued){ alert('Aerodynamic roof active/queued'); return; } }
  let amount=1, cost=card.cost;
  if(card.costPerUnit){ const inp = prompt(`How many feet? (1-${card.max})`,'1'); if(inp===null) return; const n=Number(inp); if(!Number.isFinite(n)||n<1||n>card.max) return; amount=Math.floor(n); cost = amount * card.cost; }
  if(gameState.elixir < cost){ alert('Not enough elixir'); return; }
  gameState.elixir -= cost;
  if(card.id==='dikes'){ const before=gameState.dikeHeight; gameState.dikeHeight = clamp(gameState.dikeHeight + amount,0,10); const added = gameState.dikeHeight - before; gameState.defenses.push(`🛡️ Dikes +${added} ft (total ${gameState.dikeHeight})`); }
  else if(card.id==='elevate'){ const feet=amount; const weeks=feet * (card.downtimeWeeksPerFoot ?? 3); addConstruction({kind:'elevate', weeksLeft:weeks, payload:{feet}, label:`Elevate +${feet} ft`}); gameState.defenses.push(`⬆️ Elevation started +${feet} ft`); }
  else if(card.id==='gen'){ addConstruction({kind:'gen', weeksLeft:card.downtimeWeeks ?? 2, payload:{}, label:'Install Generator'}); gameState.defenses.push('⚙️ Generator installation started'); }
  else if(card.id==='aero'){ addConstruction({kind:'aero', weeksLeft:card.downtimeWeeks ?? 2, payload:{}, label:'Install Aerodynamic Roof'}); gameState.defenses.push('🏠 Aerodynamic roof installation started'); }
  else if(card.id==='room'){ gameState.safeRoomBuiltOrQueued = true; addConstruction({kind:'room', weeksLeft:card.downtimeWeeks ?? 6, payload:{}, label:'Build Hurricane Room'}); gameState.defenses.push('🛡️ Hurricane Room construction started'); }
  updateAllUI();
}

function gameLoop(){ if(!gameState.gameRunning || gameState.gameOver) return; const extra = tickOneWeek(); updateAllUI(extra); const delay = gameState.isHurricane ? 2000 : 1000; setTimeout(gameLoop, delay); }

// -------------------------
// Events & startup
// -------------------------
document.addEventListener('dragover', e=>{ e.preventDefault(); e.dataTransfer.dropEffect='move'; });
document.addEventListener('drop', e=>{ e.preventDefault(); const cardId = e.dataTransfer.getData('text/plain'); playCard(cardId); });

window.addEventListener('load', ()=>{
  // wire modal buttons safely (functions are declared above)
  const btnE = document.getElementById('repairElectricBtn'), btnC = document.getElementById('repairCoolingBtn'), cont = document.getElementById('continueBtn');
  if(btnE){ btnE.onclick = repairElectric; btnE.removeEventListener('click', repairElectric); btnE.addEventListener('click', repairElectric); }
  if(btnC){ btnC.onclick = repairCooling; btnC.removeEventListener('click', repairCooling); btnC.addEventListener('click', repairCooling); }
  if(cont){ cont.onclick = continueRepairWindow; cont.removeEventListener('click', continueRepairWindow); cont.addEventListener('click', continueRepairWindow); }
  const modal = document.getElementById('repairModal'); if(modal && modal.parentNode !== document.body) document.body.appendChild(modal);

  // debugging exposure
  window.gameState = gameState; window.playCard = playCard; window.renderCards = renderCards; window.updateAllUI = updateAllUI; window.gameLoop = gameLoop; window.endGame = endGame;

  updateNews(); updateAllUI(); gameLoop();
});
