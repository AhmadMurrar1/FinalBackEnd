// gameRoutes.js
import { Router } from 'express';
import {
    createGame,
    deleteGame,
    getAGameById,
    getAllGames,
    updateGame,
} from '../controllers/gameController.js';

const router = Router();

router.post('/create', createGame);
router.get('/games', getAllGames);
router.get('/games/:id', getAGameById);
router.put('/games/:id', updateGame);
router.delete('/games/:id', deleteGame);

export default router;
