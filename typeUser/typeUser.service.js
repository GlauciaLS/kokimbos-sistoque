const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return db.TypeUser.findAll();
}

async function getById(id) {
    return getTypeUser(id);
}

async function create(payload) {
    if (await db.TypeUser.findOne({ where: { nome: payload.nome } })) {
        throw 'Tipo de usuário já cadastrado!';
    }

    if (payload.senha) {
        payload.hash = await bcrypt.hash(payload.senha, 10);
    }

    await db.TypeUser.create(payload);
}

async function update(id, payload) {
    const typeUser = await getTypeUser(id);

    const typeUserChanged = payload.nome && typeUser.nome !== payload.nome;

    if (typeUserChanged && await db.TypeUser.findOne({ where: { nome: payload.nome } })) {
        throw 'O tipo de usuário "' + payload.nome + '" já existe!';
    }

    Object.assign(typeUser, payload);
    await typeUser.save();

    return typeUser.get();
}

async function _delete(id) {
    const typeUser = await getTypeUser(id);
    await typeUser.destroy();
}

async function getTypeUser(id) {
    const typeUser = await db.TypeUser.findByPk(id);
    if (!typeUser) throw 'Tipo de usuário não encontrado!';
    return typeUser;
}