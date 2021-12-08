import express from 'express';
import { getAllAuthors, postAuthors, updateAuthor, getAuthor , deleteAuthor, postBook, deleteBook, getABook } from '../controller/books.controller';
const router = express.Router();

router.get('/', getAllAuthors)
router.get('/:id', getAuthor)
router.post('/', postAuthors);
router.put('/:id', updateAuthor)
router.delete('/:id', deleteAuthor)
router.post('/:id', postBook)
router.delete('/:id/:bookId', deleteBook)
router.get('/:id/:bookId', getABook)




  
export default router;