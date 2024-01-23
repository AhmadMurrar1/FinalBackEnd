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
        default:[],
        validate: {
            validator: function (value) {
                return new Set(value).size === value.length;
            },
            message: 'List of games must have unique values',
        },
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
