const isAdmin = function (req, res, next) {
    console.log(req.session);
    if (req.session.user.role !== 'admin') {
        let errors = `You're not admin!`
        res.redirect(`/login?errors=${errors}`)
    } else {
        next()
    }
}
const isHacklancer = function (req, res, next) {
    console.log(req.session);
    if (req.session.user.role !== 'hacklancer') {
        let errors = `You're not hacklancer!`
        res.redirect(`/login?errors=${errors}`)
    } else {
        next()
    }
}
const isClient = function (req, res, next) {
    console.log(req.session);
    if (req.session.user.role !== 'client') {
        let errors = `You're not client!`
        res.redirect(`/login?errors=${errors}`)
    } else {
        next()
    }
}


module.exports = {isAdmin, isHacklancer, isClient}
