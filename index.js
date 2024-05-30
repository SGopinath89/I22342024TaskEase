const express = require("express");
const app = express();
//const dotenv = require("dotenv");
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

//dotenv.config();

app.use("/static", express.static("public"));

//middleware
app.use(express.urlencoded({ extended : true }));

//connection to db
mongoose.connect('mongodb://localhost:27017/TaskEase') 
{
    console.log("Connected to db!");

    app.listen(2000, () => console.log("Server Up and running"));
}

//view engine configuration
app.set("view engine", "ejs");


          /* CRUD operations */
//CRUD(Create):To view data in the database>collection(TaskEase>todoTasks)
//POST method
app.post('/',async(req,res) =>
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

//CRUD(Read):To view data in the app
//GET method
app.get('/',async (req,res) => 
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

//CRUD(Update)
//UPDATE method
app
.route("/edit/:id")
.get(async (req,res) =>
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
.post(async (req,res) =>
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
app.route("/remove/:id").get(async (req,res) =>
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