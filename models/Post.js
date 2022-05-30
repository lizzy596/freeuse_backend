const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: [true, 'must provide title'],
        trim: true,
        maxlength: [20, 'name cannot exceed 20 characters']

    },
    description: {
        type: String,
        required: [true, 'must provide a description'],
    },
    name: { 
        
            type: String,
            required: [true, 'must provide a name'],
        
    },
    location: { 
        
        type: String,
        required: [true, 'must provide a location'],
    
},
    creator: String,
    contact: { 
        type:String,
        required: [true, 'must provide contact information'],
    },
    tags: [{
        type: String,
        trim: true
    }],
    selectedFile: String,
    //selectedFile: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    
})

module.exports = mongoose.model('Post', PostSchema)