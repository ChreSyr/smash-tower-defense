import { TILE_TYPE } from "./constants.js";

export default class GameMap {
  constructor(levelData) {
    this.grid = levelData;
    this.rows = levelData.length;
    this.cols = levelData[0].length;
    this.tileSize = 0; // Calculated on render
  }

  render(containerElement) {
    containerElement.innerHTML = "";
    containerElement.className = "game-map";

    // Dynamic grid styling
    containerElement.style.display = "grid";
    containerElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    containerElement.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;

    // Get approximate tile size for canvas drawing later
    // Assuming square map container for now
    const rect = containerElement.getBoundingClientRect();
    this.tileSize = rect.width / this.cols;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tileType = this.grid[r][c];
        const tile = document.createElement("div");
        tile.className = `tile ${this.getTileClass(tileType)}`;
        tile.dataset.row = r;
        tile.dataset.col = c;
        containerElement.appendChild(tile);
      }
    }
  }

  getTileClass(type) {
    switch (type) {
      case TILE_TYPE.BUILDABLE:
        return "tile-buildable";
      case TILE_TYPE.PATH:
        return "tile-path";
      case TILE_TYPE.OBSTACLE:
        return "tile-obstacle";
      case TILE_TYPE.START:
        return "tile-start";
      case TILE_TYPE.END:
        return "tile-end";
      default:
        return "tile-empty";
    }
  }

  // A simple BFS to find path from Start to End
  findPath() {
    let startNode = null;
    let endNode = null;

    // Find start and end
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === TILE_TYPE.START) startNode = { r, c };
        if (this.grid[r][c] === TILE_TYPE.END) endNode = { r, c };
      }
    }

    if (!startNode || !endNode) return [];

    const queue = [{ r: startNode.r, c: startNode.c, path: [] }];
    const visited = new Set();
    visited.add(`${startNode.r},${startNode.c}`);

    const directions = [
      { dr: -1, dc: 0 }, // Up
      { dr: 1, dc: 0 }, // Down
      { dr: 0, dc: -1 }, // Left
      { dr: 0, dc: 1 }, // Right
    ];

    while (queue.length > 0) {
      const current = queue.shift();
      const { r, c, path } = current;

      // Include current node in path
      const newPath = [...path, { row: r, col: c }];

      if (r === endNode.r && c === endNode.c) {
        return newPath;
      }

      for (const dir of directions) {
        const nr = r + dir.dr;
        const nc = c + dir.dc;

        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          const tile = this.grid[nr][nc];
          // Valid tiles to walk on: Path, End, Start (if we consider backtracking allowed, but usually map design prevents loops)
          // Actually, Start is only valid as a starting point.
          // We treat Path and End as walkable.
          if (
            (tile === TILE_TYPE.PATH ||
              tile === TILE_TYPE.END ||
              tile === TILE_TYPE.START) &&
            !visited.has(`${nr},${nc}`)
          ) {
            visited.add(`${nr},${nc}`);
            queue.push({ r: nr, c: nc, path: newPath });
          }
        }
      }
    }
    return [];
  }
}
