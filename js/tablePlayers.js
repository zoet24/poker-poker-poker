import { players } from "./players.js";

export const calculatePlayerPosition = (
  playerContainer,
  index,
  tableWidth,
  tableHeight,
  offset = 10 // Default offset value
) => {
  const angle = (360 / players.length) * index + 90;
  const radians = (angle * Math.PI) / 180;
  const playerWidth = playerContainer.offsetWidth;
  const playerHeight = playerContainer.offsetHeight;
  const radius =
    Math.min(tableWidth, tableHeight) / 2 -
    Math.max(playerWidth, playerHeight) / 2 -
    offset;
  const x = Math.cos(radians) * radius + tableWidth / 2 - playerWidth / 2;
  const y = Math.sin(radians) * radius + tableHeight / 2 - playerHeight / 2;
  return { x, y, angle };
};
