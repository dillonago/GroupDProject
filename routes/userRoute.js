const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../middleware/authMiddleware');

const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation, deleteValidation/*, likeValidation*/} = require('../validation')

//user profile page
router.get('/', requireAuth, (req, res) =>  {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    var userId = decoded.id;
    console.log(userId);
    // Fetch the user by id
    User.findOne({ _id: userId }).then((user) => {
        if(user) {
            res.render('profile', { user });
        }
    });
});

//user playdates page
router.get('/playdates', (req, res) =>  res.sendFile(process.cwd()+'/views/playdates.html'));

//creating a token used for the user in the current session
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {expiresIn: maxAge});
}

//register a user
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
        const token = createToken(savedUser._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect('/');
        //res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }

});

//like a user
router.post('/like_user', async (req, res) => {
    //const {error} = likeValidation(req.body);
    //if(error) return res.status(400).send(error.details[0].message);

    res.send('like_user');

    //If there exists a matching 'like' add the like to the existing entry


    //If no existing 'like' create new like entry
    /*
    const like = new Like({
        user_1: req.body.user_1,
        user_2: req.body.user_2,
        response: req.body.response
    });
    try{
        const savedLike = await like.save();
        res.send({user: like._id});
    }catch(err){
        res.status(400).send(err);
    }
    */

});


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

//Edit profile
router.post('/edit_profile', requireAuth, async (req, res) => { 
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    var userId = decoded.id;
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        User.findOneAndUpdate({_id: userId}, {$set:{password: hashedPassword}}, {new: true}, (err, doc) => {
            if(err){
                console.log("Something went wrong");
            }
            console.log("Pass updated");
        });
    }
    if(req.body.name){
        User.findOneAndUpdate({_id: userId}, {$set:{name: req.body.name}}, {new: true}, (err, doc) => {
            if(err){
                console.log("Something went wrong");
            }
            console.log("Name updated");
        });
    }
    if(req.body.email){
        User.findOneAndUpdate({_id: userId}, {$set: {email: req.body.email}}, {new: true}, (err, doc) => {
            if(err){
                console.log("Something went wrong");
            }
            console.log("Email updated.");
        });
    }
    if(req.body.phone){
        User.findOneAndUpdate({_id: userId}, {$set:{phone: req.body.phone}}, {new: true}, (err, doc) => {
            if(err){
                console.log("Something went wrong");
            }
            console.log("Phone updated");
        });

    }
    if(req.body.zip){
        User.findOneAndUpdate({_id: userId}, {$set:{zip: req.body.zip}}, {new: true}, (err, doc) => {
            if(err){
                console.log("Something went wrong");
            }
            console.log("ZIP updated");
        });
    }


});

//Login
router.post('/login', async (req,res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        console.log(user._id);
        res.redirect('/user');
    }
    catch (err) {
        res.status(400).json({});
    }
});


//Log out
router.get('/logout', async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
});


module.exports = router;
