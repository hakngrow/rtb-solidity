var express = require('express')
var router = express.Router()

var User = require('../models/User')
var Campaign = require('../models/Campaign')

router.use(function timeLog (req, res, next) {
    console.log('Now: ', new Date().toString())
    next()
})

async function getCampaignsForUser(userId) {

    
}

router.get('/', function (req, res) {

    console.log('AUCTION GET')

    User.find({}).lean().exec((err, docs) => {
 
        res.render('auction', {
            page: {
                title: 'Auction',
                users: docs
            }
        })
    })
})

router.post('/campaigns', async function (req, res) {

    var userId = req.body.userId

    User.findOne({user_id: userId}).lean().exec((err, user) => {
        
        if (err)
            console.log(err)
        else {

            Campaign.find({}).lean().exec((err, docs) => {

                var campaigns = []

                docs.forEach(campaign => {

                    console.log(campaign.name)
                    console.log('gender ' + campaign.targetGender.includes(user.gender))
                    console.log('age ' + (user.age >= campaign.targetAgeLower && user.age <= campaign.targetAgeUpper))
                    
                    if (campaign.targetGender.includes(user.gender) &&
                        (user.age >= campaign.targetAgeLower && user.age <= campaign.targetAgeUpper)) {

                        console.log('user tags ' + user.tags)
                        console.log('cam tags ' + campaign.targetTags)

                        user.tags.forEach(userTag => {
                            campaign.targetTags.forEach(camTag => {

                                console.log('userTag ' + userTag + ', camTag ' + camTag + ', ' + (userTag == camTag))

                                if (userTag == camTag) {

                                    console.log(campaign.name + ' selected')

                                    campaigns.push(campaign)
                                }
                            })
                        })
                    }
                })

                console.log(campaigns.length)

                res.render('auction-campaigns', {
                    page: {
                        title: 'Bidding Campaigns',
                        campaigns: campaigns
                    }
                })
            })
        }
    })
})

module.exports = router