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

app.get("/movies/", async (request, resolve) => {
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
