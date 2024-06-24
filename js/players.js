import { calculatePlayerPosition } from "./tablePlayers.js";
import { toggleShowCards } from "./cards.js";

class Player {
  constructor(name, hand = [], showCards = true) {
    this.name = name;
    this.hand = hand;
    this.showCards = showCards;
  }
}

// Hardcoded Players
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

addPlayerBtn.addEventListener("click", () => {
  if (numberOfPlayers < playersSet.length) {
    numberOfPlayers++;
    renderPlayers(numberOfPlayers);
    players = playersSet.slice(0, numberOfPlayers);
  }
});

removePlayerBtn.addEventListener("click", () => {
  if (numberOfPlayers > 1) {
    numberOfPlayers--;
    renderPlayers(numberOfPlayers);
    players = playersSet.slice(0, numberOfPlayers);
  }
});

export const createPlayerElements = (
  playersContainer,
  calculatePlayerPosition,
  toggleShowCards,
  numberOfPlayers = 4
) => {
  playersContainer.innerHTML = "";

  playersSet.slice(0, numberOfPlayers).forEach((player, index) => {
    // Create player element
    const playerContainer = document.createElement("div");
    playerContainer.classList.add("player");
    playerContainer.textContent = player.name;

    // Create players' cards container
    const playerCards = document.createElement("div");
    playerCards.classList.add("cards--player");
    playerCards.id = `cards--player-${player.name
      .replace(/\s/g, "")
      .toLowerCase()}`;

    // Create individual card elements
    const [card1, card2] = Array.from({ length: 2 }, () => {
      const card = document.createElement("div");
      card.classList.add("card");
      if (player.hand.length === 0) {
        card.classList.add("card--outline");
      }
      return card;
    });

    // Append cards to the player's card container
    playerCards.appendChild(card1);
    playerCards.appendChild(card2);
    playerContainer.appendChild(playerCards);

    // Add player to table
    playersContainer.appendChild(playerContainer);

    // Set player position
    const { x, y, angle } = calculatePlayerPosition(playerContainer, index);
    playerContainer.style.left = `${x}px`;
    playerContainer.style.top = `${y}px`;
    playerContainer.style.transform = `rotate(${angle - 90}deg)`;

    // Add event listener to toggle showCards
    playerContainer.addEventListener("click", () =>
      toggleShowCards(player, playerCards)
    );
  });
};

export { players, Player };
