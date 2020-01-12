const Transactions = require("../database/models/transaction");
const crypto = require('crypto')

module.exports = async (req, res) => {
    const inp = req.body;
    var key = 'grKS7G'
    var txnid = "WPRC" + Math.floor(Math.random() * (99999999999999 - 1000) + 1000);
    var productinfo = req.body.productinfo;
    var salt = '7ctJ9wxP';
    var hash = key + '|' + txnid + '|' + inp.amount + '|' + productinfo + '|' + inp.firstname + '|' + inp.email + '|' + '||||||||||' + salt;
    var final = crypto.createHash('sha512').update(hash).digest('hex');

    const a = req.body;
    var tn = await Transactions.find({ txnid: txnid });

    if (tn.length > 0) {
        console.log('Tampered');
        req.flash('Tampered', 'Your transaction is Tampered')
        res.redirect('/topUp')
    }
    else {
        Transactions.create({
            txnid: txnid,
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
                req.session.operator = a.operator;
                req.session.mode = a.mode;
                req.session.txnid = txnid;
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
                <input type="hidden" required name="hash" value="${final}" />
                <input type="hidden" required name="curl" value="http://wepays.in/pgresponse" />
                <input type="hidden" required name="furl" value="http://wepays.in/pgresponse" />
                <input type="hidden" required name="txnid" id="txnid" value=${txnid} />
                <input type="hidden" required name="productinfo" value="${a.productinfo}" />
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