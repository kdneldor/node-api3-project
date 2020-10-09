// const userDb = require("../users/userDb")

function vaildateUser() {
    return(req, res, next) => {
        if (!req.body.name) {
            return res.status(400).json({
                message: "missing user data"
            })
        }
    }
}

module.exports = {
    vaildateUser,
}