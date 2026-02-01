/* ===================== GAME MAIN ===================== */
/* Este archivo es el punto de entrada que carga todos los módulos */

// Importar módulos
import * as constants from './modules/constants.js';
import * as playerMod from './modules/player.js';
import * as stats from './modules/stats.js';
import * as logger from './modules/logger.js';
import * as equipment from './modules/equipment.js';
import * as combat from './modules/combat.js';
import * as progression from './modules/progression.js';
import * as navigation from './modules/navigation.js';
import * as ui from './modules/ui.js';

// Exponer globalmente para que funcione en HTML
window.createPlayer = createPlayer;
window.start = start;
window.tick = tick;
window.explore = explore;
window.toggleEquip = equipment.toggleEquip;
window.dismantle = equipment.dismantle;
window.upgradeEquipped = equipment.upgradeEquipped;
window.compareItems = equipment.compareItems;
window.render = ui.render;
window.closePopup = closePopup;
window.selectClass = selectClass;

let selectedClass = null;

function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    if(loadingScreen) {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.transition = "opacity 0.3s ease-out";
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 300);
    }
}

function selectClass(className) {
    selectedClass = className;
    
    // Actualizar UI
    document.querySelectorAll(".class-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    document.querySelector(`[data-class="${className}"]`).classList.add("active");
    
    document.getElementById("selectedClass").textContent = `✓ ${className} seleccionado`;
    document.getElementById("startBtn").disabled = false;
}

function createPlayer() {
    const name = document.getElementById("nameInput").value;
    if(!name) return alert("Ingresa un nombre");
    if(!selectedClass) return alert("Selecciona una clase");
    
    // Stats iniciales según clase
    const baseStats = Object.fromEntries(constants.STATS.map(s=>[s,5]));
    if(selectedClass === "Warrior") baseStats.Fuerza += 2;
    else if(selectedClass === "Thief") baseStats.Destreza += 2;
    else if(selectedClass === "Mage") baseStats.Inteligencia += 2;
    
    playerMod.setPlayer({
        name,
        level:1,
        xp:0,
        hp:20,
        materials:0,
        stats: baseStats,
        equipment:Object.fromEntries(constants.SLOTS.map(s=>[s,null])),
        inventory:[],
        tier:1,
        class: selectedClass,
        currentJob: null,
        completedJobs: 0
    });
    
    playerMod.setCurrentDungeonLog([]);
    playerMod.save();
    start();
}

function start() {
    document.getElementById("create").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    
    if(playerMod.gameInterval) clearInterval(playerMod.gameInterval);
    
    // Inicializar el registro como vacío
    playerMod.setCurrentDungeonLog([]);
    
    ui.render();
    navigation.initNavigation();
    navigation.showNavBar();
    playerMod.setExploring(false);
    playerMod.setCountdown(constants.EXPLORE_INTERVAL);
    playerMod.setGameInterval(setInterval(tick, 1000));
    hideLoadingScreen();
}

function tick() {
    if(!playerMod.player || playerMod.player.hp <=0 || !playerMod.exploring) return;
    playerMod.setCountdown(playerMod.countdown - 1);
    if(playerMod.countdown <= 0) {
        explore();
        playerMod.setCountdown(constants.EXPLORE_INTERVAL);
    }
    ui.render();
    playerMod.save();
}

function explore() {
    // Este sistema se reemplazará con trabajos
    // Por ahora, no hacer nada
    return;
}

// Inicializar al cargar
if(playerMod.player) start();

// Ocultar pantalla de carga después de que todo cargue
window.addEventListener("load", () => {
    // Esperar un poco para que todo renderice
    setTimeout(() => {
        hideLoadingScreen();
    }, 500);
});

function closePopup() {
    document.getElementById("itemPopup").classList.remove("visible");
}
