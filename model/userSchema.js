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

        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
        , 'Please enter a valid email address']
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
        validate: {
            validator: function(value) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long'
        }
    },
    cash:{
        type:Number,
        default: 0
    },
    credits:{
        type: Number,
        default: 150
    },
    listOfGames: {
        type: [String],
        default: []
    }, cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gameo' 
    }]
});

const User = mongoose.model('Usero', userSchema);

export default User;
