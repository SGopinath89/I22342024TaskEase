const express = require("express");
const app = express();
//const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bcrypt = require("bcrypt");

//import models
const User = require("./models/User");
const TodoTask = require("./models/TodoTask");

//dotenv.config();

app.use("/static", express.static("public"));

//middleware
app.use(express.urlencoded({ extended : true }));

//connection to db
mongoose.connect('mongodb://localhost:27017/TaskEase', {
  
})
  .then(() => console.log("Connected to db!"))
  .catch(err => console.error("Could not connect to db", err));
   
const store = new MongoDBStore
    ({
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

//middleware to check if the user is authenticated
function isAuthenticated(req, res, next)
{
    if (req.session.user){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

//user registration route
app.get('/register', (req,res) =>
{
    res.render('register.ejs');
});

app.post('/register', async (req,res,) =>
{
    const { username, password } = req.body;
    try
    {
        const user = new User({ username, password });
        await user.save();
        res.redirect('/login');
    }
    catch(err)
    {
        res.status(500).send("Error registering new user");
    }
});

//user login route
app.get('/login', (req,res) =>
{
    res.render('login.ejs');
});

app.post('/login', async (req,res) =>
{
    const { username, password } = req.body;
    try
    {
        const user = await User.findOne({ username });
        if(!user || !(await user.comparePassword(password))){
            res.status(401).send('Invalid username or password');
        }
        else{
            req.session.user = user;
            res.redirect('/');
        }
    }
    catch(err)
    {
        res.status(500).send('Error logging in')
    }
});

//logout
app.get('/logout', (req,res) => 
{
    req.session.destroy();
    res.redirect('/login');
});

         /* CRUD operations */
//CRUD(Read):To view data in the app
//GET method
app.get('/', isAuthenticated, async (req,res) => 
    {
        try
        {
            const tasks = await TodoTask.find({});
            res.render("todo.ejs", { todoTasks: tasks });
        }
        catch(err)
        {
            res.status(500).json({ error: err});
        }
    });

//CRUD(Create):To view data in the database>collection(TaskEase>todoTasks)
//POST method
app.post('/', isAuthenticated, async(req,res) =>
{
    const todoTask = new TodoTask
    ({
        content: req.body.content
    });
    try
    {
        await todoTask.save();
        res.redirect("/");
    }
    catch(err)
    {
        res.redirect("/");
    }
});

//CRUD(Update)
//UPDATE method
app
.route("/edit/:id")
.get(isAuthenticated, async (req,res) =>
{
    try
    {
        const id = req.params.id;
        const tasks = await TodoTask.find({});
        res.render("todoEdit.ejs", {todoTasks: tasks, idTask: id});
    }
    catch(err)
    {
        res.status(500).json({ error: err});
    }
})
.post(isAuthenticated, async (req,res) =>
{
    try
    {
        const id = req.params.id;
        await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
        res.redirect("/");
    }
    catch(err)
    {
        res.status(500).json({ error: err});
    }
});

//CRUD(Delete)
//DELETE method
app.route("/remove/:id").get(isAuthenticated, async (req,res) =>
{
    try
    {
        const id = req.params.id;
        await TodoTask.findByIdAndDelete(id);
        res.redirect("/");
    }
    catch(err)
    {
        res.status(500).json({ error: err });
    }
});

const PORT = process.env.PORT || 1071;
app.listen(PORT, () => console.log(`Server Up and running on port ${PORT}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    } else {
      console.error(`Error starting server: ${err}`);
    }
  });
