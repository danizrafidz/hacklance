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

// // 1 User Authentication and Management
// app.post('/register', Controller.xxx)
// app.post('/login', Controller.xxx)
// app.post('/logout', Controller.xxx)
// app.get('/users/:id', Controller.xxx)
// app.get('/users/', Controller.xxx)

// // 2. Service Management
// app.get('/services', Controller.xxx)
// app.post('/services', Controller.xxx)
// // app.get('/services:id', Controller.xxx)

// // 3. Project Management
// app.get('/projects', Controller.xxx)
// app.post('/projects', Controller.xxx)
// // app.get('/projects:id', Controller.xxx)

// // 4. Bid Management
// app.get('/projects/:id/bids', Controller.xxx)
// app.post('/projects/:id/bids', Controller.xxx)

// // 5. Contract Management
// app.get('/contracts', Controller.xxx)
// app.get('/contracts/:id', Controller.xxx)

// // 6. Transaction Management
// app.post('/transactions', Controller.xxx)
// app.get('/transactions/:id', Controller.xxx)
// app.get('/transactions', Controller.xxx)

// // 7. Review Management
// app.post('/contracts/:id/reviews', Controller.xxx)
// app.get('/users/:id/reviews', Controller.xxx)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

