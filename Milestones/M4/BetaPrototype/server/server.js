// Keep dotenv's path as `./config/development.env` when testing on our local databases, but
// change this to `./config/production.env` just before we push our application to the remote server.
require("dotenv").config({ path: "./config/production.env" });

const express = require("express");
const path = require("path");
const app = express();
const database = require("./config/dbConfig");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mySqlSession = require("express-mysql-session")(session);
const port = process.env.EXPRESS_PORT;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

// creates a session store with the table name `session`
const mySqlSessionStore = new mySqlSession({ schema: { tableName: "session" } }, database);

// contains the session settings
app.use(
    session({
        secret: "csc_648_swe", // used to sign the session cookie
        store: mySqlSessionStore, // the session store instance
        name: "session_id", // name of the session ID cookie
        cookie: { maxAge: 2592000000 }, // log in session will expire in 30 days
        resave: true,
        saveUninitialized: false,
    })
);

// have Express's private files accessible only to people with moderator permissions
app.use("/private", express.static(path.join(__dirname, "private")));

// have Express's public files be freely accessible to the front end
app.use("/public", express.static(path.join(__dirname, "public")));

/* The API routes between the front and back end. */
app.use("/api/", require("./routes/index"));
app.use("/api/direct-messages", require("./routes/directMessages"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/listings", require("./routes/listings"));
app.use("/api/threads", require("./routes/threads"));
app.use("/api/users", require("./routes/users"));

app.listen(port, () => console.log(`The Express server is listening on port ${port}.`));

module.exports = app;