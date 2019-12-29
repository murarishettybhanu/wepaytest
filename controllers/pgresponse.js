const Transaction = require('../database/models/transaction');
const crypto = require('crypto');
const count = 1;



module.exports = async (req,res) =>{
    var status = req.body.status;
    var txnid = req.session.txnid;
    var amount = req.body.amount;
    
    console.log("txn id : "+txnid);
    console.log(req.body);
    var resHash = '7ctJ9wxP'+'|'+status+'|||||||||||'+req.session.email+'|'+req.session.firstName+'|'+'Recharge'+'|'+amount+'|'+txnid+'|'+'grKS7G';
    var data;

    for(i=0;i<count;i++){
        var hash = crypto.createHash('sha512');
        hash.update(resHash)
        data = hash.digest('hex')
    }

    console.log(data)
    

    if(data != req.body.hash){
        status = "Fail"
    }

    Transaction.findOne({ txnid },(err,txn)=>{
        if(txn){
            console.log(txn);
             Transaction.findByIdAndUpdate({_id :txn._id},{
            
                status:status,
                cardnum:req.body.cardnum,
                phone:req.body.phone,
                mihpayid:req.body.mihpayid,
                addedon:req.body.addedon,

            }, 
            async (error,success)=>{
                if(success){
                    const transactions = await Transaction.find({productinfo: 'Recharge' })
                    if(status == 'success'){
                        req.flash('success','Your transaction is Successfull')
                        res.redirect('/topUp' )
                    }
                    else{
                        req.flash('failed','Your transaction is Failed')
                        res.redirect('/topUp')
                    }
                }
            })
        }

    })

        
        // ({

            
        // },async(error,success)=>{
        //     if(success){
        //         const transactions = await Transaction.find({productinfo: 'Recharge' })
        //         if(status == 'success'){
        //             req.flash('success','Your transaction is Successfull')
        //             res.render('toupUp',{txnid,transactions,amount})
        //         }
        //         else{
        //             req.flash('failed','Your transaction is Failed')
        //             res.render('toupUp',{txnid,transactions,amount})
        //             console.log(error)
        //         }
        //     }
        // })
    
}