const router = require('express').Router()
const passport = require('passport')
const database = require('../libs/database')

database.running()


router.get('/', async (req, res) => {
    const message = await req.consumeFlash('message')
    if (req.user) {
        const config = {
            title: req.app.locals.title
        }
        const datos = {
            names: req.user[0].names,
            email: req.user[0].email,
            roll: req.user[0].roll
        }
        console.log(datos)
        res.render('index', { message, config, datos })
    } else {
        res.render('pages/login', { message })
    }
})

router.get('/inicio', async (req, res) => {
    const message = await req.consumeFlash('message')
    const lista = await database.queryAll('users')
    const pozos = await database.queryAll('pozos')
    if (req.user) {
        
        res.render('pages/inicio', { message, lista: lista.length, pozos: pozos.length })
    } else {
        res.redirect('/')
    }
})

router.get('/logevent', async (req, res) => {
    const message = await req.consumeFlash('message')
    if (req.user) {
        res.render('pages/logevent', { message })
    } else {
        res.redirect('/')
    }

})

router.get('/config', async (req, res) => {
    const message = await req.consumeFlash('message')
    if (req.user) {
        const lista = await database.queryAll('users')
        const listap = await database.queryAll('pozos')
        const dsn = await database.queryAll('dsn')
        const query = await database.queryAll('query')
        res.render('pages/configuration', { message, lista, listap, dsn, query })
    } else {
        res.redirect('/')
    }
})

router.post('/', passport.authenticate("local-signin", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}))

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.post('/adduser', async (req, res) => {
    const { names, email, password, roll } = req.body
    await database.insertData(
        'users',
        'names, email, password, roll',
        `'${names}', '${email}', '${database.encryptPassword(password)}', ${roll}`
    )
    res.json({ 'msg': 'ok' })
})


router.post('/updpasswd', async (req, res) => {
    const { id, password } = req.body
    await database.updateData(
        'users',
        `password = '${database.encryptPassword(password)}'`,
        `id = ${id}`
    )
    res.json({ 'msg': 'ok' })
})

router.post('/deluser', async (req, res) => {
    const { id } = req.body
    await database.deleteData(
        'users',
        `id = ${id}`
    )
    res.json({ 'msg': 'ok' })
})

router.post('/addpozo', async (req, res) => {
    const { name, ubicacion, estado } = req.body
    await database.insertData(
        'pozos',
        'name, ubicacion, estado',
        `'${name}', '${ubicacion}', ${estado}`
    )
    res.json({ 'msg': 'ok' })
})

router.post('/redopozo', async (req, res) => {
    const { id, estado } = req.body
    await database.updateData(
        'pozos',
        `estado = ${estado}`,
        `id = ${id}`
    )
    res.json({ 'msg': 'ok' })
})

router.post('/delpozo', async (req, res) => {
    const { id } = req.body
    await database.deleteData(
        'pozos',
        `id = ${id}`
    )
    res.json({ 'msg': 'ok' })
})


router.post('/upddsn', async (req, res) => {
    const dsns = await database.queryAll('dsn')
    if (dsns.length == 0) {
        await database.insertData(
            'dsn',
            'conexion',
            `'${req.body.dsn}'`
        )
    } else {
        await database.updateData(
            'dsn',
            `conexion = '${req.body.dsn}'`,
            'id=1'
        )
    }
    res.json({ 'msg': 'ok' })
})


router.post('/updquery', async (req, res) => {
    const querys = await database.queryAll('query')
    if (querys.length == 0) {
        await database.insertData(
            'query',
            'cadena',
            `'${req.body.query}'`
        )
    } else {
        await database.updateData(
            'query',
            `cadena = '${req.body.query}'`,
            'id=1'
        )
    }
    res.json({ 'msg': 'ok' })
})

module.exports = router