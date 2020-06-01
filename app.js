var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const { Client } = require("pg");

var app = express();

const client = new Client({
  connectionString:
    process.env.DB_CONN || "postgres:postgres@127.0.0.1/postgres",
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

client.connect();

app.get("/music", async (req, res) => {
  const email = req.cookies.email;
  const response = await client.query(
    "select * from playlist where email = $1",
    [email]
  );
  res.json(response.rows);
});

app.post("/music", async (req, res) => {
  const email = req.cookies.email;
  await client.query(
    "INSERT into playlist(email, name, date, genre) values($1, $2, $3, $4)",
    [email, req.body.name, req.body.date, req.body.genre]
  );
  res.json({ ok: true });
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  res.cookie("email", email);

  var response = await client.query("select * from users where email = $1", [
    email,
  ]);
  if (response.rows.length == "0") {
    await client.query("INSERT into users values($1)", [email]);
  }

  res.json({
    email: req.body.email,
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
