import { Secret, verify } from "jsonwebtoken";
import { Request } from "express";

export const isAuth = (req: Request) => {
    const authorization = req.headers['authorization'];
    if(!authorization)throw new Error("you need to login");
    const token = authorization.split(' ')[1];
    const userid  = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret)
    return userid;

}