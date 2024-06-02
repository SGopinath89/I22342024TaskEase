const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

//import models
const User = require("./models/User");
const TodoTask = require("./models/TodoTask");

//import routes
const authenticationRoutes = require("./routes/authentication");
const tasksRoutes = require("./routes/tasks");

app.use("/static", express.static("public"));

//middleware
app.use(express.urlencoded({ extended : true }));

//connection to db
mongoose.connect('mongodb://localhost:27017/TaskEase',{})
  .then(() => console.log("Connected to db!"))
  .catch(err => console.error("Could not connect to db", err));
   
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/TaskEase',
    collection: 'session'
});

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

//view engine configuration
app.set("view engine", "ejs");

//use routes
app.use("/",authenticationRoutes);
app.use("/",tasksRoutes);

const PORT = process.env.PORT || 1071;
app.listen(PORT, () => console.log(`Server Up and running on port ${PORT}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    } else {
      console.error(`Error starting server: ${err}`);
    }
  });
