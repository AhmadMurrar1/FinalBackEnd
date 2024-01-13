import { isValidObjectId } from 'mongoose';
import Game from '../model/gameSchema.js';

export async function getAllGames(req, res, next) {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        next(error);
    }
}

export async function getAGameById(req, res, next) {
    try {
        const { id } = req.params;
        const game = await Game.findById(id);
        res.json(game);
    } catch (error) {
        next(error);
    }
}

export async function updateGame(req, res, next) {
    try {
        const { id } = req.params;
        const { name, listOfGames, email, password, price, url } = req.body;

        const existingGame = await Game.findOne({ name, _id: { $ne: id } });

        if (existingGame) {
            res.status(409).send(`A game with the same name already exists: ${name}`);
            return;
        }

        const updatedGame = await Game.findByIdAndUpdate(
            id,
            { name, listOfGames, email, password, price, url },
            { new: true, runValidators: true }
        );

        res.json(updatedGame);
    } catch (error) {
        next(error);
    }
}

export async function deleteGame(req, res, next) {
    const { id } = req.params;
    try {
        const game = await Game.findByIdAndDelete(id);

        if (!game) {
            res.status(404).send('Game not found');
            return;
        }

        res.send(game);
    } catch (error) {
        next(error);
    }
}

export async function createGame(req, res, next) {
    const { name, listOfGames, email, password, price, url } = req.body;

    console.log('Received request body:', req.body);

    if (!name || !Array.isArray(listOfGames) || listOfGames.length === 0 || !email || !password || !price || !url) {
        res.status(400).send('All fields are required');
        return;
    }

    try {
        const existingGame = await Game.findOne({ name });

        if (existingGame) {
            res.status(409).send(`A game with the same name already exists: ${existingGame.name}`);
            return;
        }

        const newGame = await Game.create({
            name,
            listOfGames,
            email,
            password,
            price,
            url,
        });

        res.status(201).send(newGame);
    } catch (error) {
        console.error('Error in createGame controller:', error);
        next(error);
    }
}
