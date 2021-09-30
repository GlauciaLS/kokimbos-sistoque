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
    return await db.Representative.findAll();
}

async function getById(id) {
    return await getRepresentative(id);
}

async function create(payload) {
    const unvalidPayload = await representativeAlreadyExists(payload);
    if (unvalidPayload) {
        throw new Error('Representante já cadastrado!');
    }  

    await db.Representative.create(payload);
}

async function update(id, payload) {
    const representative = await getRepresentative(id);

    const unvalidPayload = await unvalidRepresentative(representative, payload);
    
    if (unvalidPayload) {
        throw new Error('O celular "' + payload.celular + '" já está cadastrado!');
    }

    Object.assign(representative, payload);
    await representative.save();

    return representative.get();
}

async function _delete(id) {
    const representative = await getRepresentative(id);
    await representative.destroy();
}

async function getRepresentative(id) {
    const representative = await db.Representative.findByPk(id);
    if (!representative) throw new Error('Representante não encontrado!');
    return representative;
}

async function representativeAlreadyExists(representative) {
    const representativeFound = await db.Representative.findOne({ where: { celular: representative.celular } });
    
    if(representativeFound) {
        return true;
    }

    return false;
}

async function unvalidRepresentative(representative, payload) {
    if(payload.celular && representative.celular !== payload.celular) {
        return await representativeAlreadyExists(payload);
    }

    return false;
}