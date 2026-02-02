export default class UI {
  homeScreen: HTMLElement;
  gameScreen: HTMLElement;

  playBtn1: HTMLElement;
  playBtn2: HTMLElement | null;
  homeBtn: HTMLElement | null;

  startWaveBtn: HTMLButtonElement;
  towerBtn: HTMLElement;
  waveStatus: HTMLElement;
  healthDisplay: HTMLElement;
  levelTitle: HTMLElement;

  constructor() {
    this.homeScreen = document.getElementById("home-screen")!;
    this.gameScreen = document.getElementById("game-screen")!;

    this.playBtn1 = document.getElementById("play-btn-1")!;
    this.playBtn2 = document.getElementById("play-btn-2");
    this.homeBtn = document.getElementById("home-btn");

    this.startWaveBtn = document.getElementById(
      "start-wave-btn",
    ) as HTMLButtonElement;
    this.towerBtn = document.getElementById("tower-btn")!;
    this.waveStatus = document.getElementById("wave-status")!;
    this.healthDisplay = document.getElementById("health-display")!;
    this.levelTitle = document.querySelector("#game-screen h2") as HTMLElement;
  }

  showGameScreen(levelName: string) {
    this.homeScreen.classList.add("hidden");
    this.gameScreen.classList.remove("hidden");
    if (levelName) this.levelTitle.textContent = levelName;
  }

  showHomeScreen() {
    this.gameScreen.classList.add("hidden");
    this.homeScreen.classList.remove("hidden");
  }

  updateWaveStatus(waveNumber: number, totalWaves: number) {
    this.waveStatus.textContent = `Wave: ${waveNumber} / ${totalWaves}`;
  }

  updateHealth(health: number | string) {
    this.healthDisplay.textContent = `Health: ${health}`;
    if (health === "GAME OVER") {
      this.healthDisplay.textContent = "GAME OVER";
    }
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

  onTowerCreate(callback: () => void) {
    this.towerBtn.addEventListener("click", callback);
  }
}
