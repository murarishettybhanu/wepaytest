const User = require('../database/models/User')
const Transaction = require('../database/models/transaction')

module.exports = async (req, res) => {
  const users = await User.findById(req.session.userId).populate('author');
  const transactions = await Transaction.find({}).sort({ createAt: -1 });
  res.render('transactions', {
    users, transactions
  })
}
