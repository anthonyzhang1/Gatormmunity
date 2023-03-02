/* This file holds the configuration settings for our Express back end. */

/* For development on your local computer, use the path: "./config/development.env"
 * For deployment on the remote server, use the path: "./config/production.env" */
require("dotenv").config({ path: "./config/production.env" });

const express = require("express");
const path = require("path");
const app = express();
const database = require("./config/dbConfig");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mySqlSession = require("express-mysql-session")(session);
const { moderatorValidation } = require("./middleware/userValidation");
const port = process.env.EXPRESS_PORT;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // maximum request body size
app.use(cookieParser());

/** The MySQL session store with the table name `session`. */
const mySqlSessionStore = new mySqlSession({ schema: { tableName: "session" } }, database);

/* Contains the session settings. */
app.use(
    session({
        secret: process.env.MYSQL_SESSION_SECRET, // used to sign the session cookie
        store: mySqlSessionStore, // the session store instance
        name: "session_id", // name of the session ID cookie
        cookie: { maxAge: 2592000000 }, // login session will expire in 30 days
        resave: true,
        saveUninitialized: false
    })
);

// have Express's private files accessible only to people with moderator permissions
app.use("/private", moderatorValidation, express.static(path.join(__dirname, "private")));

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