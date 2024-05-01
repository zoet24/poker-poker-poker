import { players } from "./players.js";

const table = document.getElementById("table");
const tableWidth = table.offsetWidth;
const tableHeight = table.offsetHeight;

function calculatePlayerPosition(playerContainer, index) {
  const angle = (360 / players.length) * index + 90;
  const radians = (angle * Math.PI) / 180;
  const playerWidth = playerContainer.offsetWidth;
  const playerHeight = playerContainer.offsetHeight;
  const radius =
    Math.min(tableWidth, tableHeight) / 2 -
    Math.max(playerWidth, playerHeight) / 2;
  const x = Math.cos(radians) * radius + tableWidth / 2 - playerWidth / 2;
  const y = Math.sin(radians) * radius + tableHeight / 2 - playerHeight / 2;
  return { x, y, angle };
}

// Create player elements
players.forEach((player, index) => {
  // Create player element
  const playerContainer = document.createElement("div");
  playerContainer.classList.add("player");
  playerContainer.textContent = player.name;

  // Create players' cards
  const playerCards = document.createElement("div");
  playerCards.classList.add("cards-player");
  playerCards.id =
    "cards-player-" + player.name.replace(/\s/g, "").toLowerCase();

  const [card1, card2] = Array.from({ length: 2 }, () => {
    const card = document.createElement("div");
    card.classList.add("card");
    if (player.hand.length === 0) {
      card.classList.add("card-outline");
    }
    return card;
  });

  playerCards.appendChild(card1);
  playerCards.appendChild(card2);
  playerContainer.appendChild(playerCards);

  // Add player to table
  table.appendChild(playerContainer);

  // Set player position
  const { x, y, angle } = calculatePlayerPosition(playerContainer, index);
  playerContainer.style.left = x + "px";
  playerContainer.style.top = y + "px";
  playerContainer.style.transform = `rotate(${angle - 90}deg)`;
});
