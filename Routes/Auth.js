import { Router } from "express";
import { signIn } from "./../Controllers/auth.js";
import User from "../Models/user.js";
import jwt from 'jsonwebtoken';

const AuthRouter = Router();

AuthRouter.post('/signin', signIn);
AuthRouter.get('/verifyToken', async (req, res)=>{
    try {
        const Authorization = req.headers.authorization;
        if (Authorization) {
            const token = Authorization.split(" ")[1];
            const secretKey = process.env.JWT_SECRET;
            const verificationResponse = jwt.verify(token, secretKey);
            const userId = verificationResponse._id;
            const foundUser = await User.findOne({ _id: userId });
            if (foundUser) {
                if (foundUser.role != 1) {
                    return res.status(403).json({
                        error: "You don't have the right permissions to access that page.",
                      });
                }
                res.status(200).json(foundUser);
            } else {
                res.status(401).json({
                    error: "Wrong authentication token",
                });
            }
        } else {
            res.status(404).json({
            error: "Authentication token missing",
            });
        }
    } catch (error) {
      res.status(401).json({
        error: "Wrong authentication token",
      });
    }
});

export default AuthRouter