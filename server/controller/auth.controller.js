const knex = require('knex');
const { getHashPassword } = require('../utils/crypto');
const config = require('../configs');
const { validationResult } = require('express-validator');
const { getUserByLogin, getUserByUsername, getUserById } = require('./players.controller');
const { isValidPassword } = require('../utils/comparePasswords');
const { createToken } = require('../utils/createToken');

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
            return res.sendStatus(400);
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

        const [{id}] = await db
            .select('id')
            .from('users')
            .where({'username': username})

        const [{role_id}] = await db
            .select('role_id')
            .from('assigned_roles')
            .where({'user_id': id})
            
        const [{role}] = await db
            .into('roles')
            .select({
                role: 'role'
            })
            .where({'id': role_id})

        res.json(response = {
            'token': createToken(id, username, role),
        });
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
    makeMeAdmin: async(req, res) => {
        const {userId} = req.body;
        const db = knex(config.development.database);

        const [{role_id}] = await db
            .from('assigned_roles')
            .select('role_id')
            .where({'user_id': userId})

        if (role_id == 2) {
            return res.json(false);
        }

        await db
            .from('assigned_roles')
            .update({role_id: 2})
            .where({'user_id': userId})

        const [user] = await getUserById(userId);

        res.json(response = {
            'token': createToken(userId, user.username, 'Admin'),
        });
    }
};