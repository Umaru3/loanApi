import { Loan } from '../models/loanModel';
import { User } from '../models/userModel';

export const loanCalculation = async (principal: number | string, startDate: string | Date, endDate: string | Date) => {
  try {
    const principalNum = typeof principal === "string" ? Number(principal) : principal;
    const start = typeof startDate === "string" ? new Date(startDate) : startDate;
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;

    const msInYear = 365 * 24 * 60 * 60 * 1000;
    const durationInYears = (end.getTime() - start.getTime()) / msInYear;
    const interest = principalNum * 0.05 * durationInYears;

    let penalty = 0;
    const dateNow = new Date();
    if (dateNow > end) {
      const overdueDurationInYears = (dateNow.getTime() - end.getTime()) / msInYear;
      penalty = principalNum * 0.1 * overdueDurationInYears;
    }

    return { 
      principal: principalNum, 
      interest, 
      penalty, 
      datePaid: dateNow,
      totalDue: principalNum + interest + penalty 
    };
  } catch (error) {
    console.error('Error calculating loan:', error);
    throw error;
  }
};

export const createLoan = async (data: { userId: string, principal: number; startDate: Date; endDate: Date, interestRate?: number }) => {
  try {
    const msInYear = 365 * 24 * 60 * 60 * 1000;
    const durationInYears = (data.endDate.getTime() - data.startDate.getTime()) / msInYear;
    const rate = data.interestRate ?? 0.05;
    const interestAmount = data.principal * rate * durationInYears;
    
    let penalty = 0;
    const now = new Date();
    if (now > data.endDate) {
      const overdueDurationInYears = (now.getTime() - data.endDate.getTime()) / msInYear;
      penalty = data.principal * 0.1 * overdueDurationInYears;
    }

    const amountRemaining = data.principal + interestAmount + penalty;
    
    const loan = await Loan.create({
        principal: data.principal,
        startDate: data.startDate,
        endDate: data.endDate,
        interestRate: rate,
        interestAmount : interestAmount,
        penalty,
        amountRemaining,
        loanPaymentList: []
    });

    await User.findByIdAndUpdate(
      data.userId,
      { $push: { userLoans: loan._id } },
      { new: true }
    );

    return loan;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
};

export const loanPay = async (loanId: string, amountPaid: number) => {
  try {
    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error("Loan not found");

    const msInYear = 365 * 24 * 60 * 60 * 1000;
    let penalty = 0;
    const now = new Date();
    if (now > loan.endDate) {
      const overdueDurationInYears = (now.getTime() - loan.endDate.getTime()) / msInYear;
      penalty = loan.principal * 0.1 * overdueDurationInYears;
    }

    const newRemaining = Math.max(loan.amountRemaining - amountPaid, 0);

    loan.loanPaymentList.push({
      date: now,
      amountPaid,
      amountRemaining: newRemaining
    });

    loan.amountRemaining = newRemaining;
    loan.penalty = penalty;

    await loan.save();
    return loan;
  } catch (error) {
    console.error("Error processing loan payment:", error);
    throw error;
  }
};

export const getLoanById = async (loanId: string) => {
  try {
    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error("Loan not found");
    return loan;
  } catch (error) {
      console.error("Error fetching loan by ID:", error);
      throw error;
  }
}

export const getLoansByUserId = async (userId: string) => {
  try {
    const user = await User.findById(userId).populate('userLoans');
    if (!user) throw new Error("User not found");
    return user.userLoans;
  } catch (error) {
    console.error("Error fetching loans by user ID:", error);
    throw error;
  }
}