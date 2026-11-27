# Undercover

A private, pass-the-phone imposter party game for 3–20 players.

## Play

Open `index.html` in a modern browser, choose the player count and a word category, and optionally enter player names. Choose whether the imposter gets no hint, always gets a hint, or gets one only if they give the first clue. Deal the roles in player order, then pass the phone around: everyone except one randomly selected imposter sees the same secret word. After the roles are dealt, the randomly selected starting player is announced. The imposter sees their role but never the word.

Players and roles stay in the current page; nothing is sent to a server. Role selection uses the browser’s cryptographic random-number generator with rejection sampling, so every player has an equal chance to be the imposter.
