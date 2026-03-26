import { Router } from 'express';
import { loanCalculationController, createLoanController, loanPayController, getLoanByIdController, getLoansByUserIdController } from '../controllers/loanController';
const router = Router();

router.post('/calculate', loanCalculationController);
router.post('/create', createLoanController);
router.post('/pay', loanPayController);
router.post('/fetch-loans-id', getLoanByIdController);
router.post('/fetch-loans-userId', getLoansByUserIdController);

export default router;