const express = require("express");
const router = express.Router();
const TodoTask = require("../models/TodoTask");

//middleware to check if the user is authenticated
function isAuthenticated(req, res, next){
    if (req.session.user){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

         /* CRUD operations */
//CRUD(Read):To view data in the app
//GET method
router.get('/', isAuthenticated, async (req,res) => {
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
router.post('/', isAuthenticated, async(req,res) =>{
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
        res.status(500).json({ error: err});
    }
});

//CRUD(Update)
//UPDATE method
router.route("/edit/:id")
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
router.route("/remove/:id").get(isAuthenticated, async (req,res) =>
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

module.exports = router;