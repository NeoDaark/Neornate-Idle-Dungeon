/* ===================== LOGGING SYSTEM ===================== */

import { currentDungeonLog, setCurrentDungeonLog } from './player.js';

const COLOR_MAP = {
    "event": "#aaa",
    "combat": "#ff5555",
    "loot": "#55ff55",
    "xp": "#ffaa00",
    "rare": "#ff00ff",
    "success": "#00ff00",
    "info": "#55aaff",
    "death": "#ff0000"
};

export function log(msg, cls="event") {
    const entry = {
        text: msg,
        color: COLOR_MAP[cls] || "#aaa"
    };
    currentDungeonLog.push(entry);
}

export function clearLog() {
    setCurrentDungeonLog([]);
}
