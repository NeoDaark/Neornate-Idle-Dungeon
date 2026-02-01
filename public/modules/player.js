/* ===================== PLAYER STATE & UTILS ===================== */

import { STATS, SLOTS, EXPLORE_INTERVAL } from './constants.js';

export let player = JSON.parse(localStorage.getItem("player"));
export let currentDungeonLog = [];
export let dungeonNames = JSON.parse(localStorage.getItem("dungeonNames")) || {};
export let countdown = EXPLORE_INTERVAL;
export let exploring = true;
export let currentEquipTab = "arma";
export let gameInterval = null;
export let lastTickTime = Date.now();
export let money = 0;

// Función para actualizar el player
export function setPlayer(newPlayer) {
    player = newPlayer;
}

// Función para actualizar el log
export function setCurrentDungeonLog(newLog) {
    currentDungeonLog = newLog;
}

// Función para actualizar dungeon names
export function setDungeonNames(newNames) {
    dungeonNames = newNames;
}

// Función para actualizar countdown
export function setCountdown(newCountdown) {
    countdown = newCountdown;
}

// Función para actualizar exploring
export function setExploring(newExploring) {
    exploring = newExploring;
}

// Función para actualizar currentEquipTab
export function setCurrentEquipTab(newTab) {
    currentEquipTab = newTab;
}

// Función para actualizar gameInterval
export function setGameInterval(newInterval) {
    gameInterval = newInterval;
}

export function save() { 
    if(!player) return;
    player.lastTick = Date.now();
    localStorage.setItem("player", JSON.stringify(player));
    if(currentDungeonLog && currentDungeonLog.length > 0) {
        const dungeonLogKey = `dungeonLog_${player.dungeon}`;
        localStorage.setItem(dungeonLogKey, JSON.stringify(currentDungeonLog));
    }
}

export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDungeonName(dungeonNum) {
    const DUNGEON_NAMES = [
        "Catacumbas Olvidadas","Fortaleza de Hielo","Templo de las Sombras","Mina Abandonada",
        "Torre Maldita","Cavernas Cristalinas","Refugio de Titanes","Dimensión Rota",
        "Ruinas Ancestrales","Prisión Eterna","Bosque Prohibido","Castillo Sumergido",
        "Volcán Dormido","Biblioteca Perdida","Puerta del Caos","Santuario Oscuro"
    ];
    const name = DUNGEON_NAMES[(dungeonNum - 1) % DUNGEON_NAMES.length];
    return `Mazmorra ${dungeonNum} - ${name}`; 
}
