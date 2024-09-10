const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
  userid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
});

const Account = mongoose.model("Account", AccountSchema);
module.exports = Account;
