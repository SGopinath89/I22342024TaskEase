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
// Root route handling
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/tasks'); // Redirect to Todo page if authenticated
    } else {
        res.redirect('/login'); // Redirect to login page if not authenticated
    }
});

//CRUD(Create)
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

//CRUD(Read)
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
//Fetch task details for the modal
router.get('/tasks/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const task = await TodoTask.findById(id);
        res.json(task);
    } catch (err) {
        res.status(400).send('Error fetching task');
    }
});

//UPDATE method
router.post('/tasks/:id', isAuthenticated, async (req,res) =>
{
    const {id} = req.params;
    const { title, description, dueDate, priority, completed } = req.body;
    try
    {
        await TodoTask.findByIdAndUpdate(id,{title, description, dueDate, priority, completed: completed === 'true' });
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