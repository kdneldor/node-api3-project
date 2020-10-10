const userDb = require("../users/userDb")

function validateUserId() {
    return (req, res, next) => {
        userDb.getById(req.params.id)
        if (user) {
            req.user = user
            next()
        }
        else {
            res.status(400).json({
                message: "invalid user id",
            })
        }
    }
}

module.exports = {
    validateUserId,
}