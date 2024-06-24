import { toggleShowCards } from "./cards.js";
import { calculatePlayerPosition } from "./playerPosition.js";

const createPlayerElements = (
  playersContainer,
  players,
  tableWidth,
  tableHeight,
  numberOfPlayers
) => {
  playersContainer.innerHTML = "";

  players.slice(0, numberOfPlayers).forEach((player, index) => {
    // Create player element
    const playerContainer = document.createElement("div");
    playerContainer.classList.add("player");

    // Create name display and input elements
    const playerNameDisplay = document.createElement("span");
    playerNameDisplay.textContent = player.name;
    playerNameDisplay.classList.add("player-name-display");

    const playerNameInput = document.createElement("input");
    playerNameInput.type = "text";
    playerNameInput.value = player.name;
    playerNameInput.classList.add("player-name-input");
    playerNameInput.style.display = "none"; // Hide the input by default

    // Toggle between display and input on click
    playerNameDisplay.addEventListener("click", () => {
      playerNameDisplay.style.display = "none";
      playerNameInput.style.display = "block";
      playerNameInput.focus();
    });

    playerNameInput.addEventListener("blur", () => {
      playerNameDisplay.style.display = "block";
      playerNameInput.style.display = "none";
      player.name = playerNameInput.value;
      playerNameDisplay.textContent = player.name;
    });

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
    playerContainer.appendChild(playerNameDisplay);
    playerContainer.appendChild(playerNameInput);
    playerCards.appendChild(card1);
    playerCards.appendChild(card2);
    playerContainer.appendChild(playerCards);

    // Add player to table
    playersContainer.appendChild(playerContainer);

    // Set player position
    const { x, y, angle } = calculatePlayerPosition(
      playerContainer,
      index,
      tableWidth,
      tableHeight,
      numberOfPlayers
    );
    playerContainer.style.left = `${x}px`;
    playerContainer.style.top = `${y}px`;
    playerContainer.style.transform = `rotate(${angle - 90}deg)`;

    // Add event listener to toggle showCards
    playerContainer.addEventListener("click", () =>
      toggleShowCards(player, playerCards)
    );
  });
};

export { createPlayerElements };
