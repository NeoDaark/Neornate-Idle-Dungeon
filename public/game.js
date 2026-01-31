/* ===================== CONFIG ===================== */
const STATS = ["Fuerza","Destreza","Constitución","Inteligencia","Sabiduría","Carisma"];
const STAT_SHORT = ["FUE", "DES", "CON", "INT", "SAB", "CAR"];
const SLOTS = ["arma","armadura","offhand","anillo1","anillo2","amuleto"];
const RARITIES = [
    {name:"Común", chance:70, mult:1},
    {name:"Raro", chance:20, mult:1.5},
    {name:"Épico", chance:8, mult:2},
    {name:"Legendario", chance:2, mult:3}
];
const PREFIX = ["Oxidado","Antiguo","Bendito","Maldito"];
const SUFFIX = ["del Titán","del Sabio","del Ladrón","del Vacío"];
let EXPLORE_INTERVAL = 30;

// Nombres temáticos para mazmorras
const DUNGEON_NAMES = [
    "Catacumbas Olvidadas","Fortaleza de Hielo","Templo de las Sombras","Mina Abandonada",
    "Torre Maldita","Cavernas Cristalinas","Refugio de Titanes","Dimensión Rota",
    "Ruinas Ancestrales","Prisión Eterna","Bosque Prohibido","Castillo Sumergido",
    "Volcán Dormido","Biblioteca Perdida","Puerta del Caos","Santuario Oscuro"
];

function generateDungeonName(dungeonNum) {
    const name = DUNGEON_NAMES[(dungeonNum - 1) % DUNGEON_NAMES.length];
    return `Mazmorra ${dungeonNum} - ${name}`; 
}

/* ===================== PLAYER ===================== */
let player = JSON.parse(localStorage.getItem("player"));

// Migración de datos antiguos
if(player) {
    if(!player.completedDungeons) {
        player.completedDungeons = 0;
    }
}

let countdown = EXPLORE_INTERVAL;
let exploring = true;
let currentEquipTab = "arma"; // Tab activa de equipo
let currentDungeonLog = []; // Registro de la mazmorra actual
let dungeonNames = JSON.parse(localStorage.getItem("dungeonNames")) || {}; // Cache de nombres de mazmorras
let gameInterval = null; // Intervalo del juego
let lastTickTime = Date.now(); // Detectar bloqueos

function save() { 
    if(!player) return;
    player.lastTick = Date.now();
    localStorage.setItem("player", JSON.stringify(player));
    // Guardar el registro actual de la mazmorra
    if(currentDungeonLog && currentDungeonLog.length > 0) {
        const dungeonLogKey = `dungeonLog_${player.dungeon}`;
        localStorage.setItem(dungeonLogKey, JSON.stringify(currentDungeonLog));
    }
}

function log(msg, cls="event") {
    const logEntry = {msg, cls, time: Date.now()};
    currentDungeonLog.push(logEntry);
    renderLog();
}

function renderLog() {
    const l = document.getElementById("log");
    l.innerHTML = currentDungeonLog.map(entry => `<div class="${entry.cls}">${entry.msg}</div>`).join("");
    l.scrollTop = l.scrollHeight;
}

