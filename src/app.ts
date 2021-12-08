import createError, {HttpError} from 'http-errors';
import express, {Response, Request, NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import authorsRouter from './routes/authors' 
import cors from 'cors';
import {hash, compare} from 'bcryptjs';
import {Secret, verify} from 'jsonwebtoken';
import 'dotenv/config';
import { readDB, writeDB, users } from './utils/utils';
import { v4 as uuidv4 }  from 'uuid';
import { createAccessToken, createRefreshToken , sendAccessToken, sendRefreshToken } from './token';
import { isAuth } from './isAuth'




import indexRouter from './routes/index';
import usersRouter from './routes/users';

export const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');


app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authors', authorsRouter);


// register enpoint needs refactoring!!!
app.post('/register', async (req:Request, res: Response, next: NextFunction)=> {
  const {username, password} = await req.body;
  try {
    const data = readDB();
    const user = data.find((users: users) => users.username === username)
    if(user) throw new Error('Username already exist ');
    const hashedpassword = await hash(password, 10)
    
    const newUser  = {
      id: uuidv4(),
      username,
      password: hashedpassword
    }
    data.push(newUser)
   
    writeDB(data)
    res.status(201).json({message: 'Signed up  successfully'})
    
    console.log(newUser)
  } catch (err: any) { 
    res.status(400).json({error: `${err.message}`})
  }
})


app.post("/login", async(req: Request, res: Response, next: NextFunction) => {
  const {username, password} = req.body;

  try{
    const data = readDB()
    const user = data.find((users: users)=> users.username === username)
    const userIndex = data.findIndex((users: users)=> users.username === username)
    if(!user) res.status(401).json({message: 'username does not exist'})
    const valid = await compare(password, user.password);
    if(!valid) res.status(401).json({message: 'incorrect password'})
    const accessToken = createAccessToken(user.id)
    const refreshToken = createRefreshToken(user.id)
    user.refreshToken = refreshToken
    data.splice(userIndex, 1, user)
    writeDB(data)
    console.log(data)
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, req, accessToken)
    

  }catch(err: any){
    res.status(500).json({error:`${err.message}`})

  }
})

app.post('/logout', (_req: Request, res: Response, _next: NextFunction)=>{
  res.clearCookie('refreshtoken', {path: '/refresh_token'})
  return res.status(200).json({message: 'logged out successfully'})
})

app.get('/protected', async (req: Request, res: Response, _next: NextFunction)=>{
  try {
    const userid = isAuth(req);
    if(userid !== null){
      res.send({
        data: 'This is protected data '
      })
    }
  } catch (err: any) {
    res.send({
      error: `${err.message}`
    })
  }
})

app.post('/refresh_token', (req: Request, res: Response, _next: NextFunction)=>{
  const token = req.cookies.refreshtoken;
  const data = readDB()
  if(!token)return res.send({accessToken: ''})
  let payload: any;
  try{
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET as Secret)
  }catch(err){
    return res.send({accessToken: ' '})
  }
  const user = data.find((users: users)=> users.id === payload.userid)
  if(!user)return res.send({accessToken: ' '})
  if(user.refreshToken !== token){
    res.send({accessToken: ' '})
  } 
  const accessToken = createAccessToken(user.id)
  const refreshToken = createRefreshToken(user.id)
  user.refreshToken = refreshToken
  sendRefreshToken(res,  refreshToken)
  return res.send({accessToken })

})

// catch 404 and forward to error handler
app.use(function(req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err:HttpError, req:Request, res:Response, next:NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
