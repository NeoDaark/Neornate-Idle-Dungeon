/* ===================== NAVIGATION SYSTEM ===================== */

export let currentTab = "home";

export function setCurrentTab(tab) {
    currentTab = tab;
    hideAllTabs();
    showTab(tab);
}

export function hideAllTabs() {
    const tabs = document.querySelectorAll("[data-tab]");
    tabs.forEach(tab => {
        tab.classList.add("hidden");
    });
}

export function showTab(tabName) {
    const tab = document.querySelector(`[data-tab="${tabName}"]`);
    if(tab) {
        tab.classList.remove("hidden");
    }
    
    // Actualizar botones activos
    const buttons = document.querySelectorAll(".nav-button");
    buttons.forEach(btn => {
        btn.classList.remove("active");
    });
    const activeBtn = document.querySelector(`[data-nav="${tabName}"]`);
    if(activeBtn) {
        activeBtn.classList.add("active");
    }
}

export function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-button");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.getAttribute("data-nav");
            setCurrentTab(tab);
        });
    });
    
    // Mostrar tab inicial (home)
    setCurrentTab("home");
}

export function showNavBar() {
    const navBar = document.querySelector(".nav-bar");
    if(navBar) navBar.classList.remove("hidden");
}

export function hideNavBar() {
    const navBar = document.querySelector(".nav-bar");
    if(navBar) navBar.classList.add("hidden");
}
