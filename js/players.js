import { Player } from "./player.js";
import { createPlayerElements } from "./createPlayerElements.js";

const playersSet = [
  new Player("Zoe"),
  new Player("Mike"),
  new Player("Fran"),
  new Player("Emma"),
  new Player("Era"),
  new Player("Mushy Peas"),
  new Player("Guy"),
  new Player("Alex"),
];

let numberOfPlayers = 4;
let players = playersSet.slice(0, numberOfPlayers);

const playersContainer = document.getElementById("players");
const table = document.getElementById("table");
const tableWidth = table.offsetWidth;
const tableHeight = table.offsetHeight;
const addPlayerBtn = document.getElementById("addPlayerBtn");
const removePlayerBtn = document.getElementById("removePlayerBtn");

const renderPlayers = (numberOfPlayers = 4) => {
  createPlayerElements(
    playersContainer,
    players,
    tableWidth,
    tableHeight,
    numberOfPlayers
  );
};

// Initial render with default players
renderPlayers(numberOfPlayers);

addPlayerBtn.addEventListener("click", () => {
  if (numberOfPlayers < playersSet.length) {
    numberOfPlayers++;
    players = playersSet.slice(0, numberOfPlayers);
    renderPlayers(numberOfPlayers);
  }
});

removePlayerBtn.addEventListener("click", () => {
  if (numberOfPlayers > 1) {
    numberOfPlayers--;
    players = playersSet.slice(0, numberOfPlayers);
    renderPlayers(numberOfPlayers);
  }
});

export { players, Player };
