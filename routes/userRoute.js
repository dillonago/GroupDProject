const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation, deleteValidation} = require('../validation')


router.get('/', (req, res) =>  res.sendFile(process.cwd()+'/views/profile.html'));
router.get('/playdates', (req, res) =>  res.sendFile(process.cwd()+'/views/playdates.html'));

router.post('/register', async (req, res) => {
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the db.
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //Create new user.
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        zip: req.body.zip
    });

    try{
        const savedUser = await user.save();
        res.redirect('/');
        //res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }

});

/*
router.post('/like_user', async (req, res) => {
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the db.
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //Create new user.
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }

});
*/

//Delete
router.post('/delete', async (req,res) => {
    const {error} = deleteValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found.');

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Deleting user
    User.findOneAndRemove({email: req.body.email}, function(err) {
        if(!err) {
            res.send("User deleted.");
        }
        else {
            res.status(400).send('Error');
        }
    });
});

let refreshTokens = [];

//Refresh token
router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.status(400).send("Refresh token not found.");
    if(!refreshTokens.includes(refreshToken)) return res.status.send("Wrong token");
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(400).send("Error in verification");
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '30s'});
        res.json({accessToken: token});
    })
});

//Edit profile
//router.post('/edit_profile', async (req, res) => { 
//});

//Sign out route
router.delete('/logout', async (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.status(400).send("token deleted.");
});


//Login
router.post('/login', async (req,res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found.');

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '30s'});
    const refreshToken = jwt.sign({_id: user._id}, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    //res.json({token: token, refreshToken: refreshToken});
    res.redirect('/user');
 
    
});


module.exports = router;