function render() {
    if(!player) return;
    document.getElementById("pName").textContent = player.name;
    document.getElementById("hp").textContent = player.hp;
    document.getElementById("maxHp").textContent = maxHp();
    document.getElementById("lvl").textContent = player.level;
    document.getElementById("xp").textContent = player.xp;
    document.getElementById("dungeon").textContent = player.dungeon;
    document.getElementById("floor").textContent = player.floor;
    document.getElementById("encounter").textContent = player.encounter;
    document.getElementById("materials").textContent = player.materials;
    document.getElementById("timer").textContent = countdown;

    document.getElementById("stats").innerHTML =
        `<div style="font-family: monospace; font-size:13px;">` +
        STATS.map((s, idx)=>{
            const breakdown = getStatBreakdown(s);
            const short = STAT_SHORT[idx];
            const baseHTML = breakdown.bonus > 0 ? `<span class="stat-base">${String(breakdown.base).padStart(2)}</span>` : `<span class="stat-base">${String(breakdown.total).padStart(2)}</span>`;
            const bonusHTML = breakdown.bonus > 0 ? `<span style="color:#55ff55;">+${String(breakdown.bonus).padStart(2)}</span>` : '';
            const equalHTML = breakdown.bonus > 0 ? `<span style="color:#aaa;">=</span>` : '';
            const totalHTML = breakdown.bonus > 0 ? `<b style="color:#55aaff;">${String(breakdown.total).padStart(2)}</b>` : '';
            return `<div style="display:flex; gap:5px; align-items:center; margin-bottom:2px;">
                <span style="width:30px;">${short}</span>
                <span style="width:20px; text-align:right;">${baseHTML}</span>
                <span style="width:30px; text-align:right;">${bonusHTML}</span>
                <span style="width:10px; text-align:center;">${equalHTML}</span>
                <span style="width:20px; text-align:right;">${totalHTML}</span>
            </div>`;
        }).join("") +
        `</div>`;

    // Tabs de equipo por tipo
    let tabsHTML = SLOTS.map(slot => 
        `<button class="equipTab ${currentEquipTab === slot ? 'active' : ''}" 
                 onclick="switchEquipTab('${slot}')">${slot}</button>`
    ).join("");
    document.getElementById("equipTabs").innerHTML = tabsHTML;

    // Mostrar item equipado al inicio de la lista, luego el inventario filtrado
    let equippedHTML = "";
    const equipped = player.equipment[currentEquipTab];
    if(equipped) {
        let btnMejorar = "";
        if(player.materials >= 4) btnMejorar = ` <button onclick="upgradeEquipped('${currentEquipTab}')">Mejorar +1</button>`;
        equippedHTML = `<div class="item equipped-in-tab" style="background:#1a1a1a; font-weight:bold; border:1px solid #ffa500; padding:5px; margin-bottom:8px; border-radius:3px;">
            ⭐ ${equipped.name} (+${equipped.upgrade})
            <button onclick="toggleEquip(${player.inventory.indexOf(equipped)})">Desequipar</button>
            <button onclick="showItemInfo(player.equipment['${currentEquipTab}'])">Info</button>
            ${btnMejorar}
        </div>`;
    }

    // Inventario filtrado por tab activo con comparar
    const itemsBySlot = player.inventory.filter(i => i.slot === currentEquipTab);
    const unequippedItems = itemsBySlot.filter(i => player.equipment[i.slot]?.id !== i.id);
    
    let unequippedHTML = unequippedItems.map((i,idx)=>{
        const actualIdx = player.inventory.indexOf(i);
        const equipped = player.equipment[i.slot];
        let comparison = "";
        if(equipped) {
            comparison = ` <button onclick="compareItems(${actualIdx})">Comparar</button>`;
        }
        return `
        <div class="item">
        ${i.name} (+${i.upgrade})
        <button onclick="toggleEquip(${actualIdx})">Equipar</button>
        <button onclick="showItemInfo(player.inventory[${actualIdx}])">Info</button>
        <button onclick="dismantle(${actualIdx})">Desmantelar</button>
        ${comparison}
        </div>`
    }).join("");
    
    document.getElementById("inventoryBySlot").innerHTML = equippedHTML + unequippedHTML;
}

