require('dotenv').config()

var path = require('path');


// ExpressJS configuration

const hostname = process.env.HOST
const port = process.env.PORT

const express = require('express');
const bodyParser = require('body-parser');

const app = express()

// for parsing application/json
app.use(bodyParser.json({limit: '50mb'})); 

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 

app.use(express.static('public'));




// Mongoose configuration

const mg_url = process.env.DB_URL

const mongoose = require('mongoose')

mongoose.connect(mg_url, { useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

db.once('open', _ => {
  console.log('Database connected:', mg_url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

app.use(function(req, res, next) {

  req.db = db
  next()
})



// Handlebars template engine configuration

const exphbs = require('express-handlebars')

app.engine('hbs', 
  exphbs({defaultLayout: 'main', 
          extname: '.hbs',
          helpers: {
            
            getTags(arrTags) {

              if (arrTags.length > 1 )
                return arrTags.join(', ')
              else
                return arrTags
            },

            isMale(gender) {
              return gender === 'M'
            },

            isFemale(gender) {
              return gender === 'F'
            },

            getCompanyTypeLabel(type) {
              if (type === 'A')
                return 'Advertiser'
              else if (type === 'P')
                return 'Publisher'
              else
                return 'Undefined'
            },

            isAdvertiser(type) {
              return type === 'A'
            },

            isPublisher(type) {
              return type === 'P'
            },

            getTargetGender(target) {
              if (target.length == 2)
                return 'Male, Female'
              else if (target === 'M')
                return 'Male'
              else if (target === 'F')
                return 'Female'
              else
                return null
            }
        }
  })
)

app.set('view engine', 'hbs')
app.set('views', './views')





// Define routing controllers

console.log(__dirname)
console.log(path.join(__dirname, '/controllers/users'))

var users = require(path.join(__dirname, '/controllers/users'))
app.use('/users', users)

var companies = require('./controllers/companies')
app.use('/coys', companies)

var campaigns = require('./controllers/campaigns')
app.use('/cpns', campaigns)


var crowdsale = require('./controllers/crowdsale')
app.use('/bidcoins', crowdsale)

var auction = require('./controllers/auction')
app.use('/auction', auction)



app.get('/', (req, res) => {
  res.render('blank', {
    page: {
        showNewBtn: false
    }
  })
})


  
app.listen(port, () => {
  console.log(`RTB Dashboard listening at http://${hostname}:${port}`)
})