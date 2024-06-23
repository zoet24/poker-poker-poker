import { createPlayerElements, players, Player } from "./players.js";
import { calculatePlayerPosition } from "./tablePlayers.js";
import { toggleShowCards } from "./cards.js";

const table = document.getElementById("table");
const tableWidth = table.offsetWidth;
const tableHeight = table.offsetHeight;

const addPlayerBtn = document.getElementById("addPlayerBtn");
const removePlayerBtn = document.getElementById("removePlayerBtn");

let currentNumberOfPlayers = 4; // Default number of players

const renderPlayers = (numberOfPlayers = 4) => {
  createPlayerElements(
    table,
    (playerContainer, index) =>
      calculatePlayerPosition(
        playerContainer,
        index,
        tableWidth,
        tableHeight,
        numberOfPlayers
      ),
    toggleShowCards,
    numberOfPlayers
  );
};

// Initial render with default players
renderPlayers(currentNumberOfPlayers);

addPlayerBtn.addEventListener("click", () => {
  if (currentNumberOfPlayers < players.length) {
    currentNumberOfPlayers++;
    renderPlayers(currentNumberOfPlayers);
  }
});

removePlayerBtn.addEventListener("click", () => {
  if (currentNumberOfPlayers > 1) {
    currentNumberOfPlayers--;
    renderPlayers(currentNumberOfPlayers);
  }
});
