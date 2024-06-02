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
//CRUD(Create):To view data in the database>collection(TaskEase>todoTasks)
//POST method
router.post('/tasks', isAuthenticated, async(req,res) =>{
    const{ title, description, dueDate, priority } = req.body;
    try
    {
        const task = new TodoTask({ userId: req.session.user._id, title, description, dueDate, priority });
        await task.save();
        res.redirect("/tasks");
    }
    catch(err)
    {
        res.status(500).json({ error: err});
    }
});

//CRUD(Read):To view data in the app
//GET method
router.get('/tasks', isAuthenticated, async (req,res) => {
    try
    {
        const tasks = await TodoTask.find({ userId: req.session.user._id });
        res.render('todo', { tasks });
    }
    catch(err)
    {
         res.status(500).json({ error: err});
    }
});

//CRUD(Update)
//UPDATE method
router.post('/tasks/:id', isAuthenticated, async (req,res) =>
{
    const {id} = req.params;
    const { title, description, dueDate, priority, completed } = req.body;
    try
    {
        await TodoTask.findByIdAndUpdate(id,{title, description, dueDate, priority, completed });
        res.redirect('/tasks');
    }
    catch(err)
    {
        res.status(500).json({ error: err});
    }
});

//CRUD(Delete)
//DELETE method
router.post('/tasks/:id/delete',isAuthenticated, async (req,res) =>
{
    const{ id } =  req.params;
    try
    {
        await TodoTask.findByIdAndDelete(id);
        res.redirect("/tasks");
    }
    catch(err)
    {
        res.status(500).json({ error: err });
    }
});

module.exports = router;