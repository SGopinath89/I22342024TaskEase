const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const PORT = 1070;

//import routes
const authenticationRoutes = require("./routes/authentication");
const tasksRoutes = require("./routes/tasks");

// Middleware to serve static files
app.use("/static", express.static("public"));

//middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//connection to MongoDB
mongoose
  .connect("mongodb://localhost:27017/TaskEase")
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error:", err);
  });

// Session store configuration
const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/TaskEase",
  collection: "session",
});

store.on("error", function (error) {
  console.error("Session store error", error);
});

app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//view engine configuration
app.set("view engine", "ejs");

//use routes
app.use("/", authenticationRoutes);
app.use("/", tasksRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
