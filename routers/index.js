const router = require('express').Router()
const Controller = require('../controllers/controller')
const { isAdmin, isHacklancer, isClient } = require('../middleware/auth')

// TESTING ONLY
router.get('/client', async (req, res) => {
    let findUser = await require('../models').User.findOne({
        where: { username: 'client1' }
    })
    req.session.user = findUser
    res.redirect('/projects')
})
router.get('/hacklancer', async (req, res) => {
    let findUser = await require('../models').User.findOne({
        where: { username: 'hacklancer1' }
    })
    req.session.user = findUser
    res.redirect('/')
})
// TESTING ONLY

// User Authentication and Management
router.get('/register', Controller.renderRegister)
router.post('/register', Controller.handlerRegister)
router.get('/login', Controller.renderLogin)
router.post('/login', Controller.handlerLogin)
router.get('/logout', Controller.logout)

// isLogin
router.use((req, res, next) => {
    console.log(req.session);
    if (!req.session.user) {
        let errors = 'Please login first!'
        res.redirect(`/login?errors=${errors}`)
    } else {
        next()
    }
})

/** ALL USERS ACCESS
 **/
router.get('/', Controller.home)
router.get('/projects', Controller.projects)
router.get('/services', Controller.services)
router.get('/hacklancer/profile', Controller.xxx)

/** ADMIN ACCESS
 **/
router.get('/users', Controller.users)

/** HACKLANCER ACCESS
 **/
router.get('/hacklancer/profile/edit', isHacklancer, Controller.xxx)
router.post('/hacklancer/profile/edit', isHacklancer, Controller.xxx)

// Form to bid
router.get('/projects/:ProjectId/bids/bid', isHacklancer, Controller.xxx)
router.post('/projects/:ProjectId/bids/bid', isHacklancer, Controller.xxx)

/** CLIENT ACCESS
 **/
// Create contract form, fillout what project & contract
router.get('/services/:ServiceId/contract', isClient, Controller.xxx)
router.post('/services/:ServiceId/contract', isClient, Controller.xxx)

/** PROJECTS STATUS
 * Open: contract not exists
 * In Progress: contract exists & isCompleted FALSE
 * Completed: contract exists & isCompleted TRUE
 */

// Show list of bids
router.get('/projects/:ProjectId/bids', Controller.bids)

// Create contract, close hacklancer bidding
router.get('/projects/:ProjectId/bids/:BidId/accept', isClient, Controller.xxx)

// Set hacklancer bid to rejected
router.get('/projects/:ProjectId/bids/:BidId/reject', isClient, Controller.xxx)

// 
router.get('/contracts', isClient, Controller.xxx)
router.get('/contracts/:ContractId', isClient, Controller.xxx)

// Transfer balance & give review, send the review to HacklancerProfile
router.get('/contracts/:ContractId/complete', isClient, Controller.xxx)

module.exports = router