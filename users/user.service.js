const Sequelize = require('sequelize');
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
        throw new Error('Login ou senha estão errados!');

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
    if (await db.User.findOne({ where: { 
        [Sequelize.Op.or]: [
            { login: payload.login },
            { cpf: payload.cpf },
            { rg: payload.rg }
        ]
    } })) {
        throw new Error('Funcionário já cadastrado! Verifique o login, CPF e RG informados.');
    }

    if(await typeUserExists(payload.tipoUsuario)) {        
        throw new Error('Tipo de usuário não existe!');
    }

    if (payload.senha) {
        payload.hash = await bcrypt.hash(payload.senha, 10);
    }

    await db.User.create(payload);
}

async function update(id, payload) {
    const user = await getUser(id);

    const loginAlterado = payload.login && user.login !== payload.login;
    if (loginAlterado && await db.User.findOne({ where: { 
        [Sequelize.Op.or]: [
            { login: payload.login },
            { cpf: payload.cpf },
            { rg: payload.rg }
        ]
    } })) {
        throw new Error('Esse usuário já existe! Verifique o login, CPF e RG informados.');
    }

    if (payload.senha) {
        payload.hash = await bcrypt.hash(payload.senha, 10);
    }

    Object.assign(user, payload);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw new Error('Usuário não encontrado!');
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}

function typeUserExists(id) {
    return db.TypeUser.count({ where: { id: id } })
      .then(count => {
        if (count != 0) {
          return false;
        }
        return true;
    });
}