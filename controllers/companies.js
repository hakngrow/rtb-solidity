var express = require('express')
var router = express.Router()

var Company = require('../models/Company')

router.use(function timeLog (req, res, next) {
    console.log('Now: ', new Date().toString())
    next()
})

router.get('/', function (req, res) {

   console.log('COYS GET')

   Company.find({}).lean().exec((err, docs) => {

      res.render('companies', {
         page: {
            title: 'Companies',
            model: 'Company',
            showNewBtn: true,
            newBtnUrl: '/coys/new',
            companies: docs
         }
      })
   })
})

router.get('/new', function(req, res) {

   console.log('COYS NEW')

   res.render('company-new', {
      page: {
         title: 'New Company',
         showNewBtn: false
      }
   })
})

router.post('/create', function(req, res) {
   
   var coyId = req.body.coyId
   var coyName = req.body.name
   var coyType = req.body.type
   var coyAddress = req.body.address

   console.log('COYS CREATE: ' + coyId + ' ' + coyName + ' ' + coyType + ' ' + coyAddress)

   Company.create({coy_id: coyId, name: coyName, type: coyType, address: coyAddress}, (err, doc) => {
      if (err) {
         console.log(err.message)
      }
      else {

         console.log('COYS CREATE: Success!')

         res.redirect('/coys');
      }
   })
})

router.get('/delete/:coyId', function (req, res) {
   
   console.log('COYS DELETE: ' + req.params.coyId)

   Company.findOne({coy_id: req.params.coyId}).lean().exec((err, doc) => {

      res.render('company-delete', {
         page: {
            title: 'Delete Company',
            showNewBtn: false,
            company: doc
         }
      })
   })
})

router.post('/remove/:coyId', function(req, res) {

   var coyId = req.params.coyId

   console.log('COYS REMOVE: ' + coyId)

   Company.deleteOne({coy_id: coyId}, (err, doc) => {
      if (err) {
         console.log(err.message)
      }
      else {

         console.log('COYS REMOVE: Success!')

         res.redirect('/coys');
      }
   })
})

router.get('/edit/:coyId', function(req, res) {

   console.log('COYS EDIT')

   Company.findOne({coy_id: req.params.coyId}).lean().exec((err, doc) => {

      res.render('company-edit', {
         page: {
            title: 'Edit Company',
            showNewBtn: false,
            company: doc
         }
      })
   })
})

router.post('/update/:coyId', function(req, res) {

   var coyId = req.params.coyId
   var coyName = req.body.name
   var coyType = req.body.type
   var coyAddress = req.body.address
   
   console.log('COYS UPDATE: ' + coyId + ' ' + coyName + ' ' + coyType + ' ' + coyAddress)

   Company.updateOne({coy_id: coyId}, {name: coyName, type: coyType, address: coyAddress}, (err, doc) => {
      if (err) {
         console.log(err.message)
      }
      else {

         console.log('COYS UPDATE: Success!')

         res.redirect('/coys');
      }
   })
})

module.exports = router