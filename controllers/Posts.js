const Post = require('../models/Post')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom-error')
const mongoose = require('mongoose')






const getAllPosts = asyncWrapper(async(req, res) => {
    const { page } = req.query
    const LIMIT = 8;
    const startIndex = (Number(page) -1) * LIMIT //get the starting index of the post for any given page
    const total = await Post.countDocuments({}) //counts all the documents in the db
    //sort by -1 gives the newest posts first
//limit of 8
//skip every post up to the start index

const posts = await Post.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

//const posts = await Post.find();
 res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});

    
//res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});

})




const createPost = asyncWrapper(async(req,res) => {
    const post = req.body
    const newPost = await Post.create({ ...post, creator: req.userId, createdAt: new Date().toISOString() })
    res.status(201).json(newPost)
})





const getPost = asyncWrapper(async (req, res) => {

    const { id } = req.params;
    
    const post = await Post.findById(id)
    res.status(200).json(post)

})


const getPost2 = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    if(!post) {
        return next(createCustomError('Post not found!', 404))
       
      } 
    const item = post.tags.join(',')
    const posts = await Post.find({ tags: { $in: item.split(',') } } ).sort({ _id: -1});
    

    res.status(200).json({ post, posts })
})

const deletePost = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await Post.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
})




const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, description, name, creator, selectedFile, tags, location, contact } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, description, name, location, contact, tags, selectedFile, _id: id };

    await Post.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

 /*const getPostsBySearch = async (req, res) => {
    const { searchQuery, item } = req.query;

    try {

        if(searchQuery == "title") {
            const regex = new RegExp(item, 'i')
            const posts = await Post.find({title: {$regex: regex}})
            res.json({ data: posts })

        } else {
            const posts = await Post.find({ tags: { $in: item.split(',') } } )
            res.json({ data: posts })
        }
      
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
} */




const getPostsBySearch = async (req, res) => {

    
    

    const { searchQuery, item } = req.query;
  
   LIMIT=8;
  

    try {

        if(searchQuery == "title") {
            const regex = new RegExp(item, 'i')
            const posts = await Post.find({title: {$regex: regex}}).sort({ _id: -1});
            const total = posts.length
            res.json({ data: posts, currentPage: Number(1), numberOfPages: Math.ceil(total / LIMIT) })

        } else {
            const posts = await Post.find({ tags: { $in: item.split(',') } } ).sort({ _id: -1});
            const total = posts.length
            res.json({ data: posts, currentPage: Number(1), numberOfPages: Math.ceil(total / LIMIT)  })
        }
      
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}










module.exports = {
    getAllPosts,
    getPost,
    getPost2,
    getPostsBySearch,
    createPost,
    updatePost,
    deletePost
    
}