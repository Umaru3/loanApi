import { User } from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

//loginUser
export const loginUser = async (identifier: string, password: string) => {
  try {
    if(!identifier || !password) {
      return "Missing required fields required.";
    }
    
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }], deleteFlag: 0 });
    if (!user) { return "User not found."; }

    const isMatch = await comparePassword(password, user?.password || "");
    if(!isMatch) {return "Invalid password.";}

    const token = jwt.sign(
      {id: user._id, email: user.email, username: user.username}, 
      JWT_SECRET, 
      { expiresIn: "1h" });

    return { message: "Successfully logged in.", username: user.username, token };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

//registerUser
export const registerUser = async (data: { username: string; email: string; password: string }) => {
  try {
    const emailRegex = /.+\@.+\..+/;
    const existingUser = await User.findOne({ username: data.username });
    const existingEmail = await User.findOne({ email: data.email });

    //basic checks
    if (!data) {
      return "Missing data";
    } else if (!data.username) {
      return "Missing required fields: username is required.";
    } else if (!data.email) {
      return "Missing required fields: email is required.";
    } else if (!data.password) {
      return "Missing required fields: password is required.";
    }
    
    //email format validation
    if (!emailRegex.test(data.email)) {
      return "Invalid email format.";
    }

    //username already exists checker
    if (existingUser && existingUser.username === data.username) {
        console.log("Existing user found:", existingUser);
      return "Username already exists.";
    }

    //email already exists checker
    if (existingEmail && existingEmail.email === data.email) {
      return "Email already exists.";
    }

    return await User.create(data);

  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const comparePassword = async (candidatePassword: string, hashedPassword: string) => {
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
}