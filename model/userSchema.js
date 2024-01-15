import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,

        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: 6, 
    },cash:{
        type:Number,
        default: 0
    },
    credits:{
        type: Number,
        default: 0
    },
    listOfGames: {
        type: [String],
        default: []
    }
});

const User = mongoose.model('Usero', userSchema);

export default User;
