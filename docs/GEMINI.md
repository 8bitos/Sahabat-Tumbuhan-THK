## Sahabat Tumbuhanku Project Context

**Project Goal:**
To create an interactive web-based educational game, "Sahabat Tumbuhanku," that teaches about plant parts and their functions, integrated with the local wisdom of Tri Hita Karana (Palemahan, Pawongan, Parahyangan). The game aims to provide a fun, educational, and culturally enriching learning experience accessible on both PC and Android devices.

**Current Status & Completed Features:**
- **Core Game Structure:** Main map with clickable character locations (Loka, Sari, Yana). The main map background is now responsive, changing based on screen orientation.

- **Interactive Dialogue Menus:** Before each minigame, there is now an interactive, dating-sim-style dialogue scene with the respective character.
    - **Educational Content:** Each dialogue explains the core concepts of Palemahan, Pawongan, or Parahyangan in an engaging, choice-based format.
    - **Expressive Characters:** The character avatars (Loka, Sari, Yana) use multiple expressions from the asset folder to react to player choices, making the interaction more dynamic.
    - **Custom Environments:** Each dialogue scene has a unique, appropriate background (`bgmn1.png` for Palemahan, `kantin.png` for Pawongan, `pura.png` for Parahyangan).
    - **UI/UX:** The dialogue scenes are fully centered, and the character avatars have a styled border to improve visual clarity.

- **Minigames Implemented:**
  - **Canang Sari (Yana - Parahyangan):** Freeform drag-and-drop minigame for arranging flowers on a canang base.
  - **Jamu Meracik (Sari - Pawongan):** Drag-and-drop minigame for mixing correct ingredients.
  - **Berkebun Virtual (Loka - Palemahan):** Interactive gardening minigame with plant selection, growth stages, random needs, and pest interaction.

- **Educational Video & Quiz Integration:**
  - A video lesson (`Fotosintesis.mp4`) and a quiz are shown after the Palemahan minigame.
  - **Enhanced Quiz Feedback:** All three quizzes (Palemahan, Pawongan, Parahyangan) now feature character-specific, score-based feedback displayed on a dedicated results screen.
    - The feedback includes varying messages and character expressions (Loka, Sari, Yana) based on the player's score.
    - **Bug Fixes:** Resolved issues with the quiz feedback screen not appearing and corrected font colors to ensure readability.

**To resume work:** When you return, please ask me to `read_file` this `GEMINI.md` file to load the context.