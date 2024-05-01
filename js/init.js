import { users } from "./users.js";

// Create table and player elements
const table = document.getElementById("table");

// Calculate table dimensions
const tableWidth = table.offsetWidth;
const tableHeight = table.offsetHeight;

// Create player elements
users.forEach((user, index) => {
  // Create player element
  const player = document.createElement("div");
  player.classList.add("player");

  // Create player circle element
  const playerCircle = document.createElement("div");
  playerCircle.classList.add("player-circle");
  playerCircle.textContent = user.name;
  player.appendChild(playerCircle);

  // Create players' cards
  const cardsPlayer = document.createElement("div");
  cardsPlayer.classList.add("cards-player");

  // Create card elements
  const [card1, card2] = Array.from({ length: 2 }, () => {
    const card = document.createElement("div");
    card.classList.add("card");
    if (user.hand.length === 0) {
      card.classList.add("card-outline");
    }
    return card;
  });

  if (user.showCards) {
    user.hand.forEach((card, i) => {
      const cardElement = document.createElement("div");
      cardElement.textContent = card;
      if (i === 0) {
        card1.appendChild(cardElement);
      } else {
        card2.appendChild(cardElement);
      }
    });
  }

  cardsPlayer.appendChild(card1);
  cardsPlayer.appendChild(card2);
  player.appendChild(cardsPlayer);

  // Add player to table
  table.appendChild(player);

  // Calculate player position
  const angle = (360 / users.length) * index + 90;
  const radians = (angle * Math.PI) / 180;
  const playerWidth = player.offsetWidth;
  const playerHeight = player.offsetHeight;
  const radius =
    Math.min(tableWidth, tableHeight) / 2 -
    Math.max(playerWidth, playerHeight) / 2;

  const x = Math.cos(radians) * radius + tableWidth / 2 - playerWidth / 2;
  const y = Math.sin(radians) * radius + tableHeight / 2 - playerHeight / 2;

  // Set player position
  player.style.left = x + "px";
  player.style.top = y + "px";
  player.style.transform = `rotate(${angle - 90}deg)`;
});
