let { User, Skill, Project, Service, Bid, HacklancerProfile, Contract, Review } = require('../models')
const { Op, Sequelize } = require('sequelize')
const { formatToCurrency } = require('../helpers/helpers')
const bcrypt = require('bcryptjs')

const easyinvoice = require('easyinvoice');
const fs = require('fs'); // For saving the generated invoice to a file (optional)
const path = require('path'); // For handling file paths

const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

class Controller {
    static async home(req, res) {
        try {
            const { userSession } = req.session

            res.render('home', { user: userSession })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async users(req, res) { //users
        try {
            const { userSession } = req.session

            let users = await User.findAll()
            res.render('users', { user: userSession, users })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async banUser(req, res) { //users/:userId/ban
        try {
            const { userId } = req.params

            await User.destroy({
                where: {
                    id: userId
                }
            })
            res.redirect('/users')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async hacklancerProfile(req, res) { //hacklancer/profile/:HacklancerId
        try {
            const { HacklancerId } = req.params

            let hacklancer = await User.findOne({
                include: [
                    {
                        model: HacklancerProfile,
                        include: {
                            model: Review,
                            include: {
                                model: User,
                                as: 'Client'
                            }
                        }
                    },
                ],
                where: { id: HacklancerId }
            })
            res.render('hacklancer-profile', { hacklancer, formatToCurrency, timeAgo })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async projects(req, res) { //projects
        try {
            let { sort, search } = req.query
            const { userSession } = req.session

            let skills = await Skill.findAll()
            let projects = await Project.sortAndSearch(sort, search, User, Skill, Bid)

            res.render('projects', { user: userSession, projects, skills, formatToCurrency, timeAgo })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async services(req, res) { //services
        try {
            const { userSession } = req.session

            let services = await Service.findAll({
                include: [
                    {
                        model: Skill,
                    },
                    {
                        model: User,
                        as: 'Hacklancer'
                    }
                ],
            })
            res.render('services', { user: userSession, services, formatToCurrency })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async bids(req, res) {
        try {
            const { userSession } = req.session;
            const { ProjectId } = req.params;

            let project = await Project.findOne({
                where: {
                    id: ProjectId
                },
                include: User
            });
            let bids = await Bid.findAll({
                include: [
                    { model: Project },
                    { model: User, as: 'Hacklancer' }
                ],
                where: { ProjectId: ProjectId },
                order: [['status', 'ASC']]
            });

            console.log(project);


            // Example: Generate an invoice if a bid is accepted (add this logic as needed)

            const generateInvoice = async (bid) => {
                // Ensure the 'invoices' directory exists
                const invoicesDir = path.join(__dirname, '../invoices');
                if (!fs.existsSync(invoicesDir)) {
                    fs.mkdirSync(invoicesDir); // Create the directory
                }

                // Invoice data (customize as needed)
                const data = {
                    "documentTitle": "Invoice", // Default is 'INVOICE'
                    "currency": "USD",
                    "taxNotation": "vat", // or gst
                    "marginTop": 25,
                    "marginRight": 25,
                    "marginLeft": 25,
                    "marginBottom": 25,
                    "sender": {
                        "company": project.User.username, //  The client
                        "address": project.User.email,
                        "zip": `Id ${project.User.id}`
                    },
                    "client": {
                        "company": bid.Hacklancer.username, // The bidder - Hacklancer
                        "address": bid.Hacklancer.email,
                        "zip": `Id ${bid.Hacklancer.id}`
                    },
                    "invoiceNumber": String(bid.id),
                    "invoiceDate": new Date().toISOString().slice(0, 10), // Current date
                    "products": [
                        {
                            "quantity": 1,
                            "description": `Bid for project: ${project.title}`,
                            "tax": 0, // Adjust based on tax if needed
                            "price": bid.bidAmount
                        }
                    ],
                    "bottomNotice": "This is a hacklance-generated invoice."
                };

                // Generate the invoice
                const invoice = await easyinvoice.createInvoice(data);

                // Define the file path
                const invoicePath = path.join(invoicesDir, `invoice_${bid.id}.pdf`);

                // Save the invoice as a PDF file
                fs.writeFileSync(invoicePath, invoice.pdf, 'base64');

                return invoice.pdf; // Return PDF data
            };

            // Example: Add a route to trigger invoice generation for an accepted bid
            if (req.query.generateInvoice) {
                const bidId = req.query.generateInvoice;
                const bid = bids.find(bid => bid.id == bidId);
                if (bid) {
                    const invoicePdf = await generateInvoice(bid);

                    // Serve the PDF directly to the browser
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename=invoice_${bid.id}.pdf`);
                    return res.send(Buffer.from(invoicePdf, 'base64'));
                }
            }

            res.render('bids', { user: userSession, bids, project, formatToCurrency });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async renderCreateProject(req, res) { //projects/create [GET]
        try {
            const { errors } = req.query

            let skills = await Skill.findAll()
            res.render('clients/create-project', { skills, errors })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async handlerCreateProject(req, res) { //projects/create [POST]
        try {
            const { userSession } = req.session
            const { title, description, imageURL, budget, SkillId } = req.body

            await Project.create({ title, description, imageURL, budget, SkillId, ClientId: userSession.id })
            res.redirect('/projects')
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let errors = error.errors.map(err => err.message)
                res.redirect(`/projects/create?errors=${errors}`)
            } else {
                console.log(error);
                res.send(error)
            }
        }
    }

    static async renderCreateService(req, res) { //services/create [GET]
        try {
            const { errors } = req.query

            let skills = await Skill.findAll()
            res.render('hacklancers/create-service', { skills, errors })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async handlerCreateService(req, res) { //services/create [POST]
        try {
            const { userSession } = req.session
            const { title, description, price, terms, SkillId } = req.body

            await Service.create({ title, description, price, terms, SkillId, HacklancerId: userSession.id })
            res.redirect('/services')
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let errors = error.errors.map(err => err.message)
                res.redirect(`/services/create?errors=${errors}`)
            } else {
                console.log(error);
                res.send(error)
            }
        }
    }

    static async renderBidProject(req, res) { //projects/:ProjectId/bids/bid [GET]
        try {
            const { errors } = req.query
            const { ProjectId } = req.params

            let project = await Project.findByPk(ProjectId)
            res.render('hacklancers/bid-project', { project, errors })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async handlerBidProject(req, res) { //projects/:ProjectId/bids/bid [POST]
        try {
            const { userSession } = req.session
            const { ProjectId } = req.params

            const { proposalText, bidAmount, terms } = req.body
            await Bid.create({ ProjectId, HacklancerId: userSession.id, proposalText, bidAmount, terms })
            res.redirect(`/projects/${ProjectId}/bids`)
        } catch (error) {
            const { ProjectId } = req.params
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let errors = error.errors.map(err => err.message)
                res.redirect(`/projects/${ProjectId}/bids/bid?errors=${errors}`)
            } else {
                console.log(error);
                res.send(error)
            }
        }
    }

    static async acceptBid(req, res) { //projects/:ProjectId/bids/:BidId/accept
        try {
            const { ProjectId, BidId } = req.params
            await Bid.update(
                { status: 'accepted' },
                {
                    where: {
                        id: BidId,
                    },
                },
            );
            await Bid.update(
                { status: 'rejected' },
                {
                    where: {
                        id: {
                            [Op.ne]: BidId
                        },
                        ProjectId: ProjectId
                    },
                },
            );
            await Project.update(
                { status: 'in progress' },
                {
                    where: {
                        id: ProjectId
                    },
                },
            );
            let bid = await Bid.findOne({
                include: {
                    model: User,
                    as: 'Hacklancer'
                },
                where: {
                    id: BidId,
                }
            })
            let project = await Project.findByPk(ProjectId)
            await Contract.create({ fee: bid.bidAmount, terms: `${project.description} - ${bid.terms} days`, ProjectId, HacklancerId: bid.HacklancerId })
            res.render(`contract-created`, { bid })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async contracts(req, res) { //contracts
        try {
            const { userSession } = req.session

            let client = await User.findOne({
                include: {
                    model: Project,
                    include: {
                        model: Contract,
                        include: [
                            {
                                model: Project
                            },
                            {
                                model: User
                            }
                        ]
                    }
                },
                where: { id: userSession.id }
            })
            // Put on static method
            let contracts = client.Projects.filter(project => project.Contract).map(project => project.Contract)
            // res.send(contracts)
            res.render('contracts', { contracts, formatToCurrency })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async completeContract(req, res) { //contracts/:ContractId/complete
        try {
            const { errors } = req.query
            const { userSession } = req.session
            const { ContractId } = req.params

            let contract = await Contract.findOne({
                where: {
                    id: ContractId
                },
                include: User
            })
            await Contract.update(
                { isCompleted: true },
                {
                    where: {
                        id: ContractId
                    },
                },
            );
            await Project.update(
                { status: 'completed' },
                {
                    where: {
                        id: contract.ProjectId
                    },
                },
            );
            if (contract.isCompleted === false) {
                await User.decrement('balance', {
                    by: contract.fee,
                    where: { id: userSession.id }
                });
                await User.increment('balance', {
                    by: contract.fee,
                    where: { id: contract.HacklancerId }
                });
            }

            res.render('clients/review', { contract, formatToCurrency, errors })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async handlerReview(req, res) {
        try {
            const { userSession } = req.session
            const { HacklancerId } = req.params
            const { rating, comment } = req.body

            let hacklancer = await User.findOne({
                where: {
                    id: HacklancerId
                },
                include: HacklancerProfile
            })
            await Review.create({ rating, comment, ProfileId: hacklancer.HacklancerProfile.id, ClientId: userSession.id, })
            res.redirect(`/hacklancer/profile/${HacklancerId}`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async xxx(req, res) {
        try {

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}

module.exports = Controller