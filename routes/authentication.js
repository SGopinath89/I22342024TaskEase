const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//middleware to check if the user is authenticated
function isAuthenticated(req, res, next){
    if (req.session.user){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

//user registration route
router.get('/register', (req,res) =>{
    res.render('register.ejs');
});
    
router.post('/register', async (req,res,) =>{
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
router.get('/login', (req,res) =>{
    res.render('login.ejs');
});
    
router.post('/login', async (req,res) =>{
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
router.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;