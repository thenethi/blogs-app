const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const cors=require("cors");

const app = express();
app.use(cors())
app.use(express.json())

const dbPath = path.join(__dirname, "blogs.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(8153, () => {
      console.log("Server Running at http://localhost:8153/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Gives all responses
app.get("/blogs/", async (request, response) => {
    const getBlogsArray = `
    select blogs.id as id,blogs.name as name,blogs.image as image,description.description as description, details.author as author,details.date as date from (blogs inner join description on blogs.id=description.id) as T inner join details on T.id=details.id;`;
    const blogsArray = await db.all(getBlogsArray);
    response.send(blogsArray);
});