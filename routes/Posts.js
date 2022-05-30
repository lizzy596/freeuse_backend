const express = require('express')
const router = express.Router()
const { getAllPosts, getPost, createPost, getPostsBySearch, getPost2,  deletePost, updatePost } = require('../controllers/Posts')
const auth = require('../middleware/Auth')








router.get('/search', getPostsBySearch )
router.get('/', getAllPosts);
router.post('/', auth, createPost);
router.get('/:id', getPost2)
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);




module.exports = router