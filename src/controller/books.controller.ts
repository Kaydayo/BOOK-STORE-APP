import express, {Request, Response, NextFunction, json} from 'express';
import { readFile, writeFile, author } from '../utils/utils';
import { generateIdsForBooks, validateEntry } from '../utils/utils';
import { isAuth } from '../isAuth';


const control = express()

export const getAllAuthors = (req:Request, res:Response, next: NextFunction)=>{
    try {
    const userid = isAuth(req);
    if(userid !== null){
        const data = readFile();
        res.status(200).json({message:`${data.length} authors retrieved successfully`,data: data})
    }
  } catch (err: any) {
    res.send({
      error: `${err.message}`
    })
  }
    
}

export const getAuthor = (req: Request, res: Response, next:NextFunction)=>{
    const data = readFile();
    const authorData = data.find((item: author)=> `${item.id}` === req.params.id);
    if(!authorData){
        return res.status(404).json({message: `author with the id ${req.params.id} cannot be found`})
    }
    res.status(200).json({message:`author with id ${req.params.id} found`, data:authorData})
} 

export const postAuthors = (req: Request, res: Response, next: NextFunction)=>{
    const { error } = validateEntry(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }else{
        const data = readFile();
        const newAuthor = {...req.body, books: generateIdsForBooks(req.body.books)} //dont understand
        const newData = {id: data.length + 1, dateRegistered:new Date().getTime(), ...newAuthor};
    
        const allNewData = [...data, newData];
    
        writeFile(allNewData);
    
        res.status(201).json({message: "creates new Author", data: newData})
    }
   
}

export const updateAuthor = (req: Request, res:Response, _next:NextFunction) => {
    const data = readFile();
    const dataToUpdate = data.find((item: {item:author, id:number}) => `${item.id}` === req.params.id)
    if(!dataToUpdate){
        return res.status(404).json({message: `author with id: ${req.params.id} does not exist`})
    }
    const newData = {...dataToUpdate, ...req.body};
    const dataIndex = data.findIndex((item:{id:number}) => `${item.id}` === req.params.id)
    data.splice(dataIndex, 1, newData);
    writeFile(data);
    res.status(201).json({message: `author with id ${req.params.id} updated successfully`, data:newData})
}

export const deleteAuthor = (req:Request, res:Response, _next: NextFunction) => {
    const data = readFile();
    const foundAuthor = data.find((elem:author) => `${elem.id}` === req.params.id)
    if(!foundAuthor){
        return res.status(404).json({message:`author with id ${req.params.id} does not exist`})
        
    }
    const newAuthors = data.filter((item: author)=> `${item.id}` !== req.params.id)
    writeFile(newAuthors);
    res.status(201).json({message:`author deleted successfully`})
}

export const postBook = (req: Request, res: Response, _next: NextFunction) => {
    const data = readFile();
    let authorFind = data.find(((item: { item: author, id: number }) => `${item.id}` === req.params.id));
    let authorIndex = data.findIndex(((item: { item: author, id: number }) => `${item.id}` === req.params.id))
    if (!authorFind) {
        return res.status(404).json({ message: "author does not exist" })
    }
    authorFind = {
        ...authorFind,
        books: [...authorFind.books, { id: `book${authorFind.books.length + 1}`, ...req.body }]
    }
    const newData = data.splice(authorIndex, 1, authorFind)
    writeFile(data)
    res.status(201).json({ message: "new book added", author: authorFind })
}

export const deleteBook = (req:Request, res:Response, next:NextFunction) =>{
    const data = readFile();
    const authorFind = data.find((item: {item:author, id: number})=> `${item.id}` === req.params.id); 
    if(!authorFind){ 
    return res.status(404).json({message: `author with the id ${req.params.id} does not exist`})  
    } 
    const bookToDelete = authorFind.books.find((item: {item:author, id: number})=> {
        return `${item.id}` === req.params.bookId;
    })
    if(!bookToDelete){ 
    return res.status(404).json({message: `book with the id ${req.params.bookId} does not exist`})
}
    const dataIndex = authorFind.books.findIndex((item: { item: author, id: number }) => `${item.id}` === req.params.bookId);
    authorFind.books.splice(dataIndex, 1);
    writeFile(data);
    res.status(200).json({ message: `Book with the id ${req.params.bookId} has been trashed` })
}


export const getABook = (req: Request, res: Response, next:NextFunction)=>{
    const data = readFile();
    const authorData = data.find((item: author)=> `${item.id}` === req.params.id);  
    if(!authorData){  
    return res.status(404).json({message: `author with the id ${req.params.authorId} not found`})  
    } 
    const bookData = authorData.books.find((item:author) => `${item.id}` === req.params.bookId)
    if(!bookData){
        return res.status(404).json({message: `book with the id ${req.params.bookId} not found`})
    }
    res.status(200).json({mesaage: "success", data: bookData})
}

