import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    listOfGames: {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                // Validate that the array elements are unique
                return new Set(value).size === value.length;
            },
            message: 'List of games must have unique values',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                // Validate email format using a regular expression
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // Minimum length of the password
        validate: {
            validator: function (value) {
                // Validate password complexity (e.g., at least one uppercase letter, one lowercase letter, and one digit)
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
                return passwordRegex.test(value);
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit',
        },
    },
    price: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

const Game = mongoose.model('Gameo', gameSchema);
export default Game;
