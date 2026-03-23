import { Router } from 'express';
import { loanCalculationController } from '../controllers/loanController';
const router = Router();

router.post('/calculate', loanCalculationController);

export default router;