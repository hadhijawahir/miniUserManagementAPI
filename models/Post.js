const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

//Create Schema
const PostSchema = new Schema({
    postId:{
        type: String,
        default: shortid.generate,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    categoryId:{
        type: String,
        required: true
    },
    remarks:{
        type: String,
        required: true
    },
    publish:{
        type: Boolean,
        required: true
    },
    createdTime:{
        type: Date,
        default: Date.now
    },
    updatedTime:{
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);