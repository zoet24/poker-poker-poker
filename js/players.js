class Player {
  constructor(name, hand = [], showCards = true) {
    this.name = name;
    this.hand = hand;
    this.showCards = showCards;
  }
}

// Hardcoded Players
const players = [
  new Player("Zoe"),
  // new Player("Mike"),
  // new Player("Fran"),
  // new Player("Bron"),
  // new Player("Char"),
  // new Player("Mushy Peas"),
  // new Player("Guy"),
  // new Player("Alex"),
];

export { players };

export const createPlayerElements = (
  table,
  calculatePlayerPosition,
  toggleShowCards
) => {
  players.forEach((player, index) => {
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
    table.appendChild(playerContainer);

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
