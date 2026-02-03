export default class UI {
  homeScreen: HTMLElement;
  gameScreen: HTMLElement;

  playBtn1: HTMLElement;
  playBtn2: HTMLElement | null;
  homeBtn: HTMLElement | null;
  restartBtn: HTMLElement | null;

  startWaveBtn: HTMLButtonElement;

  // Info Displays
  waveStatus: HTMLElement;
  healthDisplay: HTMLElement;
  moneyDisplay: HTMLElement;
  levelTitle: HTMLElement | null;

  // Tower Buttons
  btnTowerBasic: HTMLElement;
  btnTowerSniper: HTMLElement;
  btnTowerRapid: HTMLElement;

  constructor() {
    this.homeScreen = document.getElementById("home-screen")!;
    this.gameScreen = document.getElementById("game-screen")!;

    this.playBtn1 = document.getElementById("play-btn-1")!;
    this.playBtn2 = document.getElementById("play-btn-2");
    this.homeBtn = document.getElementById("home-btn");
    this.restartBtn = document.getElementById("restart-btn");

    this.startWaveBtn = document.getElementById(
      "start-wave-btn",
    ) as HTMLButtonElement;

    this.waveStatus = document.getElementById("wave-status")!;
    this.healthDisplay = document.getElementById("health-display")!;
    this.moneyDisplay = document.getElementById("money-display")!;
    this.levelTitle = document.querySelector(
      "#game-screen h2",
    ) as HTMLElement | null; // Nullable now

    this.btnTowerBasic = document.getElementById("btn-tower-basic")!;
    this.btnTowerSniper = document.getElementById("btn-tower-sniper")!;
    this.btnTowerRapid = document.getElementById("btn-tower-rapid")!;
  }

  showGameScreen(levelName: string) {
    this.homeScreen.classList.add("hidden");
    this.gameScreen.classList.remove("hidden");
    if (levelName && this.levelTitle) this.levelTitle.textContent = levelName;
  }

  showHomeScreen() {
    this.gameScreen.classList.add("hidden");
    this.homeScreen.classList.remove("hidden");
  }

  updateWaveStatus(waveNumber: number, totalWaves: number) {
    this.waveStatus.textContent = `Wave: ${waveNumber} / ${totalWaves}`;
  }

  updateHealth(health: number | string) {
    this.healthDisplay.textContent = `${health}`;
    // If Game Over, maybe styling changes?
    if (health === "GAME OVER") {
      this.healthDisplay.textContent = "DEAD";
    }
  }

  updateMoney(amount: number) {
    this.moneyDisplay.textContent = `${amount}`;
  }

  toggleWaveButton(enable: boolean) {
    if (enable) {
      this.startWaveBtn.disabled = false;
      this.startWaveBtn.style.opacity = "1";
      this.startWaveBtn.style.cursor = "pointer";
      this.startWaveBtn.textContent = "Start Enemy Wave";
    } else {
      this.startWaveBtn.disabled = true;
      this.startWaveBtn.style.opacity = "0.5";
      this.startWaveBtn.style.cursor = "not-allowed";
      this.startWaveBtn.textContent = "Wave In Progress...";
    }
  }

  // Event listener helpers
  onPlayLevel1(callback: () => void) {
    this.playBtn1.addEventListener("click", callback);
  }

  onPlayLevel2(callback: () => void) {
    if (this.playBtn2) this.playBtn2.addEventListener("click", callback);
  }

  onHome(callback: () => void) {
    if (this.homeBtn) this.homeBtn.addEventListener("click", callback);
  }

  onStartWave(callback: () => void) {
    this.startWaveBtn.addEventListener("click", callback);
  }

  onRestart(callback: () => void) {
    if (this.restartBtn) this.restartBtn.addEventListener("click", callback);
  }

  onTowerSelect(callback: (type: string) => void) {
    this.btnTowerBasic.addEventListener("click", () => callback("basic"));
    this.btnTowerSniper.addEventListener("click", () => callback("sniper"));
    this.btnTowerRapid.addEventListener("click", () => callback("rapid"));
  }

  highlightTower(type: string | null) {
    // Reset all
    this.btnTowerBasic.classList.remove("selected");
    this.btnTowerSniper.classList.remove("selected");
    this.btnTowerRapid.classList.remove("selected");

    if (type === "basic") this.btnTowerBasic.classList.add("selected");
    if (type === "sniper") this.btnTowerSniper.classList.add("selected");
    if (type === "rapid") this.btnTowerRapid.classList.add("selected");
  }

  updateTowerAvailability(money: number) {
    this.toggleTowerAbility(this.btnTowerBasic, money, 100);
    this.toggleTowerAbility(this.btnTowerSniper, money, 300);
    this.toggleTowerAbility(this.btnTowerRapid, money, 150); // Updated from 250
  }

  private toggleTowerAbility(btn: HTMLElement, money: number, cost: number) {
    if (money >= cost) {
      btn.classList.remove("disabled");
    } else {
      btn.classList.add("disabled");
    }
  }
  onSpeedChange(callback: (speed: number) => void) {
    document.getElementById("speed-1x")?.addEventListener("click", () => {
      this.highlightSpeed(1);
      callback(1);
    });
    document.getElementById("speed-2x")?.addEventListener("click", () => {
      this.highlightSpeed(2);
      callback(2);
    });
    document.getElementById("speed-4x")?.addEventListener("click", () => {
      this.highlightSpeed(4);
      callback(4);
    });

    this.highlightSpeed(1); // Default
  }

  highlightSpeed(speed: number) {
    document
      .querySelectorAll("#speed-controls .btn")
      .forEach((btn) => ((btn as HTMLElement).style.background = ""));
    document.getElementById(`speed-${speed}x`)!.style.background = "#2ecc71";
  }

  showGameOverScreen(onHome: () => void) {
    this.createOverlay(
      "Game Over",
      "The enemies have invaded!",
      "base",
      onHome,
    );
  }

  showVictoryScreen(onHome: () => void) {
    this.createOverlay("Victory!", "All enemies defeated!", "victory", onHome);
  }

  private createOverlay(
    titleText: string,
    msgText: string,
    type: string,
    onHome: () => void,
  ) {
    const container = document.getElementById("game-area");
    if (!container) return;

    const overlay = document.createElement("div");
    overlay.id = "game-over-overlay";
    if (type === "victory") overlay.classList.add("victory");

    const title = document.createElement("h2");
    title.textContent = titleText;

    const msg = document.createElement("p");
    msg.textContent = msgText;

    const btn = document.createElement("button");
    btn.className = "btn secondary-btn";
    btn.textContent = "Back to Home";
    btn.style.fontSize = "1.2rem";
    btn.style.padding = "10px 30px";
    btn.addEventListener("click", () => {
      overlay.remove();
      onHome();
    });

    overlay.appendChild(title);
    overlay.appendChild(msg);
    overlay.appendChild(btn);

    container.appendChild(overlay);
  }
}
