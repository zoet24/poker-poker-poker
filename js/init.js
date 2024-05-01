import { users } from "./users.js";

// Create table and player elements
const table = document.getElementById("table");

// Create player elements
users.forEach((user, index) => {
  const player = document.createElement("div");
  player.classList.add("player");
  player.innerHTML = `<div class="player-circle">${user.name}</div>`;

  // Create card spaces
  const cardSpace1 = document.createElement("div");
  cardSpace1.classList.add("card-space");
  cardSpace1.style.left = "30px";
  cardSpace1.style.bottom = "60px";

  const cardSpace2 = document.createElement("div");
  cardSpace2.classList.add("card-space");
  cardSpace2.style.right = "30px";
  cardSpace2.style.bottom = "60px";

  player.appendChild(cardSpace1);
  player.appendChild(cardSpace2);

  // Add player to table
  table.appendChild(player);

  // Update card spaces based on user's hand
  if (user.hand.length > 0) {
    if (user.showCards) {
      user.hand.forEach((card, i) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.textContent = card;
        if (i === 0) {
          cardSpace1.appendChild(cardElement);
        } else {
          cardSpace2.appendChild(cardElement);
        }
      });
    } else {
      const hiddenCard1 = document.createElement("div");
      hiddenCard1.classList.add("card");
      hiddenCard1.style.backgroundColor = "#fff";
      cardSpace1.appendChild(hiddenCard1);

      const hiddenCard2 = document.createElement("div");
      hiddenCard2.classList.add("card");
      hiddenCard2.style.backgroundColor = "#fff";
      cardSpace2.appendChild(hiddenCard2);
    }
  }
});

// Position the players around the table
const players = document.querySelectorAll(".player");
const numPlayers = players.length;

players.forEach((player, index) => {
  const angle = (360 / numPlayers) * index + 90;
  const radians = (angle * Math.PI) / 180;
  const radius = table.offsetWidth / 2 - player.offsetWidth / 2;

  const x =
    Math.cos(radians) * radius + table.offsetWidth / 2 - player.offsetWidth / 2;
  const y =
    Math.sin(radians) * radius +
    table.offsetHeight / 2 -
    player.offsetHeight / 2;

  player.style.left = x + "px";
  player.style.top = y + "px";
  player.style.transform = `rotate(${angle - 90}deg)`;
});
