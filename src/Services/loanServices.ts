import { Loan } from '../models/loanModel';

export const loanCalculation = async (req: Request, res: Response) => {
    try {
        console.log('Calculating loan with data:', req.body);
    } catch (error) {
        console.error('Error calculating loan:', error);
        throw error;
    }
}