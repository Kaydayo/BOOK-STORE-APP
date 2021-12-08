import { Secret, sign } from 'jsonwebtoken' ;
import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
dotenv.config()


export const createAccessToken = (userid: string) => {
    return sign({userid}, process.env.ACCESS_TOKEN_SECRET as Secret, {
        expiresIn: '5s'
    })
}


export const createRefreshToken = (userid: string) => {
    return sign({userid}, process.env.REFRESH_TOKEN_SECRET as Secret, {
        expiresIn: '7d'
    })
}

export const sendAccessToken = (res: Response, req: Request, accesstoken: any) => {
    return res.json({
        accesstoken,
        username: req.body.username
    })
    
}

export const sendRefreshToken = (res: Response, refreshToken: any)=>{
    return res.cookie('refreshtoken', refreshToken , {
        httpOnly: true,
        path: '/refresh_token'
    })

}

