const User = require('../database/models/User');
const Transaction = require('../database/models/transaction');


module.exports = async (req, res) => {
    const users = await User.findById(req.session.userId).populate('author');
    const transactions = await Transaction.find({productinfo: 'Recharge' });
    var txnid = req.session.txnid;
    var amount = req.session.amount;
    res.render('toupUp',{
        users,transactions,txnid,amount
    })
  }