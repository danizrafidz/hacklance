const router = require('express').Router()
const Controller = require('../controllers/controller')
const AuthController = require('../controllers/auth-controller')
const { isAdmin, isHacklancer, isClient } = require('../middleware/auth')

router.use('/', require('./autologin'))

// User Authentication and Management
router.get('/register', AuthController.renderRegister)
router.post('/register', AuthController.handlerRegister)
router.get('/login', AuthController.renderLogin)
router.post('/login', AuthController.handlerLogin)
router.get('/logout', AuthController.logout)

// isLogin
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

/** ADMIN ACCESS
 **/
router.get('/users', isAdmin, Controller.users)
router.get('/users/:userId/ban', isAdmin, Controller.banUser)

/** HACKLANCER ACCESS
 **/
router.get('/hacklancer/profile/edit', isHacklancer, Controller.xxx)
router.post('/hacklancer/profile/edit', isHacklancer, Controller.xxx)

router.get('/services/create', isHacklancer, Controller.renderCreateService)
router.post('/services/create', isHacklancer, Controller.handlerCreateService)

// Form to bid
router.get('/projects/:ProjectId/bids/bid', isHacklancer, Controller.renderBidProject)
router.post('/projects/:ProjectId/bids/bid', isHacklancer, Controller.handlerBidProject)

/** CLIENT ACCESS
 **/

router.get('/projects/create', isClient, Controller.renderCreateProject)
router.post('/projects/create', isClient, Controller.handlerCreateProject)

// Create contract form, fillout what project & contract
router.get('/services/:ServiceId/contract', isClient, Controller.xxx)

/** PROJECTS STATUS
 * Open: contract not exists
 * In Progress: contract exists & isCompleted FALSE
 * Completed: contract exists & isCompleted TRUE
 */

// Show list of bids
router.get('/projects/:ProjectId/bids', Controller.bids)

// Create contract, close hacklancer bidding
router.get('/projects/:ProjectId/bids/:BidId/accept', isClient, Controller.acceptBid)

// 
router.get('/contracts', Controller.contracts)
router.get('/contracts/:ContractId', isClient, Controller.xxx)

// Transfer balance & give review, send the review to HacklancerProfile
router.get('/contracts/:ContractId/complete', isClient, Controller.completeContract)

module.exports = router