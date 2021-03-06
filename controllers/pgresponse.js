const Transaction = require('../database/models/transaction');
const crypto = require('crypto');
const count = 1;
const axios = require('axios');

module.exports = async (req, res) => {
    var status = req.body.status;
    var txnid = req.session.txnid;
    var amount = req.body.amount;
    console.log(amount);

    console.log("txn id : " + txnid);
    console.log(req.body);
    var resHash = '7ctJ9wxP' + '|' + status + '|||||||||||' + req.session.email + '|' + req.session.firstName + '|' + req.session.productinfo + '|' + amount + '|' + txnid + '|' + 'grKS7G';
    var data;

    for (i = 0; i < count; i++) {
        var hash = crypto.createHash('sha512');
        hash.update(resHash)
        data = hash.digest('hex')
    }

    console.log(data)


    if (data != req.body.hash) {
        status = "Fail"
    }

    Transaction.findOne({ txnid }, (err, txn) => {
        if (txn) {
            console.log(txn);
            Transaction.findByIdAndUpdate({ _id: txn._id }, {

                status: status,
                cardnum: req.body.cardnum,
                phone: req.body.phone,
                mihpayid: req.body.mihpayid,
                addedon: req.body.addedon,
                transaction_error: req.body.error_Message

            },
                async (error, success) => {
                    if (success) {
                        const transactions = await Transaction.find({ productinfo: 'Recharge' })
                        if (status == 'success') {
                            if (req.session.mode == 'topup') {
                                req.flash('success', 'Your transaction is Successfull')
                                res.redirect('/topUp')
                            }
                            else {
                                console.log("recharge entry")
                                axios.get(`https://joloapi.com/api/v1/recharge.php?userid=wepays&key=199806557641007&operator=${req.session.operator}&service=${req.body.phone}&amount=${Math.round(amount)}&orderid=${req.body.tnx_id}`)
                                    .then(function (response) {
                                        // handle success
                                        console.log(response.data);
                                        Transaction.findByIdAndUpdate({ _id: txn._id }, {
                                            recharge_status: response.data.status,
                                            recharge_error: response.data.error
                                        })
                                        if (response.data.status == 'SUCCESS') {
                                            req.flash('rec_success', response.data.status)
                                            res.redirect('/recharge')
                                        }

                                        else {
                                            req.flash('rec_fail', response.data.error)
                                            res.redirect('/recharge')
                                        }
                                    })
                                    .catch(function (error) {
                                        // handle error
                                        console.log(error);
                                        req.flash('Error', 'Your recharge is ')
                                        res.redirect('/topUp')
                                    })
                                    .finally(function () {
                                        // always executed
                                    });
                            }
                        }
                        else {
                            req.flash('failed', 'Your transaction is Failed')
                            res.redirect('/topUp')
                        }
                    }
                })
        }

    })

}