const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const path = require("path");
let db = null;
const dbpath = path.join(__dirname, "moviesData.db");
const intializeranddbsever = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("http://localhost:3000 server running at ");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

intializeranddbsever();

app.get("/movies/", async (request, response) => {
  const allmoviesquery = `SELECT * FROM  movie ORDER BY movie_id;`;
  const movies = await db.all(allmoviesquery);
  const ans = (movies) => {
    return {
      movieId: movies.movie_id,
      directorId: movies.director_id,
      movieName: movies.movie_name,
      leadActor: movies.lead_actor,
    };
  };
  response.send(movies.map((eachmovie) => ans(eachmovie)));
});

app.post("/movies/", async (request, response) => {
  const moviedetails = request.body;
  const { directorId, movieName, leadActor } = moviedetails;
  const addmoviequery = `
INSERT INTO movie
(director_id, movie_name, lead_actor)
VALUES(${directorId},
    ${movieName},
    ${leadActor});`;
  const dbresponse = await db.run(addmoviequery);
  const movieId = dbresponse.lastID;
  response.send({ movie_id: movieId });
});

app.get("/movies/:movieId/", async (request, response) => {
  const { specificmovie } = request.params;
  const getperticularmovie = `
    SELECT * FROM movie
    WHERE movie_id =${specificmovie};`;
  const movie = await db.get(getperticularmovie);
  response.send(movie);
});
module.exports = app;
