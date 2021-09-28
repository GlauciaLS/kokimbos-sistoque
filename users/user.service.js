const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ login, senha }) {
    const user = await db.User.scope('withHash').findOne({ where: { login } });

    if (!user || !(await bcrypt.compare(senha, user.hash)))
        throw 'Login ou senha estão errados!';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(payload) {
    // validate
    if (await db.User.findOne({ where: { login: payload.login, cpf: payload.cpf, rg: payload.rg } })) {
        throw 'Funcionário já cadastrado!';
    }

    // hash password
    if (payload.senha) {
        payload.hash = await bcrypt.hash(payload.senha, 10);
    }

    // save user
    await db.User.create(payload);
}

async function update(id, payload) {
    const user = await getUser(id);

    // validate
    const loginAlterado = payload.login && user.login !== payload.login;
    if (loginAlterado && await db.User.findOne({ where: { login: payload.login } })) {
        throw 'O login "' + payload.login + '" já existe!';
    }

    // hash password if it was entered
    if (payload.senha) {
        payload.hash = await bcrypt.hash(payload.senha, 10);
    }

    // copy payload to user and save
    Object.assign(user, payload);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'Usuário não encontrado!';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}