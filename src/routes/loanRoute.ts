import { Router } from 'express';
import { loanCalculationController, createLoanController, loanPayController } from '../controllers/loanController';
const router = Router();

router.post('/calculate', loanCalculationController);
router.post('/create', createLoanController);
router.post('/pay', loanPayController);

export default router;