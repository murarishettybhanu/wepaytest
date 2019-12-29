const Transactions = require("../database/models/transaction");
var request = require('request');
const axios = require('axios');

module.exports = async (req, res) => {
    const transactions = await Transactions.find({ productinfo: 'Recharge' })
    const a = req.body;
    var tn = await Transactions.find({ txnid: a.txnid });
    const url = "https://test.payu.in/_payment";
    const data = a;
    if (tn.length > 0) {
        console.log('Tampered');
        req.flash('Tampered', 'Your transaction is Tampered')
        res.redirect('/topUp')
    }
    else {
        Transactions.create({
            txnid: a.txnid,
            productinfo: a.productinfo,
            firstname: a.firstname,
            email: a.email,
            amount: a.amount,
            status: 'Pending'
        }, (err, done) => {
            if (err) {
                res.redirect('/topUp');
            }
            else {
                req.session.txnid = a.txnid;
                req.session.amount = a.amount;
                req.session.email = a.email;
                req.session.firstName = a.firstname;
                req.session.productinfo = a.productinfo
                res.end(`
        <!doctype html>
        <html>
        <style>
            .loader {
            border: 16px solid #f3f3f3;
            border-radius: 50%;
            border-top: 16px solid #3498db;
            width: 120px;
            height: 120px;
            -webkit-animation: spin 2s linear infinite; /* Safari */
            animation: spin 2s linear infinite;
            }

            /* Safari */
            @-webkit-keyframes spin {
             0% { -webkit-transform: rotate(0deg); }
             100% { -webkit-transform: rotate(360deg); }
            }

            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }
        </style>
        <body onload=idealUser() >
        <div class="loader"></div>
            <form id="myForm" action="https://secure.payu.in/_payment" method="post">
                <input type="hidden" required class="form-control" name="amount" id="amount"placeholder="Amount" value=${a.amount}>
                <input type="hidden" required name="firstname" value="${a.firstname}" />
                <input type="hidden"  name="lastname" value="" />
                <input type="hidden" required name="surl" value="http://wepays.in/pgresponse" />
                <input type="hidden" required name="phone" value= "${a.mobileNumber}" />
                <input type="hidden" required name="key" value="grKS7G" />
                <input type="hidden" required name="hash" value="${a.hash}" />
                <input type="hidden" required name="curl" value="http://wepays.in/pgresponse" />
                <input type="hidden" required name="furl" value="http://wepays.in/pgresponse" />
                <input type="hidden" required name="txnid" id="txnid" value=${a.txnid} />
                <input type="hidden" required name="productinfo" value="Recharge" />
                <input type="hidden" required name="email" value=${a.email} />
            </form>
        </body>
        <script>
        function idealUser(){
            console.log("I am started")
            setTimeout(function(){
            checkform();
            },5000);
           }
        function checkform() {
            console.log("I am submiting")
                document.getElementById('myForm').submit();
            }
        </script>
        </html>
    `);
                // axios.post('https://test.payu.in/_payment', {
                //      a
                // })
                //     .then((res) => {
                //         console.log(`statusCode: ${res.statusCode}`)
                //         console.log(res)
                //     })
                //     .catch((error) => {
                //         console.error(error)
                //     })
                //     request.post({ url: 'https://test.payu.in/_payment', formData: a }, function optionalCallback(err, httpResponse, body) {
                //         if (err) {
                //             console.log(a)
                //             return console.error('upload failed:', err);

                //         }
                //         console.log(httpResponse);
                //         console.log('Upload successful!  Server responded with:', body);
                //    });
                //res.redirect('/topUp')
            }
        })


    }
}