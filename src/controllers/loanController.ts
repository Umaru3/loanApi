import { Request, Response } from 'express';
import { loanCalculation } from '../Services/loanServices';

export const loanCalculationController = async (req: Request, res: Response) => {
    try{
        console.log('Calculating loan with data:', req.body);
    } catch (error) {
        console.error('Error calculating loan:', error);
        throw error;
    }
}