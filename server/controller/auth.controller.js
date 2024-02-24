const knex = require('knex');
const { getHashPassword } = require('../utils/crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const config = require('../configs');
const { validationResult } = require('express-validator');
const { getUserByLogin, getUserByUsername } = require('./players.controller');
const { isValidPassword } = require('../utils/comparePasswords');

module.exports = {
    registrationUser: async(req, res) => {
        const db = knex(config.development.database);
        const {username, password} = req.body;
        const registrationErrors = validationResult(req);

        if(!registrationErrors.isEmpty()) {
            return res
                .status(400)
                .json({registrationErrors})
        }

        const [userExist] = await getUserByLogin(['username', 'password'], [{
            left: 'username',
            operator: '=',
            right: username
        }]);

        if (userExist) {
        
            return res
                .status(400)
                .json({registrationErrors: {errors: [{msg: `Пользователь c ником ${username} уже существует.`}]}})
        }

        const [user] = await db
            .into('users')
            .insert({
                username,
                password: getHashPassword(password),
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .returning('id');

        await db
            .into('assigned_roles')
            .insert({
                user_id: user.id,
                role_id: 1
            })
            .returning('role_id');

    res.json([{msg: 'Регистрация прошла успешно!'}, {msg: 'Нажмите "Вход"'}]);
    },
    loginUser: async(req, res) => {
        const db = knex(config.development.database);
        const {username, password} = req.body;

        if (!username || !password) {
            res.sendStatus(400);

            return;
        }

        const [userExist] = await getUserByUsername(username);

        if (!userExist) {
            return res
                .status(400)
                .json([{msg: `Пользователя c ником ${username} не существует`}])
        }

        if (!isValidPassword(userExist, password)) {
            return res
                .status(400)
                .json([{msg: `Неверный пароль`}])
        }

        const [userId] = await db
            .select('id')
            .from('users')
            .where({'username': username})

        const [roleId] = await db
            .select('role_id')
            .from('assigned_roles')
            .where({'user_id': userId.id})

        const [userRole] = await db
            .into('roles')
            .select({
                role: 'role'
            })
            .where({'id': roleId.role_id})

        res.json(response = {
            'token': jwt.sign(
                {sub: {id: userId.id, username, userRole: userRole.role}}, 
                'meow', 
                // {expiresIn: '24h'}
            ),
        });
    },
    createToken: async(req, res) => {
        const {username, password} = req.body;
        const [user] = await getUserByLogin(['username', 'password'], [{
            left: 'username',
            operator: '=',
            right: username
        }]);

        const isEqual = await bcrypt.compare(password, user.password);
        
        if (isEqual) {
            return res
                .status(200)
                .json({token: jwt.sign({sub: user.id}, 'meow')});
        } else {
            return res
                .status(400)
                .json({msg: 'Неверный пароль'});
        }
    },
    getToken: async(req, res) => {
        const db = knex(config.development.database);
        const {userId} = req.params;

        const [token] = await db
            .select('token')
            .from('tokens')
            .where({'user_id': userId});

    res.json(token.token);
    },
    checkToken: async(req, res) => {
        const user = req.body.user.sub;

        if(!user) {
            return res
                .status(403)
                .json({access: false})
        }

        const [userExist] = await getUserByUsername(user.username);

        if (!userExist) {
            return res
                .status(403)
                .json({access: false})
        }

        return res.json({role: user.userRole, access: true});
    },
};