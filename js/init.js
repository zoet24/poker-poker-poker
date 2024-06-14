import { createPlayerElements } from "./players.js";
import { calculatePlayerPosition } from "./tablePlayers.js";
import { toggleShowCards } from "./cards.js";

const table = document.getElementById("table");
const tableWidth = table.offsetWidth;
const tableHeight = table.offsetHeight;

createPlayerElements(
  table,
  (playerContainer, index) =>
    calculatePlayerPosition(playerContainer, index, tableWidth, tableHeight),
  toggleShowCards
);
