import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: 0 },
    userLoans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
    deleteFlag: { type: Number, default: 0 }
})

userSchema.pre("save", async function () {

    if (!this.isModified("password")) return;

    try {

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {

        console.error("Error hashing password:", error);
        return error;
    }
});

userSchema.methods.comparePassord = async function (candidatePassword: string) {

    try {
    
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {

        console.error("Error comparing password:", error);
        throw error;
    }
}


export const User = mongoose.model('User', userSchema, "userCollection");