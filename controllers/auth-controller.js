let { User, Skill, Project, Service, Bid, HacklancerProfile } = require('../models')
const { Op, Sequelize } = require('sequelize')
const { formatToCurrency } = require('../helpers/helpers')
const bcrypt = require('bcryptjs')
const { hacklancerProfile } = require('./controller')

class AuthController {
    static async renderRegister(req, res) { //register [GET]
        try {
            const { role, errors } = req.query
            let skills = await Skill.findAll()

            if (role === 'client') {
                res.render('auth/register-client', { errors, skills })
            } else if (role === 'hacklancer') {
                res.render('auth/register-hacklancer', { errors, skills })
            }
            res.render('auth/register')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async handlerRegister(req, res) { //register [POST]
        try {
            const { role } = req.query
            const { username, name, email, password } = req.body

            await User.create({ username, name, email, password, role })
            let createdUser = await User.findOne({ where: { username } })

            if (role === 'hacklancer') {
                const { bio, profilePicture, portfolioURL, SkillId } = req.body
                await HacklancerProfile.create({ bio, profilePicture, portfolioURL, SkillId, HacklancerId: createdUser.id })
            }
            res.redirect('/login')
        } catch (error) {
            const { role } = req.query
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                let errors = error.errors.map(err => err.message)
                res.redirect(`/register?role=${role}&errors=${errors}`)
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

            req.session.userSession = {
                id: findUser.id,
                username: findUser.username,
                name: findUser.name,
                email: findUser.email,
                role: findUser.role,
                balance: findUser.balance,
            }
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
}

module.exports = AuthController