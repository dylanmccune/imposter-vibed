const words = {
  food: ["Tacos", "Pancakes", "Popcorn", "Sushi", "Watermelon", "Brownie", "Lemonade", "Dumplings", "Avocado", "Pizza", "Pretzel", "Cinnamon"],
  animals: ["Penguin", "Giraffe", "Octopus", "Hedgehog", "Flamingo", "Dolphin", "Raccoon", "Koala", "Peacock", "Chameleon", "Otter", "Llama"],
  places: ["Aquarium", "Airport", "Library", "Camping", "Museum", "Rooftop", "Bakery", "Lighthouse", "Subway", "Planetarium", "Waterfall", "Bowling alley"],
  things: ["Sunglasses", "Suitcase", "Alarm clock", "Umbrella", "Skateboard", "Headphones", "Candle", "Toothbrush", "Telescope", "Snow globe", "Backpack", "Rubik’s cube"],
};

const setupView = document.querySelector("#setup-view");
const gameView = document.querySelector("#game-view");
const setupForm = document.querySelector("#setup-form");
const playerCountInput = document.querySelector("#player-count");
const playerList = document.querySelector("#player-list");
const playersCount = document.querySelector("#players-count");
const categoryInput = document.querySelector("#category");
const formError = document.querySelector("#form-error");
const passCard = document.querySelector("#pass-card");
const roleCard = document.querySelector("#role-card");
const finishCard = document.querySelector("#finish-card");
const progressLabel = document.querySelector("#progress-label");
const progressFill = document.querySelector("#progress-fill");
const currentPlayerName = document.querySelector("#current-player-name");
const roleKicker = document.querySelector("#role-kicker");
const roleTitle = document.querySelector("#role-title");
const roleSymbol = document.querySelector("#role-symbol");
const wordTile = document.querySelector("#word-tile");
const roleCopy = document.querySelector("#role-copy");
const nextButtonLabel = document.querySelector("#next-button-label");

let players = [];
let imposterIndex = -1;
let secretWord = "";
let currentIndex = 0;

function randomIndex(length) {
  if (!Number.isSafeInteger(length) || length < 1 || length > 0x100000000) {
    throw new RangeError("A positive integer no larger than 2^32 is required.");
  }
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random numbers aren’t available in this browser.");
  }

  const range = 0x100000000;
  const limit = Math.floor(range / length) * length;
  const value = new Uint32Array(1);
  do {
    globalThis.crypto.getRandomValues(value);
  } while (value[0] >= limit);
  return value[0] % length;
}

function updatePlayerFields() {
  const count = Number.parseInt(playerCountInput.value, 10);
  if (!Number.isInteger(count) || count < 3 || count > 20) {
    return;
  }

  const previousNames = [...playerList.querySelectorAll("input")].map((input) => input.value);
  playerList.replaceChildren();
  for (let index = 0; index < count; index += 1) {
    const field = document.createElement("label");
    field.className = "player-field";
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const input = document.createElement("input");
    input.id = `player-name-${index}`;
    input.type = "text";
    input.name = "player-name";
    input.maxLength = 24;
    input.autocomplete = "off";
    input.placeholder = `Player ${index + 1}`;
    input.setAttribute("aria-label", `Name for player ${index + 1}`);
    input.value = previousNames[index] ?? "";
    field.append(number, input);
    playerList.append(field);
  }
  playersCount.textContent = `${count} ${count === 1 ? "PLAYER" : "PLAYERS"}`;
  formError.hidden = true;
}

function showPassCard() {
  passCard.hidden = false;
  roleCard.hidden = true;
  finishCard.hidden = true;
  currentPlayerName.textContent = players[currentIndex];
  progressLabel.textContent = `PLAYER ${currentIndex + 1} OF ${players.length}`;
  progressFill.style.width = `${(currentIndex / players.length) * 100}%`;
  document.querySelector("#reveal-button").focus();
}

function startRound() {
  players = [...playerList.querySelectorAll("input")].map((input, index) => {
    const name = input.value.trim();
    return name || `Player ${index + 1}`;
  });
  if (players.length < 3 || players.length > 20) {
    return;
  }

  try {
    imposterIndex = randomIndex(players.length);
    const availableWords = categoryInput.value === "all"
      ? Object.values(words).flat()
      : words[categoryInput.value];
    secretWord = availableWords[randomIndex(availableWords.length)];
  } catch (error) {
    formError.textContent = error.message;
    formError.hidden = false;
    return;
  }

  currentIndex = 0;
  setupView.hidden = true;
  gameView.hidden = false;
  showPassCard();
}

playerCountInput.addEventListener("input", updatePlayerFields);
document.querySelector("#decrease-count").addEventListener("click", () => {
  playerCountInput.value = String(Math.max(3, Number(playerCountInput.value) - 1));
  updatePlayerFields();
});
document.querySelector("#increase-count").addEventListener("click", () => {
  playerCountInput.value = String(Math.min(20, Number(playerCountInput.value) + 1));
  updatePlayerFields();
});

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!playerCountInput.reportValidity()) {
    return;
  }
  startRound();
});

document.querySelector("#reveal-button").addEventListener("click", () => {
  const isImposter = currentIndex === imposterIndex;
  passCard.hidden = true;
  roleCard.hidden = false;
  roleKicker.textContent = isImposter ? "YOUR SECRET ROLE" : "YOUR SECRET WORD";
  roleTitle.textContent = isImposter ? "You’re the imposter." : "You’re in the know.";
  roleSymbol.textContent = isImposter ? "?" : "✦";
  roleSymbol.setAttribute("aria-label", isImposter ? "Imposter" : "Player");
  roleSymbol.classList.toggle("known-symbol", !isImposter);
  wordTile.hidden = isImposter;
  wordTile.textContent = isImposter ? "" : secretWord;
  roleCopy.textContent = isImposter
    ? "You don’t get the word. Listen carefully, blend in, and try to work it out."
    : "This is the secret word. Remember it, then keep it to yourself.";
  nextButtonLabel.textContent = currentIndex === players.length - 1 ? "Hide my role" : "Hide & pass the phone";
  progressLabel.textContent = `PLAYER ${currentIndex + 1} OF ${players.length} · ROLE REVEALED`;
  document.querySelector("#next-button").focus();
});

document.querySelector("#next-button").addEventListener("click", () => {
  currentIndex += 1;
  if (currentIndex >= players.length) {
    passCard.hidden = true;
    roleCard.hidden = true;
    finishCard.hidden = false;
    progressLabel.textContent = "ALL PLAYERS READY";
    progressFill.style.width = "100%";
    document.querySelector("#play-again-button").focus();
    return;
  }
  showPassCard();
});

document.querySelector("#play-again-button").addEventListener("click", startRound);
document.querySelector("#edit-players-button").addEventListener("click", () => {
  gameView.hidden = true;
  setupView.hidden = false;
  document.querySelector("#player-count").focus();
});

updatePlayerFields();
