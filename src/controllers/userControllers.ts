import { Request, Response } from "express";
import { loginUser, registerUser } from "../Services/userServices";

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body as { email: string; password: string; username: string };
    const identifier = email || username;
    const result = await loginUser(identifier, password);
    res.json(result);
  }  catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }
}

export const registerUserController = async (req: Request, res: Response) => {
    try{
        const username = req.body.username;
        const result = await registerUser(req.body);

        if (typeof result === "string") {
            return res.status(400).json({ message: result });
        }
        res.json({ "isSuccess": true, "userCreated": username });
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};