// gameSchema.js
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
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (value) {
                // Validate password complexity
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return passwordRegex.test(value);
            },
            message:
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@ $ ! % * ? &)',
        }
    },
    price: {
        type: Number, 
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

const Game = mongoose.model('Gameo', gameSchema);
export default Game;
