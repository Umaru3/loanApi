import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amountPaid: { type: Number, required: true },
  amountRemaining: { type: Number, required: true }
}, { _id: false });

const loanSchema = new mongoose.Schema({
    principal: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    interestRate: { type: Number, required: true, default: 0.05 },
    interestAmount: { type: Number, required: true },
    amountRemaining: { type: Number, required: true },
    penalty: { type: Number, required: true, default: 0 },
    loanPaymentList: [paymentSchema] 
});

export const Loan = mongoose.model('Loan', loanSchema, "loanCollection");