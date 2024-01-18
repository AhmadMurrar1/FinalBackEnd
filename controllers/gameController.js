import Game from '../model/gameSchema.js';
import User from "../model/userSchema.js";
import mongoose from 'mongoose';

export async function getAllGames(req, res, next) {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        next(error);
    }
}

export async function gameAds(req, res, next) {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        next(error);
    }
}

export async function gameGiveaway(req, res, next) {
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



export async function purchaseGame(req, res, next) {
    const { id } = req.params;
    const { userId } = req.body;

    let user = await User.findById(userId);
    let game = await Game.findById(id);
    console.log('User:', user);
    console.log('Game:', game);

    try {
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        if (!game) {
            res.status(404).send('Game not found');
            return;
        }

        const totalPrice = game.price;

        // Check if the user has enough cash or credits to make the purchase
        if (totalPrice > user.cash + user.credits) {
            res.status(400).send("Insufficient funds");
            return;
        }

        // Deduct the amount from the user's cash and/or credits
        if (totalPrice <= user.cash) {
            user.cash -= totalPrice;
        } else {
            const remainingCash = totalPrice - user.cash;
            user.cash = 0;
            user.credits -= remainingCash; // Deduct remaining from credits
        }

        // Update the game's purchase information
        game.purchasedBy = userId;

        // Update the user's listOfGames with the game ID
        user.listOfGames = user.listOfGames || [];
        user.listOfGames.push(game.name);

        // Save changes
        await user.save();
        await game.save();

        res.json({ user, purchasedGame: game });
    } catch (error) {
        console.error('Purchase failed:', error.message);
        res.status(500).send('Purchase failed');
    }
}

export async function refundGame(req, res, next) {
    const { id } = req.params;
    const { userId } = req.body;

    let user = await User.findById(userId);

    try {
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        const game = await Game.findById(id).select('name price');

        // Ensure that the game was actually purchased by the user
        if (!user.listOfGames.includes(game.name)) {
            res.status(400).send('Game not purchased by the specified user');
            return;
        }

        const refundAmount = game.price;

        // Refund the amount to the user's credits
        user.credits += refundAmount;

        // Remove the game from the user's list of games
        user.listOfGames = user.listOfGames.filter(gameName => gameName !== game.name);

        // Save changes
        await user.save();

        // Optionally, you can return information about the refunded game or the user
        res.json({ user, refundedGame: game });
    } catch (error) {
        console.error('Refund failed:', error.message);
        res.status(500).send('Refund failed');
    }
}

export const findGamesByNames = async (req, res, next) => {
    try {
        const gameNames = req.body.names; // Expect an array of game names
        const games = await Game.find({ name: { $in: gameNames } });

        if (!games.length) {
            return res.status(404).json({ message: 'No games found' });
        }
        res.status(200).json(games);
    } catch (error) {
        next(error);
    }
};
