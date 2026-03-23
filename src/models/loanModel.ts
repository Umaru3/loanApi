import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
    principal: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    interestRate: { type: Number, required: true },
});

export const Loan = mongoose.model('Loan', loanSchema, "loanCollection");