/* ===================== UTILS ===================== */
function random(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function maxHp() { return 20 + statTotal("Constitución")*2; }
function statTotal(stat) {
    let total = player.stats[stat];
    for(let s of SLOTS) {
        if(player.equipment[s]) total += player.equipment[s].stats[stat] || 0;
    }
    return total;
}

function getStatBreakdown(stat) {
    let base = player.stats[stat];
    let bonus = 0;
    for(let s of SLOTS) {
        if(player.equipment[s]) {
            bonus += (player.equipment[s].stats[stat] || 0) + player.equipment[s].upgrade;
        }
    }
    return {base, bonus, total: base + bonus};
}

/* ===================== PLAYER CREATION ===================== */
function createPlayer() {
    const name = document.getElementById("nameInput").value;
    if(!name) return;
    
    // Generar nombre para la primera mazmorra
    const firstDungeonName = generateDungeonName(1);
    dungeonNames["1"] = firstDungeonName;
    localStorage.setItem("dungeonNames", JSON.stringify(dungeonNames));
    
    player = {
        name,
        level:1,
        xp:0,
        dungeon:1,
        floor:1,
        encounter:1,
        encountersMax:random(3,8),
        hp:20,
        materials:0,
        stats:Object.fromEntries(STATS.map(s=>[s,5])),
        equipment:Object.fromEntries(SLOTS.map(s=>[s,null])),
        inventory:[],
        completedDungeons: 0, // Mazmorras completadas
        lastTick: Date.now()
    };
    
    currentDungeonLog = [];
    log(`🎮 Bienvenido ${name}`, "event");
    log(`📍 ${firstDungeonName}`, "rare");
    log(`⚔️ Comienza tu aventura...`, "event");
    
    countdown = EXPLORE_INTERVAL;
    exploring = true;
    save();
    start();
}

/* ===================== START ===================== */
function start() {
    document.getElementById("create").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    document.getElementById("revivePanel").classList.add("hidden");
    
    // Detener cualquier intervalo anterior
    if(gameInterval) clearInterval(gameInterval);
    
    // Limpiar todos los logs de mazmorras guardados
    const keysToDelete = [];
    for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if(key && key.startsWith("dungeonLog_")) {
            keysToDelete.push(key);
        }
    }
    keysToDelete.forEach(key => localStorage.removeItem(key));
    
    // Inicializar el registro de la mazmorra actual como vacío
    currentDungeonLog = [];
    const dungeonName = dungeonNames[player.dungeon] || generateDungeonName(player.dungeon);
    dungeonNames[player.dungeon] = dungeonName;
    localStorage.setItem("dungeonNames", JSON.stringify(dungeonNames));
    log(dungeonName, "rare");

    if(player.lastTick){
        const elapsed = Math.floor((Date.now() - player.lastTick)/1000);
        processTime(elapsed);
    }

    render();
    gameInterval = setInterval(tick, 1000);
}

/* ===================== PROCESS ELAPSED TIME ===================== */
function processTime(seconds){
    while(seconds > 0 && player.hp > 0){
        let step = Math.min(countdown, seconds);
        countdown -= step;
        seconds -= step;
        if(countdown <= 0){
            explore();
            countdown = EXPLORE_INTERVAL;
        }
    }
    if(player.hp <= 0){
        exploring = false;
        document.getElementById("revivePanel").classList.remove("hidden");
        countdown = EXPLORE_INTERVAL;
    }
}

/* ===================== EXPLORATION ===================== */
function tick() {
    if(!player || player.hp <=0 || !exploring) return;
    countdown--;
    document.getElementById("timer").textContent = countdown;
    if(countdown <= 0) {
        explore();
        countdown = EXPLORE_INTERVAL;
    }
    save();
}

function explore() {
    if(player.encounter > player.encountersMax) {
        player.floor++;
        player.encounter = 1;
        player.encountersMax = random(3,8);
        log(`⬇️ Avanzas al piso ${player.floor}`, "event");
        if(player.floor > player.dungeon*5) {
            // Guardar registro de la mazmorra anterior
            const prevDungeonLogKey = `dungeonLog_${player.dungeon}`;
            localStorage.setItem(prevDungeonLogKey, JSON.stringify(currentDungeonLog));
            
            player.completedDungeons = player.dungeon;
            player.dungeon++;
            player.floor = 1;
            
            // Inicializar nuevo registro para la nueva mazmorra
            currentDungeonLog = [];
            const newDungeonName = generateDungeonName(player.dungeon);
            dungeonNames[player.dungeon] = newDungeonName;
            localStorage.setItem("dungeonNames", JSON.stringify(dungeonNames));
            
            log(`🔓 Nueva mazmorra desbloqueada`, "rare");
            log(`📍 ${newDungeonName}`, "rare");
            log(`⚔️ Piso 1 - Encuentro 1`, "event");
        }
        render(); save();
        return;
    }

    player.encounter++;
    const roll = random(1,100);
    if(roll < 55) combat();
    else if(roll < 80) statEvent();
    else lootEvent();
    render(); save();
}

