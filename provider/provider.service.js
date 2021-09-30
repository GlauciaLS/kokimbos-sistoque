const Sequelize = require('sequelize');
const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Provider.findAll();
}

async function getById(id) {
    return await getProvider(id);
}

async function create(payload) {
    const unvalidProvider = await providerAlreadyExists(payload);
    if (unvalidProvider) {
        throw new Error('Esse fornecedor já existe! Verifique o CNPJ e o e-mail cadastrados.');
    }
    
    const validRepresentative = await representativeExists(payload.representante);
    if(!validRepresentative) {
        throw new Error('Representante não existe!')
    }

    db.Provider.create(payload);
}

async function update(id, payload) {
    const provider = await getProvider(id);

    const unvalidProvider = await unvalidProviderChanged(provider, payload);
    if (unvalidProvider) {
        throw new Error('Esse fornecedor já existe! Verifique o CNPJ e o e-mail cadastrados.');
    }
    
    const validRepresentative = await representativeExists(payload.representante);
    if(!validRepresentative) {
        throw new Error('Representante não existe!')
    }

    Object.assign(provider, payload);
    await provider.save();

    return provider.get();
}

async function _delete(id) {
    const provider = await getProvider(id);
    await provider.destroy();
}

async function getProvider(id) {
    const provider = await db.Provider.findByPk(id);
    if (!provider) throw new Error('Fornecedor não encontrado!');
    return provider;
}

async function representativeExists(id) {
    const count = await db.Representative.count({ where: { id: id } });

    if (count != 0) {
        return true;
    }

    return false;
}

async function providerAlreadyExists(provider) {
    const providerFound = await db.Provider.findOne({ where: { 
        [Sequelize.Op.or]: [
            { cnpj: provider.cnpj },
            { email: provider.email },
        ]
    } });

    if(providerFound) {
        return true;
    }

    return false;
}

async function unvalidProviderChanged(provider, payload) {
    if((payload.cnpj && provider.cnpj !== payload.cnpj) || (payload.email && provider.email !== payload.email)) {
        return await providerAlreadyExists(payload);
    }
    return false;
}