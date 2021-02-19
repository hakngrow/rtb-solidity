var express = require('express')
var router = express.Router()

var Company = require('../models/Company')
var RTBWeb3 = require('../helpers/RTBWeb3')

router.use(function timeLog (req, res, next) {
    console.log('Now: ', new Date().toString())
    next()
})

router.get('/info', function (req, res) {

    console.log('CROWDSALE INFO')

    var bcSymbol
    var bcRate
    var bcDecimals

    RTBWeb3.getBidCoinSymbol().then(symbol => {

            bcSymbol = symbol

            RTBWeb3.getBidCoinRate().then(rate => {
                
                bcRate = rate

                RTBWeb3.getBidCoinDecimals().then(decimals => {

                    bcDecimals = decimals

                    res.render('bidcoin-info', {
                        page: {
                        title: 'BidCoin Information',
                        showNewBtn: false,
                        symbol: bcSymbol,
                        decimals: bcDecimals,
                        rate: bcRate,
                        timezone: 'UTC'
                        }
                    })
                })
            })
        })
        .catch(err=>{console.log(err)})
})

router.get('/balances', function (req, res) {

    console.log('CROWDSALE BALANCES')

    Company.find({}).lean().exec((err, docs) => {
        if (err) {
            console.log(err.message)
        }
        else {

            var addresses = []
        
            docs.forEach(company => addresses.push(company.address))

            RTBWeb3.getBidCoinBalances(addresses)
                .then(balances => {

                    for (i = 0; i < docs.length; i++) {
                        docs[i].balance = balances[i].substring(0, balances[i].length - 9)
                    }

                    res.render('bidcoin-balances', {
                        page: {
                        title: 'BidCoin Balances',
                        showNewBtn: false,
                        companies: docs
                        }
                    })
                })
                .catch(err=>{console.log(err)})
        }
    })


})

router.get('/purchase', function (req, res) {

    console.log('CROWDSALE PURCHASE')

    Company.find({}).lean().exec((err, docs) => {
        if (err) {
            console.log(err.message)
        }
        else {

            res.render('bidcoin-purchase', {
                page: {
                    title: 'BidCoin Purchase',
                    showNewBtn: false,
                    companies: docs
                }
            })
        }
    })
})

router.post('/buy', function(req, res) {
   
    var bcCoyId = req.body.coyId
    var bcUnits = req.body.units

    Company.findOne({coy_id: bcCoyId}).lean().exec((err, doc) => {
        if (err) {
            console.log(err.message)
        }
        else {

            RTBWeb3.buyBidCoins(doc.address, bcUnits)
                .catch(err=>console.log(err))

            res.redirect('/');
        }
    })
})


module.exports = router