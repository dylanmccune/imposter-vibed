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
const hintModeInput = document.querySelector("#hint-mode");
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
const imposterHint = document.querySelector("#imposter-hint");
const hintText = document.querySelector("#hint-text");
const roleCopy = document.querySelector("#role-copy");
const nextButtonLabel = document.querySelector("#next-button-label");

const wordHints = {
  Tacos: "A handheld meal with a filling tucked inside.",
  Pancakes: "A fluffy breakfast favorite, often stacked.",
  Popcorn: "A crunchy snack that pops when heated.",
  Sushi: "A Japanese dish often wrapped or topped with rice.",
  Watermelon: "A juicy summer fruit with a green rind.",
  Brownie: "A rich, chewy chocolate square.",
  Lemonade: "A sweet-tart drink made with citrus.",
  Dumplings: "Small parcels of dough with a savory filling.",
  Avocado: "A creamy green fruit often mashed on toast.",
  Pizza: "A baked, cheesy favorite usually cut into slices.",
  Pretzel: "A salty snack with a distinctive twisted shape.",
  Cinnamon: "A warm, fragrant spice often used in baking.",
  Penguin: "A tuxedoed bird that waddles and swims.",
  Giraffe: "A spotted animal with an exceptionally long neck.",
  Octopus: "A clever sea creature with eight arms.",
  Hedgehog: "A tiny mammal covered in prickly spines.",
  Flamingo: "A pink wading bird that often stands on one leg.",
  Dolphin: "An intelligent marine mammal known for leaping.",
  Raccoon: "A masked nighttime visitor with nimble paws.",
  Koala: "An Australian tree-dweller that loves eucalyptus.",
  Peacock: "A bird famous for its dazzling, fanned tail.",
  Chameleon: "A lizard that can change color and flick out its tongue.",
  Otter: "A playful swimmer that sometimes floats on its back.",
  Llama: "A woolly, long-necked animal from the Andes.",
  Aquarium: "A place to see fish and other underwater life.",
  Airport: "A busy travel hub for people flying away.",
  Library: "A quiet place to borrow books.",
  Camping: "An outdoor getaway that might involve a tent.",
  Museum: "A place to explore exhibits from art to history.",
  Rooftop: "An elevated outdoor space above a building.",
  Bakery: "A shop filled with freshly baked treats.",
  Lighthouse: "A coastal tower that guides ships at night.",
  Subway: "An underground train system in a city.",
  Planetarium: "A domed theater for exploring the night sky.",
  Waterfall: "A river that makes a dramatic drop over a cliff.",
  "Bowling alley": "A place to roll a heavy ball toward ten pins.",
  Sunglasses: "Tinted eyewear for bright, sunny days.",
  Suitcase: "Luggage for packing clothes on a trip.",
  "Alarm clock": "A bedside device that wakes you up.",
  Umbrella: "A handheld canopy for rainy weather.",
  Skateboard: "A wheeled board for rolling and doing tricks.",
  Headphones: "Wearable speakers for listening privately.",
  Candle: "A waxy light source with a flickering flame.",
  Toothbrush: "A bristled tool for daily dental care.",
  Telescope: "An instrument that brings distant stars closer.",
  "Snow globe": "A tiny scene that swirls when you shake it.",
  Backpack: "A bag carried on your shoulders.",
  "Rubik’s cube": "A colorful twisty puzzle with matching sides.",
};

let players = [];
let imposterIndex = -1;
let secretWord = "";
let secretCategory = "";
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
    const firstPlayerIndex = randomIndex(players.length);
    players = [...players.slice(firstPlayerIndex), ...players.slice(0, firstPlayerIndex)];
    imposterIndex = randomIndex(players.length);
    secretCategory = categoryInput.value === "all"
      ? Object.keys(words)[randomIndex(Object.keys(words).length)]
      : categoryInput.value;
    const availableWords = words[secretCategory];
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
  const showHint = isImposter && (
    hintModeInput.value === "always" ||
    (hintModeInput.value === "first" && currentIndex === 0)
  );
  imposterHint.hidden = !showHint;
  hintText.textContent = showHint ? wordHints[secretWord] : "";
  roleCopy.textContent = isImposter
    ? showHint
      ? "Use your hint to blend in, but don’t let anyone know you got extra help."
      : "You don’t get the word. Listen carefully, blend in, and try to work it out."
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
hintModeInput.addEventListener("change", () => {
  const descriptions = {
    none: "The imposter gets no extra clues.",
    always: "The imposter gets a broad clue about the word.",
    first: "The imposter gets a clue only if they’re first to see their role.",
  };
  document.querySelector("#hint-description").textContent = descriptions[hintModeInput.value];
});
document.querySelector("#edit-players-button").addEventListener("click", () => {
  gameView.hidden = true;
  setupView.hidden = false;
  document.querySelector("#player-count").focus();
});

updatePlayerFields();
