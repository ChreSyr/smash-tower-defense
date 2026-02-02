import { TileType, PathNode } from "./types";

export default class GameMap {
  grid: TileType[][];
  rows: number;
  cols: number;
  tileSize: number;

  constructor(levelData: TileType[][]) {
    this.grid = levelData;
    this.rows = levelData.length;
    this.cols = levelData[0].length;
    this.tileSize = 0;
  }

  render(containerElement: HTMLElement): HTMLElement {
    containerElement.innerHTML = "";

    // Create the actual grid element
    const gridElement = document.createElement("div");
    gridElement.className = "game-map";
    gridElement.style.display = "grid";
    // JS in Game.ts will resize this
    gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    gridElement.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;

    containerElement.appendChild(gridElement);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tileType = this.grid[r][c];
        const tile = document.createElement("div");
        tile.className = `tile ${this.getTileClass(tileType)}`;
        tile.dataset.row = r.toString();
        tile.dataset.col = c.toString();
        gridElement.appendChild(tile);
      }
    }

    return gridElement;
  }

  getTileClass(type: TileType): string {
    switch (type) {
      case TileType.BUILDABLE:
        return "tile-buildable";
      case TileType.PATH:
        return "tile-path";
      case TileType.OBSTACLE:
        return "tile-obstacle";
      case TileType.START:
        return "tile-start";
      case TileType.END:
        return "tile-end";
      default:
        return "tile-empty";
    }
  }

  findPath(): PathNode[] {
    let startNode: PathNode | null = null;
    let endNode: PathNode | null = null;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === TileType.START) startNode = { row: r, col: c };
        if (this.grid[r][c] === TileType.END) endNode = { row: r, col: c };
      }
    }

    if (!startNode || !endNode) return [];

    const queue: { r: number; c: number; path: PathNode[] }[] = [
      { r: startNode.row, c: startNode.col, path: [] },
    ];
    const visited = new Set<string>();
    visited.add(`${startNode.row},${startNode.col}`);

    const directions = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;
      const { r, c, path } = current;

      const newPath = [...path, { row: r, col: c }];

      if (r === endNode.row && c === endNode.col) {
        return newPath;
      }

      for (const dir of directions) {
        const nr = r + dir.dr;
        const nc = c + dir.dc;

        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          const tile = this.grid[nr][nc];
          if (
            (tile === TileType.PATH ||
              tile === TileType.END ||
              tile === TileType.START) &&
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
