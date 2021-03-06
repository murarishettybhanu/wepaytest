const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  status: {
    type: String,
  },
  recharge_status: {
    type: String
  },
  transaction_error: {
    type: String
  },
  recharge_error: {
    type: String
  },
  txnid: {
    type: String,
  },
  amount: {
    type: String,
  },
  cardnum: {
    type: String,
  },
  firstname: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  mihpayid: {
    type: String,
  },
  addedon: {
    type: String,
  },
  productinfo: {
    type: String,
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Transactions', TransactionSchema)
