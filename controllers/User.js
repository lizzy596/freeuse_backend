const User = require('../models/User')
const {createCustomError} = require('../errors/custom-error')
const asyncWrapper = require('../middleware/async')




const Login = asyncWrapper(async (req, res) => {

 
    const { email, password } = req.body
    if(!email || !password ) {
        return res.status(404).json({ message: "Provide Email and Password" });
    }

    try {

        const user = await User.findOne({ email })
        //compare password
      
        if(!user) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }
      
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }
      
      
        const token = user.createJWT()
        res.status(200).json({ result: user,  token})






        
    } catch (error) {

        res.status(500).json({ message: "Something went wrong" });
        
    }
  

  
  
  
   })
  


   const Register = asyncWrapper(async (req, res, next) => {


    const { email, password, confirmPassword, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });

        if(existingUser) {
        return next(createCustomError('DUM DUM DUM', 400))
       
      }

      if(password !== confirmPassword) {
          return next(createCustomError('TEE TEE TEE', 400))
      }


      const result = await User.create({ ...req.body, name: `${firstName} ${lastName}`  })
        const token = result.createJWT()
        res.status(201).json({ result, token });

   })




   /*const Register = asyncWrapper (async (req, res, next) => {

    const { email, password, confirmPassword, firstName, lastName } = req.body;


    try {

        const existingUser= await User.findOne({ email });
        
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match"});


        const result = await User.create({ ...req.body, name: `${firstName} ${lastName}`  })
        const token = result.createJWT()
        res.status(201).json({ result, token });
        
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    
        console.log(error);
    }




   
    }) */





module.exports = {
    Register,
    Login
}