export default class UI {
  homeScreen: HTMLElement;
  gameScreen: HTMLElement;

  playBtn1: HTMLElement;
  playBtn2: HTMLElement | null;
  playBtn3: HTMLElement | null;
  playBtn4: HTMLElement | null;
  playBtn5: HTMLElement | null;
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
    this.playBtn3 = document.getElementById("play-btn-3");
    this.playBtn4 = document.getElementById("play-btn-4");
    this.playBtn5 = document.getElementById("play-btn-5");
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

  onPlayLevel3(callback: () => void) {
    if (this.playBtn3) this.playBtn3.addEventListener("click", callback);
  }

  onPlayLevel4(callback: () => void) {
    if (this.playBtn4) this.playBtn4.addEventListener("click", callback);
  }

  onPlayLevel5(callback: () => void) {
    if (this.playBtn5) this.playBtn5.addEventListener("click", callback);
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

  showGameOverScreen(onHome: () => void, onRestart: () => void) {
    this.createOverlay(
      "Game Over",
      "The enemies have invaded!",
      "base",
      onHome,
      onRestart,
    );
  }

  showVictoryScreen(
    onHome: () => void,
    onRestart: () => void,
    stats?: {
      time: number;
      healthPercent: number;
      money: number;
      totalScore: number;
      isNewHighScore: boolean;
      previousHighScore: number;
    },
  ) {
    this.createOverlay(
      "Victory!",
      "All enemies defeated!",
      "victory",
      onHome,
      onRestart,
      stats,
    );
  }

  private createOverlay(
    titleText: string,
    msgText: string,
    type: string,
    onHome: () => void,
    onRestart: () => void,
    stats?: {
      time: number;
      healthPercent: number;
      money: number;
      totalScore: number;
      isNewHighScore: boolean;
      previousHighScore: number;
    },
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

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "20px";
    buttonContainer.style.marginTop = "20px";

    const restartBtn = document.createElement("button");
    restartBtn.className = "btn primary-btn";
    restartBtn.textContent = "Restart Level";
    restartBtn.style.fontSize = "1.2rem";
    restartBtn.style.padding = "10px 30px";
    restartBtn.addEventListener("click", () => {
      overlay.remove();
      onRestart();
    });

    const homeBtn = document.createElement("button");
    homeBtn.className = "btn secondary-btn";
    homeBtn.textContent = "Back to Home";
    homeBtn.style.fontSize = "1.2rem";
    homeBtn.style.padding = "10px 30px";
    homeBtn.addEventListener("click", () => {
      overlay.remove();
      onHome();
    });

    buttonContainer.appendChild(restartBtn);
    buttonContainer.appendChild(homeBtn);

    overlay.appendChild(title);
    overlay.appendChild(msg);

    if (stats) {
      const totalScore = stats.totalScore;

      // Rank Determination
      let rank = "C";
      let rankColor = "#bdc3c7";
      if (totalScore > 12000) {
        rank = "S";
        rankColor = "#f1c40f";
      } else if (totalScore > 9000) {
        rank = "A";
        rankColor = "#2ecc71";
      } else if (totalScore > 6000) {
        rank = "B";
        rankColor = "#3498db";
      }

      const statsDiv = document.createElement("div");
      statsDiv.className = "victory-stats-card";
      statsDiv.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 25px;
        border-radius: 15px;
        margin: 20px 0;
        width: 320px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        animation: slideUp 0.6s ease-out;
      `;

      statsDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div style="text-align: left;">
            <div style="color: #ccc; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Final Score</div>
            <div style="font-size: 2.5rem; font-weight: 800; color: #fff;">${totalScore.toLocaleString()}</div>
            ${
              stats.isNewHighScore
                ? '<div style="color: #f1c40f; font-size: 0.7rem; font-weight: bold; margin-top: 5px; animation: glowPulse 1s infinite alternate;">✨ NEW HIGH SCORE! ✨</div>'
                : `<div style="color: #aaa; font-size: 0.7rem; margin-top: 5px;">Best: ${stats.previousHighScore.toLocaleString()}</div>`
            }
          </div>
          <div style="width: 70px; height: 70px; border-radius: 50%; background: ${rankColor}; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; color: #000; box-shadow: 0 0 20px ${rankColor}88;">
            ${rank}
          </div>
        </div>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="text-align: left;">
             <div style="color: #aaa; font-size: 0.7rem;">TIME</div>
             <div style="color: #fff; font-weight: bold;">${Math.floor(stats.time)} units</div>
          </div>
          <div style="text-align: left;">
             <div style="color: #aaa; font-size: 0.7rem;">HEALTH</div>
             <div style="color: #2ecc71; font-weight: bold;">${stats.healthPercent}%</div>
          </div>
          <div style="text-align: left;">
             <div style="color: #aaa; font-size: 0.7rem;">GOLD LEFT</div>
             <div style="color: #f1c40f; font-weight: bold;">$${stats.money}</div>
          </div>
          <div style="text-align: left;">
             <div style="color: #aaa; font-size: 0.7rem;">STATUS</div>
             <div style="color: #fff; font-weight: bold;">CLEARED</div>
          </div>
        </div>
      `;
      overlay.appendChild(statsDiv);
    }

    overlay.appendChild(buttonContainer);

    container.appendChild(overlay);
  }
}