/* ===================== COMBAT ===================== */
function combat() {
    let enemy = {
        name: `Enemigo piso ${player.floor}`,
        hp: maxHp() - random(0,5),
        stats: {}
    };
    STATS.forEach(s => {
        enemy.stats[s] = Math.max(1, Math.floor(statTotal(s)*0.9));
    });

    log(`⚔️ ¡Encuentras a ${enemy.name}!`, "event");

    let playerDmg = Math.max(1, statTotal("Fuerza") + (player.equipment.arma?.stats.Fuerza || 0) - random(0,2));
    let enemyDmg = Math.max(1, enemy.stats.Fuerza - random(0,2));

    enemy.hp -= playerDmg;
    player.hp -= enemyDmg;

    log(`💚 ¡Infliges ${playerDmg} daño!`, "loot");
    log(`❤️ Recibes ${enemyDmg} daño`, "combat");

    if(player.hp <= 0) {
        death();
    }
    else if(enemy.hp <= 0){
        let expGained = (player.dungeon * 5) + random(5, 15);
        player.xp += expGained;
        
        // Mensajes claros de victoria
        log(`✅ ¡VICTORIA! Derrotas a ${enemy.name}`, "success");
        log(`⭐ +${expGained} XP`, "xp");
        
        // Probabilidad de loot
        if(random(1,100) > 60) {
            lootEvent();
        } else {
            log(`No hay botín esta vez...`, "info");
        }
    }
    
    render(); save();
}


/* ===================== EVENTOS ===================== */
function statEvent() {
    const s = STATS[random(0,STATS.length-1)];
    player.stats[s]++;
    log(`✨ Fuente mística: +1 ${s}`, "event");
}

function lootEvent() {
    let roll = random(1,100);
    let rarity;
    if(roll <= 70 - player.dungeon*5) rarity = RARITIES[0];
    else if(roll <= 90 - player.dungeon*3) rarity = RARITIES[1];
    else if(roll <= 98 - player.dungeon) rarity = RARITIES[2];
    else rarity = RARITIES[3];

    const slot = SLOTS[random(0,SLOTS.length-1)];
    const item = {
        id: Date.now() + "_" + random(0,9999),
        slot,
        rarity:rarity.name,
        upgrade:0,
        stats:Object.fromEntries(STATS.map(s=>[s, Math.floor(random(0,2)*rarity.mult)]))
    };
    item.name = `${PREFIX[random(0,PREFIX.length-1)]} ${slot} ${SUFFIX[random(0,SUFFIX.length-1)]} (${rarity.name})`;
    player.inventory.push(item);
    log(`🎁 Obtienes ${item.name}`, rarity.name==="Legendario"?"rare":"loot");
}

/* ===================== INVENTARIO ===================== */
function toggleEquip(idx) {
    const item = player.inventory[idx];
    if(player.equipment[item.slot]?.id === item.id) player.equipment[item.slot] = null;
    else player.equipment[item.slot] = item;
    save(); render();
}

function dismantle(idx) {
    const item = player.inventory[idx];
    if(player.equipment[item.slot]?.id === item.id) return;
    player.inventory.splice(idx,1);
    player.materials++;
    save(); render();
}

/* ===================== MEJORAR EQUIPO ===================== */
function upgradeEquipped(slot) {
    const eq = player.equipment[slot];
    if(!eq) return;
    if(player.materials < 4) return alert("No tienes suficientes materiales para mejorar.");

    eq.upgrade++;
    player.materials -= 4;
    log(`🔧 ${eq.name} ha sido mejorado +1`, "event");
    save();
    render();
}

/* ===================== TABS DE EQUIPO ===================== */
function switchEquipTab(slot) {
    currentEquipTab = slot;
    render();
}

