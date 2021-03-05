var express = require('express')
var router = express.Router()

var User = require('../models/user')

router.use(function timeLog (req, res, next) {
   console.log('Now: ', new Date().toString())
   next()
 })

router.get('/', function (req, res) {

   console.log('USERS GET')

   User.find({}).lean().exec((err, docs) => {

      res.render('users', {
         page: {
             title: 'Users',
             model: 'User',
             showNewBtn: true,
             newBtnUrl: '/users/new',
             users: docs
         }
     })
   })
})

router.get('/new', function(req, res) {

   console.log('USERS NEW')

   res.render('user-new', {
      page: {
         title: 'New User',
         showNewBtn: false,
         loadImageScripts: true
      }
   })
})

router.post('/create', function(req, res) {
   
   var userId = req.body.userId
   var userName = req.body.name
   var userAge = req.body.age
   var userGender = req.body.gender
   var userTags = req.body.tags.toLowerCase().split(', ')
   var userPicture = req.body.base64.split(',')[1]

   console.log('USERS CREATE: ' + userId + ' ' + userName + ' ' + userAge + ' ' + userGender + ' ' + userTags)

   User.create({
      user_id: userId, 
      name: userName, 
      age: userAge, 
      gender: userGender, 
      tags: userTags, 
      picture: userPicture}, (err, doc) => {

         if (err) {
            console.log(err.message)
         }
         else {

            console.log('USERS CREATE: Success!')

            res.redirect('/users');
         }
   })
})

router.get('/delete/:userId', function (req, res) {
   
   console.log('USERS DELETE: ' + req.params.userId)

   User.findOne({user_id: req.params.userId}).lean().exec((err, doc) => {

      res.render('user-delete', {
         page: {
            title: 'Delete User',
            showNewBtn: false,
            user: doc
         }
      })
   })
})

router.post('/remove/:userId', function(req, res) {

   var userId = req.params.userId

   console.log('USERS REMOVE: ' + userId)

   User.deleteOne({user_id: userId}, (err, doc) => {
      if (err) {
         console.log(err.message)
      }
      else {

         console.log('USERS REMOVE: Success!')

         res.redirect('/users');
      }
   })
})

router.get('/edit/:userId', function(req, res) {

   console.log('USERS EDIT')

   User.findOne({user_id: req.params.userId}).lean().exec((err, doc) => {

      res.render('user-edit', {
         page: {
            title: 'Edit User',
            showNewBtn: false,
            loadImageScripts: true,
            user: doc
         }
      })
   })
})

router.post('/update/:userId', function(req, res) {

   var userId = req.params.userId
   var userName = req.body.name
   var userAge = req.body.age
   var userGender = req.body.gender
   var userTags = req.body.tags.toLowerCase().split(', ')
   var userPicture = req.body.base64.split(',')[1]
   
   console.log('USERS UPDATE: ' + userId + ' ' + userName + ' ' + userAge + ' ' + userGender + ' ' + userTags)

   User.updateOne({user_id: userId}, {name: userName, age: userAge, gender: userGender, tags: userTags, picture: userPicture}, (err, doc) => {
      if (err) {
         console.log(err.message)
      }
      else {

         console.log('USERS UPDATE: Success!')

         res.redirect('/users');
      }
   })
})

module.exports = router;