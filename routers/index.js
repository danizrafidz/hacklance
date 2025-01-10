const router = require('express').Router()
const Controller = require('../controllers/controller')
const AuthController = require('../controllers/auth-controller')
const { isAdmin, isHacklancer, isClient } = require('../middleware/auth')

router.use('/', require('./autologin'))

// User Authentication
router.get('/register', AuthController.renderRegister)
router.post('/register', AuthController.handlerRegister)
router.get('/login', AuthController.renderLogin)
router.post('/login', AuthController.handlerLogin)
router.get('/logout', AuthController.logout)

// Global isLogin
router.use((req, res, next) => {
    console.log(req.session.userSession);
    if (!req.session.userSession) {
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
router.get('/hacklancer/profile/:HacklancerId', Controller.hacklancerProfile)
router.get('/projects/:ProjectId/bids', Controller.bids)

/** ADMIN ACCESS
 **/
router.get('/users', isAdmin, Controller.users)
router.get('/users/:userId/ban', isAdmin, Controller.banUser)

/** HACKLANCER ACCESS
 **/
router.get('/services/create', isHacklancer, Controller.renderCreateService)
router.post('/services/create', isHacklancer, Controller.handlerCreateService)
router.get('/projects/:ProjectId/bids/bid', isHacklancer, Controller.renderBidProject)
router.post('/projects/:ProjectId/bids/bid', isHacklancer, Controller.handlerBidProject)

/** CLIENT ACCESS
 **/

router.get('/projects/create', isClient, Controller.renderCreateProject)
router.post('/projects/create', isClient, Controller.handlerCreateProject)
router.get('/projects/:ProjectId/bids/:BidId/accept', isClient, Controller.acceptBid)
router.get('/contracts', Controller.contracts)
router.get('/contracts/:ContractId/complete', isClient, Controller.completeContract)
router.post('/review/:HacklancerId', isClient, Controller.handlerReview)

module.exports = router