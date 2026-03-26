import { Request, Response } from 'express';
import { loanCalculation, createLoan, loanPay, getLoanById, getLoansByUserId } from '../Services/loanServices';

export const loanCalculationController = async (req: Request, res: Response) => {
    try{
        const { principal, startDate, endDate } = req.body as { principal: number; startDate: Date; endDate: Date };
        const loan = await loanCalculation(principal, startDate, endDate);
        res.status(200).json(loan);
    } catch (error) {
       res.status(500).json({ message: "Server error", error: error });
    }
}

export const createLoanController = async (req: Request, res: Response) => {
    try {
        const { userId, principal, startDate, endDate } = req.body as { userId: string; principal: number; startDate: Date; endDate: Date };
        const loan = await createLoan({ 
            userId, 
            principal: Number(principal),
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });
        res.status(201).json({ message: "Loan created successfully", loan });
    } catch (error) {
       res.status(500).json({ message: "Server error", error: error });
    }
}

export const loanPayController = async (req: Request, res: Response) => {
    try {
        const { loanId, amountPaid } = req.body as { loanId: string; amountPaid: number };
        const updatedLoan = await loanPay(loanId, amountPaid);
        res.status(200).json({ message: "Payment successful", updatedLoan });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
}

export const getLoanByIdController = async (req: Request, res: Response) => {
    try {
        const loanId = req.body.id as string;
        const loan = await getLoanById(loanId);
        res.status(200).json(loan);
    }   catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
}

export const getLoansByUserIdController = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId as string;
        const loans = await getLoansByUserId(userId);
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
}