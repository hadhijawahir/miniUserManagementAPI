const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

// @route   GET api/posts/test
// @desc    Test posts route
// @access  Public
router.get('/test', (req,res) => res.json({msg: "Posts Works"}));


// @route   GET api/posts
// @desc    Get post
// @access  Public
router.get('/', (req, res) => {
    Post.find()
    .sort({ date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostfound:'No posts found'}));

});


// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({nopostfound:'No post found with that ID'}));
});


// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const newPost = new Post({
        postId: req.body.postId,
        title: req.body.title,
        content: req.body.content,
        remarks: req.body.remarks,
        publish: req.body.publish,
        categoryId: req.body.categoryId
    });

    newPost.save().then(post => res.json(post));
});

module.exports = router;