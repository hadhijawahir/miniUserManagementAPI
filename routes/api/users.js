const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load User Model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Test users route
// @access  Public
router.get('/test', (req,res) => res.json({msg: "Users Works"}));


// @route   GET api/users/new
// @desc    Register a user
// @access  Public
router.post('/new', (req, res) => {
    User.findOne({ username: req.body.username })
    .then(user => {
        if(user){
            res.status(400).json({username: "Username already exists"});
        }
        else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', //Size
                r: 'pg', //Rating
                d: 'mm' //Default
            })
            const newUser = new User({
                title: req.body.title,
                email: req.body.email,
                username: req.body.username,
                avatar,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                enableFlag: req.body.enableFlag,
                userLevel: req.body.userLevel
            });
            
            //Encrypting Password
            bcrypt.genSalt(10, (err, salt) =>{
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    })
});


// @route   GET api/users/login
// @desc    Login User / Return JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Find user by username
    User.findOne({username})
        .then(user => {
            // Check for user
            if(!user){
                return res.status(404).json({username : 'User not found'});
            }

            // Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch){
                        // User Matched
                        
                        // Create JWT Payload
                        const payload = { id: user.id, userId: user.userId, username: user.username, avatar: user.avatar }

                        //Sign Token
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer' + token
                                });
                            }); 
                    }
                    else {
                        return res.status(404).json({password : 'Password incorrect'});
                    }
                })
        });
});


// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    //res.json({msg: 'Success'});
    //res.json(req.user);
    res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
    });
});


// @route   GET api/users/:id
// @desc    Get user by id
// @access  Public
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(404).json({nouserfound:'No user found with that ID'}));
});


// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', (req, res) => {
    User.find()
    .sort({ date: -1})
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ nousersfound:'No Users found' }));
});



// @route   GET api/users/logout
// @desc    Logout user
// @access  Public
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


module.exports = router;