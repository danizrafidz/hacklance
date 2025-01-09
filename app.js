const express = require('express')
const app = express()
const port = 3000
const router = require('./routers')
const session = require('express-session')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set('view engine', 'ejs')

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
    }
}))

app.use('/', router)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

