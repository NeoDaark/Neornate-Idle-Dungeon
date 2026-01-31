/* ===================== CONFIG ===================== */
const STATS = ["Fuerza","Destreza","Constitución","Inteligencia","Sabiduría","Carisma"];
const SLOTS = ["arma","armadura","offhand","anillo1","anillo2","amuleto"];
const RARITIES = [
    {name:"Común", chance:70, mult:1},
    {name:"Raro", chance:20, mult:1.5},
    {name:"Épico", chance:8, mult:2},
    {name:"Legendario", chance:2, mult:3}
];
const PREFIX = ["Oxidado","Antiguo","Bendito","Maldito"];
const SUFFIX = ["del Titán","del Sabio","del Ladrón","del Vacío"];
const EXPLORE_INTERVAL = 30;

/* ===================== PLAYER ===================== */
let player = JSON.parse(localStorage.getItem("player"));
let countdown = EXPLORE_INTERVAL;
let exploring = true;

function save() { 
    player.lastTick = Date.now();
    localStorage.setItem("player", JSON.stringify(player)); 
}

function log(msg, cls="event") {
    const l = document.getElementById("log");
    l.innerHTML += `<div class="${cls}">${msg}</div>`;
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
        STATS.map(s=>`<div class="stat"><span>${s}</span><span>${statTotal(s)}</span></div>`).join("");

    // Equipo equipado con mejorar +1 si hay materiales
    document.getElementById("equipped").innerHTML =
        SLOTS.map(s=>{
            const eq = player.equipment[s];
            if(!eq) return `${s}: —`;
            let btnMejorar = "";
            if(player.materials >= 4) btnMejorar = ` <button onclick="upgradeEquipped('${s}')">Mejorar +1</button>`;
            return `${s}: ${eq.name} (+${eq.upgrade})
                    <button onclick="showItemInfo(player.equipment['${s}'])">Info</button>
                    ${btnMejorar}`;
        }).join("<br>");

    // Inventario con equipar/desequipar y desmantelar
    document.getElementById("inventory").innerHTML =
        player.inventory.map((i,idx)=>`
        <div class="item">
        ${i.name} (+${i.upgrade})
        <button onclick="toggleEquip(${idx})">
            ${player.equipment[i.slot]?.id === i.id ? 'Desequipar' : 'Equipar'}
        </button>
        <button onclick="showItemInfo(player.inventory[${idx}])">Info</button>
        ${player.equipment[i.slot]?.id !== i.id ? `<button onclick="dismantle(${idx})">Desmantelar</button>` : ''}
        </div>`).join("");
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

/* ===================== PLAYER CREATION ===================== */
function createPlayer() {
    const name = document.getElementById("nameInput").value;
    if(!name) return;
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
        lastTick: Date.now()
    };
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

    if(player.lastTick){
        const elapsed = Math.floor((Date.now() - player.lastTick)/1000);
        processTime(elapsed);
    }

    render();
    setInterval(tick,1000);
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
            player.dungeon++;
            player.floor = 1;
            log(`🔓 Nueva mazmorra desbloqueada (${player.dungeon})`, "rare");
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

    log(`⚔️ Encuentras a ${enemy.name}`, "event");

    let playerDmg = Math.max(1, statTotal("Fuerza") + (player.equipment.arma?.stats.Fuerza || 0) - random(0,2));
    let enemyDmg = Math.max(1, enemy.stats.Fuerza - random(0,2));

    enemy.hp -= playerDmg;
    player.hp -= enemyDmg;

    log(`💚 Infliges ${playerDmg} daño a ${enemy.name}`, "loot");
    log(`❤️ Recibes ${enemyDmg} daño`, "combat");

    if(player.hp <= 0) death();
    else if(enemy.hp <= 0){
        let expGained = player.dungeon * 5;
        player.xp += expGained;
        log(`💙 Derrotas a ${enemy.name} y ganas ${expGained} XP`, "xp");
        if(random(1,100) > 60) lootEvent();
    }
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

/* ===================== MUERTE ===================== */
function death() {
    log("☠️ Has muerto", "death");
    exploring = false;
    document.getElementById("revivePanel").classList.remove("hidden");
    player.level = 1;
    player.xp = 0;
    player.floor = 1;
    player.encounter = 1;
    player.encountersMax = random(3,8);
    player.hp = maxHp();
    countdown = EXPLORE_INTERVAL;
    save(); render();
}

/* ===================== REVIVE ===================== */
function revive(){
    exploring = true;
    document.getElementById("revivePanel").classList.add("hidden");
}

/* ===================== RESET DURO ===================== */
function resetGame(){
    if(confirm("⚠️ Esto eliminará TODO tu progreso y empezará de cero. ¿Seguro?")){
        localStorage.removeItem("player");
        player = null;
        countdown = EXPLORE_INTERVAL;
        exploring = false;
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
    STATS.forEach(s => content += `${s}: ${item.stats[s] || 0}<br>`);
    if(item.upgrade > 0) content += `<b>Mejora extra:</b> +${item.upgrade} a todos los stats<br>`;
    document.getElementById("popupName").textContent = item.name;
    document.getElementById("popupDesc").innerHTML = content;
    document.getElementById("itemPopup").classList.remove("hidden");
}

function closePopup(){ 
    document.getElementById("itemPopup").classList.add("hidden"); 
}

/* ===================== INIT ===================== */
if(player) start();
