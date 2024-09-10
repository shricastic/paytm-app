const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Account = require('../models/AccountSchema')
const {authMiddleware} = require('../middlewares/authMiddleware')

router.get('/balance', authMiddleware, async (req, res)=> {
  const userid = req.userid;
  
  const account = await Account.findOne({userid});

  if(!account){
    return res.json({message: "Cannot fetch balance for this account"});
  }

  res.json({balance: account.balance});
})

router.post('/transfer', authMiddleware, async (req, res)=> {
  const session = await mongoose.startSession();

  session.startTransaction();

  const {amount, to} = req.body;

  const account = await Account.findOne({userid : req.userid}).session(session);

  if(!account || account.balance < amount){
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance"
    });
  }

  const toAccount = await Account.findOne({ userid: to}).session(session);

  if(!toAccount){
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid Account"
    })
  }

  await Account.updateOne({userid: req.userId}, {$inc: {balance: -amount}}).session(session);
  await Account.updateOne({userid: to}, {$inc: {balance: amount}}).session(session);


  await session.commitTransaction();

  res.json({
    message: "transfer successful"
  });
})


module.exports = router;