/* ===================== COMPARAR ITEMS ===================== */
function compareItems(idx) {
    const item = player.inventory[idx];
    const equipped = player.equipment[item.slot];
    
    let comparison = `<div style="border-bottom:1px solid #555; padding-bottom:8px; margin-bottom:8px;">`;
    comparison += `<b style="color:#ffa500;">⚔️ COMPARACIÓN DE ${item.slot.toUpperCase()}</b><br><br>`;
    
    comparison += `<div style="display:flex; gap:20px; margin-bottom:10px;">`;
    comparison += `<div style="flex:1;">`;
    comparison += `<b style="color:#55ff55;">📈 Equipado:</b><br>`;
    comparison += `${equipped.name}`;
    comparison += `</div>`;
    
    comparison += `<div style="flex:1;">`;
    comparison += `<b style="color:#55aaff;">🆚 Candidato:</b><br>`;
    comparison += `${item.name}`;
    comparison += `</div>`;
    comparison += `</div>`;
    comparison += `</div>`;
    
    comparison += `<b>Estadísticas (sin mejoras):</b><br>`;
    comparison += `<div style="font-size:12px; line-height:1.6;">`;
    STATS.forEach(s => {
        const eqStat = equipped.stats[s] || 0;
        const itemStat = item.stats[s] || 0;
        const diff = itemStat - eqStat;
        const symbol = diff > 0 ? "📈" : diff < 0 ? "📉" : "→";
        const color = diff > 0 ? "#55ff55" : diff < 0 ? "#ff5555" : "#aaa";
        comparison += `<div style="color:${color};">${s}: ${eqStat} ${symbol} ${itemStat} <b>(${diff > 0 ? '+' : ''}${diff})</b></div>`;
    });
    comparison += `</div>`;
    
    // Aviso sobre las mejoras del equipado
    if(equipped.upgrade > 0) {
        comparison += `<div style="border-top:1px solid #555; margin-top:10px; padding-top:10px; font-size:12px; color:#aaa;">`;
        comparison += `<b style="color:#ff9900;">⚠️ Nota:</b> El objeto equipado está mejorado <b style="color:#ffa500;">+${equipped.upgrade}</b><br>`;
        comparison += `Esto añade <b>+${equipped.upgrade}</b> a todos los stats.`;
        comparison += `</div>`;
    }
    
    document.getElementById("popupName").textContent = "Comparación de Equipo";
    document.getElementById("popupDesc").innerHTML = comparison;
    document.getElementById("itemPopup").classList.add("visible");
}

/* ===================== MUERTE ===================== */
function death() {
    log("☠️ Has muerto", "death");
    exploring = false;
    
    // Resetear vida para que no quede negativa
    player.hp = maxHp();
    
    document.getElementById("revivePanel").classList.remove("hidden");
    
    // NO guardar el registro cuando mueres - se borra completamente
    const dungeonLogKey = `dungeonLog_${player.dungeon}`;
    localStorage.removeItem(dungeonLogKey);
    currentDungeonLog = []; // Vaciar también en memoria
    
    // Mostrar opciones de mazmorra
    showDungeonSelector();
    save();
}

function showDungeonSelector() {
    if(!player) {
        console.error("Error: player es null en showDungeonSelector");
        document.getElementById("dungeonSelector").innerHTML = `<p style="color:#ff5555;">Error: No se pudo cargar el jugador</p>`;
        return;
    }
    
    let html = `<h3>Elige una mazmorra para continuar:</h3>`;
    const maxDungeon = Math.max(1, (player.completedDungeons || 0) + 1);
    for(let i = 1; i <= maxDungeon; i++) {
        // Generar o recuperar nombre de la mazmorra
        if(!dungeonNames[i]) {
            dungeonNames[i] = generateDungeonName(i);
            localStorage.setItem("dungeonNames", JSON.stringify(dungeonNames));
        }
        const dungeonName = dungeonNames[i];
        html += `<button onclick="selectDungeon(${i})" style="display:block; width:100%; text-align:left; margin:5px 0; padding:8px; background:#222; color:#fff; border:1px solid #555; border-radius:4px; cursor:pointer;">${dungeonName}</button>`;
    }
    document.getElementById("dungeonSelector").innerHTML = html;
}

