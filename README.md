# Minesweeper

Basic Minesweeper game implemented in ReactJS.

Node is needed to run this program.
Additional dependencies may be needed. A full list of dependencies can be seen in `package.json`.
```    
    "@testing-library/jest-dom": "^5.14.1",
    "@testing-library/react": "^11.2.7",
    "@testing-library/user-event": "^12.8.3",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-router-dom": "^5.3.0",
    "react-scripts": "4.0.3",
    "web-vitals": "^1.1.2"
```

Once installed, run program using:
```$ npm start```

This will automatically open up a browser where you will be able to play the game.

Note, standard rules apply to this version of Minesweeper with two exceptions:
* The first click is not guaranteed safe. Mines are set when instance of game is set.
* The "Reveal Mines" button was implemented per project specifications. This is not a standard feature in Minesweeper.
* Restarting a game retains mine coordinates. Starting a new game from the main menu will randomize mines each time.
