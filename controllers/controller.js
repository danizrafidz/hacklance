let { User, Skill, Project, Service, Bid, HacklancerProfile, Contract, Review } = require('../models')
const { Op, Sequelize } = require('sequelize')
const { formatToCurrency } = require('../helpers/helpers')
const bcrypt = require('bcryptjs')

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
            res.render('hacklancer-profile', { hacklancer })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async projects(req, res) { //projects
        try {
            const { userSession } = req.session

            let projects = await Project.findAll({
                include: [User, Skill, Bid],
                order: [['status', 'ASC']]
            })
            res.render('projects', { user: userSession, projects, formatToCurrency })
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
    static async bids(req, res) { //projects/:ProjectId/bids
        try {
            const { userSession } = req.session
            const { ProjectId } = req.params

            let project = await Project.findByPk(ProjectId)
            let bids = await Bid.findAll({
                include: [
                    {
                        model: Project,
                    },
                    {
                        model: User,
                        as: 'Hacklancer'
                    }
                ],
                where: {
                    ProjectId: ProjectId,
                },
                order: [['status', 'ASC']]
            })
            res.render('bids', { user: userSession, bids, project, formatToCurrency })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async renderCreateProject(req, res) { //projects/create [GET]
        try {
            let skills = await Skill.findAll()
            res.render('clients/create-project', { skills })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async handlerCreateProject(req, res) { //projects/create [POST]
        try {
            const { userSession } = req.session
            const { title, description, budget, SkillId } = req.body

            await Project.create({ title, description, budget, SkillId, ClientId: userSession.id })
            res.redirect('/projects')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async renderCreateService(req, res) { //services/create [GET]
        try {
            let skills = await Skill.findAll()
            res.render('hacklancers/create-service', { skills })
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
            console.log(error);
            res.send(error)
        }
    }

    static async renderBidProject(req, res) { //projects/:ProjectId/bids/bid [GET]
        try {
            const { ProjectId } = req.params

            let project = await Project.findByPk(ProjectId)
            res.render('hacklancers/bid-project', { project })
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
            console.log(error);
            res.send(error)
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
            const { userSession } = req.session
            const { ContractId } = req.params

            let contract = await Contract.findByPk(ContractId)
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

            res.redirect('/contracts')
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