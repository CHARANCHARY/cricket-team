const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// API 1

const convertToCamelsace = (each) => {
  return {
    playerId: each.player_id,
    playerName: each.player_name,
    jerseyNumber: each.jersey_number,
    role: each.role,
  };
};

app.get("/players/", async (request, response) => {
  const getAllPlayers = `
    SELECT
        *
    FROM 
        cricket_team;
    `;
  const playersList = await db.all(getAllPlayers);
  response.send(playersList.map((each) => convertToCamelsace(each)));
});

// API 2

app.use(express.json());
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const addNewPlayer = `
    INSERT INTO
        cricket_team (player_name,jersey_number,role)
    VALUES
        ( "charan",3,"batter" );
    `;
  const newPlayer = await db.run(addNewPlayer);
  const playerId = newPlayer.lastID;

  response.send("Player Added to Team");
});
// API 3

app.get("/players/:playerId/", async (request, response) => {
  const { givenPlayerID } = request.params;
  const getPlayerByID = `
        SELECT
         *
        FROM 
            cricket_team
        WHERE
            player_id = ${givenPlayerID} ;

    `;
  const getPlayerInfo = await db.get(getPlayerByID);
  response.send(convertToCamelsace(getPlayerInfo));
});

//API 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updateplayer = `
    UPDATE
        cricket_team
    SET
        player_name = "Jai",
        jersey_number = 9,
        role = "batter"
    WHERE
        player_id = 1
  `;
  const getDetails = await db.run(updateplayer);
  response.send("Player Details Updated");
});

//API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `
        DELETE FROM
            cricket_team
        WHERE 
            player_id = ${playerId};
    `;
  await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
