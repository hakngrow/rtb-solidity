var express = require('express')
var router = express.Router()

var Campaign = require('../models/Campaign')
var Company = require('../models/Company')

router.use(function timeLog (req, res, next) {
    console.log('Now: ', new Date().toString())
    next()
})

router.get('/', function (req, res) {

   console.log('CAMPAIGNS GET')

   Campaign.find({}).lean().exec((err, docs) => {

      res.render('campaigns', {
         page: {
            title: 'Campaigns',
            model: 'Campaign',
            showNewBtn: true,
            newBtnUrl: '/cpns/new',
            campaigns: docs
         }
      })
   })
})

router.get('/new', function(req, res) {

   console.log('CAMPAIGNS NEW')

   Company.find({type: 'A'}).lean().exec((err, docs) => {

      if (err) {
         console.log(err.message)
      }
      else {

         res.render('campaign-new', {
            page: {
               title: 'New Campaign',
               showNewBtn: false,
               loadImageScripts: true,
               advertisers: docs
            }
         })
      }
   })
})

router.post('/create', function(req, res) {
   
   var camId = req.body.camId
   var camCoyId = req.body.advertiserId
   var camName = req.body.name
   var camAgeLower = req.body.ageLower
   var camAgeUpper = req.body.ageUpper
   var camMale = req.body.genderMale
   var camFemale = req.body.genderFemale
   var camGender = ''
   var camPrice = req.body.price
   var camTags = req.body.tags.toLowerCase().split(', ')
   var camPicture = req.body.base64.split(',')[1]

   if (typeof camMale !== 'undefined') {
      camGender = camMale
   }

   if (typeof camFemale !== 'undefined') {
      camGender.concat(camFemale)
   }

   console.log('COYS CREATE: ' + camId + ' ' + camCoyId + ' ' + camName + ' ' + camAgeLower + ' ' + camAgeUpper + ' ' + 
               camMale + ' ' + camFemale + ' ' + camGender + ' ' + camPrice + ' ' + camTags)

   Campaign.create({
      cam_id: camId, 
      name: camName, 
      coy_id: camCoyId, 
      targetGender: camGender, 
      targetAgeLower: camAgeLower,
      targetAgeUpper: camAgeUpper,
      targetTags: camTags,
      bidPrice: camPrice,
      picture: camPicture}, (err, doc) => {

         if (err) {
            console.log(err.message)
         }
         else {

            console.log('CAMPAIGNS CREATE: Success!')

            res.redirect('/cpns');
         }
   })
})

router.get('/delete/:camId', function (req, res) {
   
   console.log('CAMPAIGNS DELETE: ' + req.params.camId)

   Campaign.findOne({cam_id: req.params.camId}).lean().exec((err, cpn) => {

      Company.findOne({coy_id: cpn.coy_id}, 'name', (err, coy) => {
         if (err) {
            console.log(err.message)
         }
         else {

            res.render('campaign-delete', {
               page: {
                  title: 'Delete Campaign',
                  showNewBtn: false,
                  advertiserName: coy.name,
                  checkMale: cpn.targetGender.indexOf('M') !== -1,
                  checkFemale: cpn.targetGender.indexOf('F') !== -1,
                  campaign: cpn
               }
            })

         }
      })
   })
})

router.post('/remove/:camId', function(req, res) {

   var camId = req.params.camId

   console.log('CAMPAIGNS REMOVE: ' + camId)

   Campaign.deleteOne({cam_id: camId}, (err, doc) => {
      if (err) {
         console.log(err.message)
      }
      else {

         console.log('CAMPAIGNS REMOVE: Success!')

         res.redirect('/cpns');
      }
   })
})

router.get('/edit/:camId', function(req, res) {

   console.log('CAMPAIGNS EDIT')

   Campaign.findOne({cam_id: req.params.camId}).lean().exec((err, cpn) => {

      Company.find({type: 'A'}).lean().exec((err, docs) => {

         if (err) {
            console.log(err.message)
         }
         else {

            res.render('campaign-edit', {
               page: {
                  title: 'Edit Campaign',
                  showNewBtn: false,
                  loadImageScripts: true,
                  checkMale: cpn.targetGender.indexOf('M') !== -1,
                  checkFemale: cpn.targetGender.indexOf('F') !== -1,
                  campaign: cpn,
                  advertisers : docs
               }
            })

         }
      })
   })
})

router.post('/update/:camId', function(req, res) {

   var camId = req.params.camId
   var camCoyId = req.body.advertiserId
   var camName = req.body.name
   var camAgeLower = req.body.ageLower
   var camAgeUpper = req.body.ageUpper
   var camMale = req.body.genderMale
   var camFemale = req.body.genderFemale
   var camGender = ''
   var camPrice = req.body.price
   var camTags = req.body.tags.toLowerCase().split(', ')
   var camPicture = req.body.base64.split(',')[1]

   if (typeof camMale !== 'undefined') {
      camGender = camMale
   }

   if (typeof camFemale !== 'undefined') {
      camGender = camGender + camFemale
   }
   
   console.log('COYS UPDATE: ' + camId + ' ' + camCoyId + ' ' + camName + ' ' + camAgeLower + ' ' + camAgeUpper + ' ' + 
               camMale + ' ' + camFemale + ' ' + camGender + ' ' + camPrice + ' ' + camTags)

   Campaign.updateOne(
      {cam_id: camId},
      { 
         name: camName, 
         coy_id: camCoyId, 
         targetGender: camGender, 
         targetAgeLower: camAgeLower,
         targetAgeUpper: camAgeUpper,
         targetTags: camTags, 
         bidPrice: camPrice,
         picture: camPicture
      }, (err, doc) => {

         if (err) {
            console.log(err.message)
         }
         else {

            console.log('CAMPAIGNS UPDATE: Success!')

            res.redirect('/cpns');
         }
      })
})

module.exports = router