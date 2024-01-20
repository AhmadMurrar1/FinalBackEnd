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
    },
    password: {
        type: String,
        required: true,
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