function selectDungeon(dungeonNum) {
    player.dungeon = dungeonNum;
    player.floor = 1;
    player.encounter = 1;
    player.encountersMax = random(3,8);
    player.level = 1;
    player.xp = 0;
    player.hp = maxHp();
    
    // Cargar o inicializar el registro de esa mazmorra
    const dungeonLogKey = `dungeonLog_${dungeonNum}`;
    const savedLog = localStorage.getItem(dungeonLogKey);
    if(savedLog) {
        currentDungeonLog = JSON.parse(savedLog);
        log(`⚔️ Continúas en piso ${player.floor} - encuentro ${player.encounter}`, "event");
    } else {
        currentDungeonLog = [];
        const dungeonName = dungeonNames[dungeonNum] || generateDungeonName(dungeonNum);
        dungeonNames[dungeonNum] = dungeonName;
        localStorage.setItem("dungeonNames", JSON.stringify(dungeonNames));
        log(`📍 ${dungeonName}`, "rare");
        log(`⚔️ Comienza en piso 1`, "event");
    }
    
    // Limpiar UI
    document.getElementById("dungeonSelector").innerHTML = "";
    document.getElementById("revivePanel").classList.add("hidden");
    document.getElementById("log").innerHTML = ""; // Limpiar el registro visual
    renderLog(); // Re-renderizar el nuevo registro
    
    exploring = true;
    countdown = EXPLORE_INTERVAL;
    render();
    save();
}

/* ===================== REVIVE ===================== */
function revive(){
    exploring = true;
    document.getElementById("revivePanel").classList.add("hidden");
}

