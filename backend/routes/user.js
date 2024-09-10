const express = require('express')
const router = express.Router()
const User = require('../models/UserSchema')
const Account = require('../models/AccountSchema')
const jwt = require('jsonwebtoken')
const {signUpSchema, signInSchema, updateSchema} = require('../middlewares/dataValidator')
const { authMiddleware } = require('../middlewares/authMiddleware')

const JWT_SECRET = process.env.JWT_SECRET;

router.get('/signup', (req, res) => {
  res.json({message: "valid api user"})
})

router.post("/signup", async (req, res) => {
  const {success} =signUpSchema.safeParse(req.body);

  if(!success){
    return res.json({message: "User already exists/invalid Input"})
  }

  const user = await User.findOne({username: req.body.username}) 
  
  if(user){
    return res.json({message: "user aleady exist"})
  }

  const newUser = await User.create(req.body);
  const token = jwt.sign({userid: newUser._id}, JWT_SECRET);

  await Account.create({
    userid: newUser._id,
    balance: 100 
  });

  res.json({
    message: "user created successfully",
    token: token
  })
})

router.post("/signin", async(req, res)=>{
  const {success} = signInSchema.safeParse(req.body);

  if(!success){
    return res.status(411).json({message: "Invalid inputs"})
  }

  const user = await User.findOne({userid: req.body.userid, password: req.body.password});
  
  if(!user){
    return res.status(411).json({message: "User does not exist"});
  }

  const token = jwt.sign({userid: user._id}, JWT_SECRET);
  res.json({token: token});
})


router.get('/bulk', async(req, res) =>{
  const filter = req.query.filter || "";

  const users = await User.find({
    $or:[
      {
        firstname: {
          "$regex": filter
        }
      },
      {
        lastname: {
          "$regex": filter
        }
      }
    ]
  })
  
  res.json({
    user: users.map(user => ({
      username: user.username,
      firstnam: user.firstname,
      lastname: user.lastname,
      _id: user._id
    }))
  })

})

router.put('/', authMiddleware, async (req, res) =>{
  const {success} = updateSchema.safeParse(req.body) 

  if(!success){
    res.status(411).json({
      message: "Error while updating information"
    })
  }

  await User.updateOne(req.body, {
    id: req.userid
  })

  res.json({
    message: "Updated successfully"
  })
})

module.exports = router;
