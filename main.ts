import {
  ItemView,
  Plugin,
  WorkspaceLeaf
} from "obsidian";

const VIEW_TYPE_HEXMAP = "hexmap-view";

class HexmapView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_HEXMAP;
  }

  getDisplayText() {
    return "Hexmap";
  }

  async onOpen() {
    const container = this.contentEl;
    container.empty();

    const wrapper = container.createDiv({
      cls: "hexmap-container"
    });

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "320");
    svg.setAttribute("height", "420");

    wrapper.appendChild(svg);

    const hexes = [];

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const x = 60 + col * 52 + (row % 2) * 26;
        const y = 60 + row * 45;

        const polygon = document.createElementNS(svgNS, "polygon");

        polygon.setAttribute(
          "points",
          createHexPoints(x, y, 24)
        );

        polygon.setAttribute("fill", "#444");
        polygon.setAttribute("stroke", "#999");
        polygon.setAttribute("stroke-width", "2");

        polygon.classList.add("hex");

        let active = false;

        polygon.addEventListener("click", () => {
          active = !active;
          polygon.setAttribute(
            "fill",
            active ? "#3aa675" : "#444"
          );
        });

        svg.appendChild(polygon);
        hexes.push(polygon);
      }
    }
  }

  async onClose() {}
}

function createHexPoints(
  cx: number,
  cy: number,
  r: number
): string {
  const points = [];

  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    points.push(`${x},${y}`);
  }

  return points.join(" ");
}

export default class HexmapPlugin extends Plugin {
  async onload() {
    this.registerView(
      VIEW_TYPE_HEXMAP,
      (leaf) => new HexmapView(leaf)
    );

    this.addRibbonIcon(
      "dice",
      "Open Hexmap",
      async () => {
        const leaf =
          this.app.workspace.getRightLeaf(false);

        if (!leaf) return;

        await leaf.setViewState({
          type: VIEW_TYPE_HEXMAP,
          active: true
        });

        this.app.workspace.revealLeaf(leaf);
      }
    );
  }

  onunload() {}
}