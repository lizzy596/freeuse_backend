const dotenv = require("dotenv");
dotenv.config();
const express = require('express')
const app = express()
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet")
const xss = require('xss-clean')



const cors = require('cors')
const connectDB = require('./db/connect')
const port = process.env.PORT || 3001
const bodyParser = require('body-parser');
const postRoutes = require('./routes/Posts')
const authRoutes = require('./routes/User')
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')






app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(mongoSanitize());
app.use(helmet());
app.use(cors());
app.use(xss());



app.get('/', (req, res) => {
  res.send('freeuse app')
})

app.use('/user', authRoutes)
app.use('/posts', postRoutes)
app.use(notFound)
app.use(errorHandlerMiddleware)



const start = async () => {
    try {
   
     await connectDB(process.env.MONGO_URI)
     app.listen(port, () => {
       console.log(`Example app listening at http://localhost:${port}`)
     })
      
    } catch (error) {
      console.log(error)
      
    }
   }
   
   
   start()