/* ===================== RESET DURO ===================== */
function unlockGame(){
    if(!player) return;
    alert("🔓 Desbloqueando juego...");
    // Limpiar intervalo
    if(gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    // Resetear estado y vida
    player.hp = maxHp();
    exploring = true;
    document.getElementById("revivePanel").classList.add("hidden");
    document.getElementById("dungeonSelector").innerHTML = "";
    countdown = EXPLORE_INTERVAL;
    lastTickTime = Date.now();
    
    // Reiniciar el juego
    save();
    render();
    gameInterval = setInterval(tick, 1000);
    alert("✅ Juego desbloqueado. Continúa jugando.");
}

function resetGame(){
    if(confirm("⚠️ Esto eliminará TODO tu progreso y empezará de cero. ¿Seguro?")){
        if(gameInterval) clearInterval(gameInterval);
        localStorage.removeItem("player");
        localStorage.removeItem("dungeonNames");
        // Limpiar todos los registros de mazmorras
        for(let i = 1; i <= 20; i++) {
            localStorage.removeItem(`dungeonLog_${i}`);
        }
        player = null;
        countdown = EXPLORE_INTERVAL;
        exploring = false;
        currentDungeonLog = [];
        dungeonNames = {};
        document.getElementById("create").classList.remove("hidden");
        document.getElementById("game").classList.add("hidden");
        document.getElementById("revivePanel").classList.add("hidden");
        document.getElementById("log").innerHTML = "";
        document.getElementById("nameInput").value = "";
    }
}

/* ===================== POPUP INFO ===================== */
function showItemInfo(item){
    let content = `<b>${item.name}</b> (+${item.upgrade})<br>`;
    content += `<b>Rareza:</b> ${item.rarity}<br>`;
    content += `<b>Slot:</b> ${item.slot}<br>`;
    content += `<b>Stats:</b><br>`;
    content += `<div style="font-size:12px; line-height:1.8;">`;
    for(let i = 0; i < STATS.length; i++) {
        const s = STATS[i];
        const short = STAT_SHORT[i];
        const base = item.stats[s] || 0;
        const bonus = item.upgrade;
        const total = base + bonus;
        const bonusHTML = bonus > 0 ? ` <span style="color:#999;">(</span><span style="color:#999;">${base}</span><span style="color:#55ff55;"> +${bonus}</span><span style="color:#999;">)</span>` : '';
        content += `<div>${short}: <b style="color:#55aaff;">${total}</b>${bonusHTML}</div>`;
    }
    content += `</div>`;
    if(item.upgrade > 0) content += `<br><b style="color:#ffa500;">⬆️ Mejora:</b> +${item.upgrade} a todos los stats<br>`;
    document.getElementById("popupName").textContent = item.name;
    document.getElementById("popupDesc").innerHTML = content;
    document.getElementById("itemPopup").classList.add("visible");
}

function closePopup(){ 
    document.getElementById("itemPopup").classList.remove("visible"); 
}

/* ===================== COMANDOS/CHEATS ===================== */
function consoleLog(msg, type = "info") {
    const output = document.getElementById("consoleOutput");
    let color = "#aaa";
    
    switch(type) {
        case "success": color = "#55ff55"; break;
        case "error": color = "#ff5555"; break;
        case "warning": color = "#ffa500"; break;
        case "info": color = "#55aaff"; break;
    }
    
    const line = document.createElement("div");
    line.style.color = color;
    line.textContent = msg;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function toggleConsole() {
    const console = document.getElementById("customConsole");
    const output = document.getElementById("consoleOutput");
    
    if(console.style.display === "flex") {
        console.style.display = "none";
        document.getElementById("consoleInput").value = "";
    } else {
        console.style.display = "flex";
        // Limpiar y mostrar solo mensaje inicial
        if(output.children.length === 0) {
            const welcome = document.createElement("div");
            welcome.style.color = "#666";
            welcome.style.fontSize = "11px";
            welcome.textContent = "> Escribe /help para ver comandos";
            output.appendChild(welcome);
        }
        document.getElementById("consoleInput").focus();
    }
}

function handleConsoleInput(event) {
    if(event.key === "Enter") {
        executeConsoleCommand();
    } else if(event.key === "Escape") {
        toggleConsole();
    }
}

function executeConsoleCommand() {
    const input = document.getElementById("consoleInput");
    const command = input.value.trim();
    
    if(!command) return;
    
    consoleLog(command, "info");
    input.value = "";
    executeCmd(command);
}

function executeCmd(command) {
    if(!player) {
        consoleLog("No hay jugador activo", "error");
        return;
    }
    
    const args = command.trim().split(" ");
    const cmd_name = args[0].toLowerCase();
    
    switch(cmd_name) {
        case "/kill":
            log("💀 [CHEAT] Has muerto", "death");
            death();
            consoleLog("Comando ejecutado: /kill", "success");
            break;
            
        case "/heal":
            player.hp = maxHp();
            log(`💚 [CHEAT] Vida restaurada a ${maxHp()}`, "event");
            render();
            save();
            consoleLog("Comando ejecutado: /heal", "success");
            break;
            
        case "/addxp":
            const xpAmount = parseInt(args[1]) || 100;
            player.xp += xpAmount;
            log(`✨ [CHEAT] +${xpAmount} XP`, "xp");
            render();
            save();
            consoleLog(`Comando ejecutado: /addxp ${xpAmount}`, "success");
            break;
            
        case "/addstat":
            const stat = args[1];
            const amount = parseInt(args[2]) || 1;
            if(STATS.includes(stat)) {
                player.stats[stat] = (player.stats[stat] || 0) + amount;
                log(`⬆️ [CHEAT] +${amount} ${stat}`, "event");
                render();
                save();
                consoleLog(`Comando ejecutado: /addstat ${stat} ${amount}`, "success");
            } else {
                consoleLog(`Stat desconocido: ${stat}. Válidos: ${STATS.join(", ")}`, "error");
            }
            break;
            
        case "/addmat":
            const matAmount = parseInt(args[1]) || 10;
            player.materials += matAmount;
            log(`📦 [CHEAT] +${matAmount} Materiales`, "event");
            render();
            save();
            consoleLog(`Comando ejecutado: /addmat ${matAmount}`, "success");
            break;
            
        case "/nextfloor":
            player.floor++;
            player.encounter = 1;
            player.encountersMax = random(3,8);
            log(`⬇️ [CHEAT] Avanzas al piso ${player.floor}`, "event");
            render();
            save();
            consoleLog(`Comando ejecutado: /nextfloor`, "success");
            break;
            
        case "/nextdungeon":
            player.completedDungeons = player.dungeon;
            player.dungeon++;
            player.floor = 1;
            player.encounter = 1;
            player.encountersMax = random(3,8);
            currentDungeonLog = [];
            const newDungeonName = generateDungeonName(player.dungeon);
            dungeonNames[player.dungeon] = newDungeonName;
            localStorage.setItem("dungeonNames", JSON.stringify(dungeonNames));
            log(`🔓 [CHEAT] Nueva mazmorra desbloqueada`, "rare");
            log(`📍 ${newDungeonName}`, "rare");
            render();
            save();
            consoleLog(`Comando ejecutado: /nextdungeon`, "success");
            break;
            
        case "/help":
            consoleLog("=== COMANDOS DISPONIBLES ===", "warning");
            consoleLog("/kill - Te mata", "info");
            consoleLog("/heal - Restaura vida al máximo", "info");
            consoleLog("/addxp [cantidad] - Suma XP (default 100)", "info");
            consoleLog("/addstat [stat] [cantidad] - Suma stats (default 1)", "info");
            consoleLog("/addmat [cantidad] - Suma materiales (default 10)", "info");
            consoleLog("/nextfloor - Salta al siguiente piso", "info");
            consoleLog("/nextdungeon - Salta a la siguiente mazmorra", "info");
            consoleLog("/interval [segundos] - Cambia tiempo entre encuentros", "info");
            consoleLog("/reset - Resetea TODO el juego (confirmación)", "warning");
            consoleLog("/help - Muestra este mensaje", "info");
            break;
            
        case "/reset":
            consoleLog("Muestra ventana de confirmación...", "info");
            document.getElementById("resetConfirmPopup").style.display = "flex";
            break;
            
        default:
            if(command.startsWith("/interval")) {
                const parts = command.split(" ");
                const seconds = parseInt(parts[1]);
                
                if(isNaN(seconds) || seconds < 1) {
                    consoleLog(`Uso: /interval [segundos] (mínimo 1)`, "error");
                    break;
                }
                
                EXPLORE_INTERVAL = seconds;
                countdown = seconds;
                consoleLog(`Intervalo de encuentros cambiado a ${seconds}s`, "success");
                render();
                break;
            }
            
            consoleLog(`Comando desconocido: ${cmd_name}. Usa /help para ver los comandos.`, "error");
    }
}

// Tecla F1 para abrir consola
document.addEventListener("keydown", (event) => {
    if(event.key === "F1") {
        event.preventDefault();
        toggleConsole();
    }
});

// Inicializar comandos cuando se carga el juego
window.addEventListener('load', () => {
    window.executeCmd = executeCmd;
    consoleLog("Consola lista. Presiona F1 para abrir/cerrar", "success");
});

function confirmReset() {
    if(gameInterval) clearInterval(gameInterval);
    localStorage.removeItem("player");
    localStorage.removeItem("dungeonNames");
    for(let i = 1; i <= 20; i++) {
        localStorage.removeItem(`dungeonLog_${i}`);
    }
    player = null;
    countdown = EXPLORE_INTERVAL;
    exploring = false;
    currentDungeonLog = [];
    dungeonNames = {};
    document.getElementById("create").classList.remove("hidden");
    document.getElementById("game").classList.add("hidden");
    document.getElementById("revivePanel").classList.add("hidden");
    document.getElementById("log").innerHTML = "";
    document.getElementById("nameInput").value = "";
    document.getElementById("resetConfirmPopup").style.display = "none";
    consoleLog("Juego reseteado completamente.", "success");
}

function cancelReset() {
    document.getElementById("resetConfirmPopup").style.display = "none";
    consoleLog("Reset cancelado.", "info");
}

/* ===================== INIT ===================== */
if(player) start();
