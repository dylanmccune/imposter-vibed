# Undercover

A private, pass-the-phone imposter party game for 3–20 players.

## Play

Open `index.html` in a modern browser, choose the player count and a word category, and optionally enter player names. Choose whether the imposter gets no hint, always gets a hint, or gets one only when they go first. The starting player is randomly selected for every round. Deal the roles, then pass the phone around: everyone except one randomly selected imposter sees the same secret word. The imposter sees their role but never the word.

Players and roles stay in the current page; nothing is sent to a server. Role selection uses the browser’s cryptographic random-number generator with rejection sampling, so every player has an equal chance to be the imposter.
