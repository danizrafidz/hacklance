let { User, Skill, Project, Service, Bid } = require('../models')
const { Op, Sequelize } = require('sequelize')
const { formatToCurrency } = require('../helpers/helpers')
const bcrypt = require('bcryptjs')

class Controller {
    static async home(req, res) {
        try {
            const { user } = req.session

            res.render('home', { user })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async renderRegister(req, res) { //register [GET]
        try {
            const { errors } = req.query

            res.render('auth/register', { errors })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async handlerRegister(req, res) { //register [POST]
        try {
            let { username, name, email, password, role } = req.body

            await User.create({ username, name, email, password, role })
            res.redirect('/login')
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let errors = error.errors.map(err => err.message)
                res.redirect(`/register?errors=${errors}`)
            } else {
                console.log(error);
                res.send(error)
            }
        }
    }
    static async renderLogin(req, res) { //login
        try {
            const { success, errors } = req.query

            res.render('auth/login', { success, errors })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async handlerLogin(req, res) { //login
        try {
            let { username, password } = req.body

            let findUser = await User.findOne({
                where: { username }
            })

            if (!findUser) {
                throw 'Username not found!'
            }
            let checkPassword = bcrypt.compareSync(password, findUser.password);
            if (!checkPassword) {
                throw 'Password incorrect!'
            }

            req.session.user = findUser
            res.redirect('/')
        } catch (error) {
            res.redirect(`/login?errors=${error}`)
        }
    }
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/login?success=You have been logged out')
            }
        })
    }

    static async users(req, res) { //users
        try {
            const { user } = req.session

            let users = await User.findAll()
            res.render('users', { user, users })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async projects(req, res) { //projects
        try {
            const { user } = req.session

            let projects = await Project.findAll({
                include: [User, Skill],
                order: [['status', 'ASC']]
            })

            res.render('projects', { user, projects, formatToCurrency })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async services(req, res) { //services
        try {
            const { user } = req.session

            let services = await Service.findAll({
                include: [User, Skill]
            })
            res.render('services', { user, services, formatToCurrency })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }


    // BUG
    static async bids(req, res) { //projects/:ProjectId/bids
        try {
            const { ProjectId } = req.params
            const { user } = req.session

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
                where: { ProjectId }
            })
            // res.send(bids)
            res.render('bids', { user, bids, project, formatToCurrency })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async xxx(req, res) {
        try {
            res.render('Hello World!')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}

module.exports = Controller