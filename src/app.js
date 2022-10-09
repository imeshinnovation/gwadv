const express = require('express')
const { flash } = require('express-flash-message')
const morgan = require('morgan')
const { create } = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const sqlite3 = require('sqlite3')
const sqliteStoreFactory = require('express-session-sqlite').default
const bodyParser = require('body-parser')

const router = require('./routes/index')
const passport = require('passport')

require('./passport/local-auth')

require('dotenv').config()

const SqliteStore = sqliteStoreFactory(session)

const app = express()

app.use(session({
    secret: 'adv2022',
    store: new SqliteStore({
      driver: sqlite3.Database,
      path: './src/db/gwadv.db',
      ttl: 365 * 24 * 60 * 60,
      prefix: 'sess:',
      cleanupInterval: 30000000
    }),
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: app.get("env") === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    }
}))

app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

app.use(flash({ sessionKeyName: 'flashMessage' }))
app.use(passport.initialize())
app.use(passport.session())

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router)


const hbs = create({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(__dirname, '/views/partials'),
    layoutsDir: path.join(__dirname, '/views/layouts'),
    helpers: require('./libs/helpers')
})

app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use('/js', express.static(__dirname + '../../node_modules/jquery/dist'))
app.use('/js', express.static(__dirname + '../../node_modules/bootstrap/dist/js'))
app.use('/js', express.static(__dirname + '../../node_modules/@fortawesome/fontawesome-free/js'))
app.use('/js', express.static(__dirname + '../../node_modules/bootstrap-table/dist'))
app.use('/css', express.static(__dirname + '../../node_modules/bootstrap/dist/css'))
app.use('/css', express.static(__dirname + '../../node_modules/bootstrap-table/dist'))
app.use('/css', express.static(__dirname + '../../node_modules/@fortawesome/fontawesome-free/css'))
app.use('/webfonts', express.static(__dirname + '../../node_modules/@fortawesome/fontawesome-free/webfonts'))
app.use('/fonts', express.static(__dirname + '/assets/fonts'))
app.use('/images', express.static(__dirname + '/assets/images'))



app.use(function (req, res, next) {
    app.locals.message = req.flash()
    res.locals.usuario = req.user
    next()
})

app.locals.title = process.env.TITLE
app.locals.copyright = process.env.COPYR


app.set('port', process.env.PORT)
app.set('ip', process.env.IP)

app.listen(app.get('port'), app.get('ip'))