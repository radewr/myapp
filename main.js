const obsidian = require("obsidian");

const VIEW_TYPE_HEXMAP = "hexmap-view";

class HexmapView extends obsidian.ItemView {

  constructor(leaf) {
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

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");

    svg.setAttribute("width", "320");
    svg.setAttribute("height", "420");

    container.appendChild(svg);

    for (let row = 0; row < 5; row++) {

      for (let col = 0; col < 5; col++) {

        const x = 60 + col * 52 + (row % 2) * 26;
        const y = 60 + row * 45;

        const hex = document.createElementNS(
          svgNS,
          "polygon"
        );

        hex.setAttribute(
          "points",
          createHex(x, y, 24)
        );

        hex.setAttribute("fill", "#444");
        hex.setAttribute("stroke", "#999");
        hex.setAttribute("stroke-width", "2");

        let active = false;

        hex.addEventListener("click", () => {

          active = !active;

          hex.setAttribute(
            "fill",
            active ? "#3aa675" : "#444"
          );
        });

        svg.appendChild(hex);
      }
    }
  }
}

function createHex(cx, cy, r) {

  const points = [];

  for (let i = 0; i < 6; i++) {

    const angle = Math.PI / 3 * i;

    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    points.push(`${x},${y}`);
  }

  return points.join(" ");
}

module.exports = class HexmapPlugin extends obsidian.Plugin {

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

        await leaf.setViewState({
          type: VIEW_TYPE_HEXMAP,
          active: true
        });

        this.app.workspace.revealLeaf(leaf);
      }
    );
  }
};
