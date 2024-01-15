// gameRoutes.js
import { Router } from 'express';
import {
    createGame,
    deleteGame,
    gameAds,
    gameGiveaway,
    getAGameById,
    getAllGames,
    purchaseGame,
    refundGame,
    updateGame,
} from '../controllers/gameController.js';

const router = Router();

router.post('/create', createGame);
router.get('/games', getAllGames);
router.get('/:id', getAGameById);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);
router.get('/adds', gameAds);
router.get('/giveaway', gameGiveaway);
router.post('/:id/purchase', purchaseGame);
router.post('/refund/:id', refundGame);

export default router;
