const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize() {

    let jwtSecret = process.env.SECRET || secret;

    return [
        jwt({ jwtSecret, algorithms: ['HS256'] }),

        async (req, res, next) => {
            const user = await db.User.findByPk(req.user.sub);

            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });

            req.user = user.get();
            next();
        }
    ];
}