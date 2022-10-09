const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const database = require('../libs/database')

passport.serializeUser((userx, done) => {
    done(null, userx[0].id)
})

passport.deserializeUser(async (id, done) => {
    const User = await database.queryParams('users', 'id = ' + id)
    done(null, User)
})

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const User = await database.queryParams('users', 'email = "' + email + '"')
    if (User) {
        return done(null, false, req.flash('message', 'Usuario ya Existe en el Sistema'))
    } else {
        await database.insertData(
            'users',
            'names,email,password,roll',
            `'${req.body.names}','${email}','${database.encryptPassword(password)}','${req.body.roll}'`
        )
        done(null, false, req.flash('message', 'Usuario Creado'))
    }
}))

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const User = await database.queryParams('users', 'email = "' + email + '"')
    if (User.length > 0) {
        if (!database.comparePassword(password, User[0].password)) {
            return done(null, false, req.flash('message', 'Contraseña Incorrecta'))
        } else {
            return done(null, User)
        }
    } else {
        return done(null, false, req.flash('message', 'No Existe el Usuario'))
    }
}))