import { createPlayerElements, players, Player } from "./players.js";
import { calculatePlayerPosition } from "./tablePlayers.js";
import { toggleShowCards } from "./cards.js";

const table = document.getElementById("table");
const tableWidth = table.offsetWidth;
const tableHeight = table.offsetHeight;
const playersContainer = document.getElementById("players");

const renderPlayers = (numberOfPlayers = 4) => {
  createPlayerElements(
    playersContainer,
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
renderPlayers();
