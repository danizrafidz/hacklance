const router = require('express').Router()

// TESTING ONLY
router.get('/user', async (req, res) => {
    let findUser = await require('../models').User.findOne({
        where: { username: 'johndoe' }
    })
    req.session.userSession = findUser
    res.redirect('/projects')
})
router.get('/admin', async (req, res) => {
    let findUser = await require('../models').User.findOne({
        where: { username: 'admin1' }
    })
    req.session.userSession = findUser
    res.redirect('/projects')
})
router.get('/c', async (req, res) => {
    let findUser = await require('../models').User.findOne({
        where: { username: 'aliceclient' }
    })
    req.session.userSession = findUser
    res.redirect('/projects')
})
router.get('/h', async (req, res) => {
    let findUser = await require('../models').User.findOne({
        where: { username: 'boblancer' }
    })
    req.session.userSession = findUser
    res.redirect('/')
})
// TESTING ONLY

module.exports = router