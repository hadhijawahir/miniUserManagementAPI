const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shortid = require('shortid');

//Create Schema
const UserSchema = new Schema({
    userId:{
        type: String,
        default: shortid.generate,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }, 
    firstName:{
        type: String,
        required: true
    }, 
    lastName:{
        type: String,
        required: true
    }, 
    email:{
        type: String,
        required: true
    }, 
    avatar:{
        type: String
    },
    enableFlag:{
        type: Boolean,
        required: true
    },
    userLevel:{
        type: String,
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

module.exports = User = mongoose.model('users', UserSchema);