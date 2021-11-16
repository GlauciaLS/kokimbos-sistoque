const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Product.findAll();
}

async function getById(id) {
    return await getProduct(id);
}

async function create(payload) {
    const unvalidPayload = await productAlreadyExists(payload);
    if (unvalidPayload) {
        throw new Error('Produto já cadastrado!');
    }  

    const validCategory = await categoryExists(payload.categoria);
    if(!validCategory) {
        throw new Error('Categoria não existe!');
    }

    const validProvider = await providerExists(payload.fornecedor);
    if(!validProvider) {
        throw new Error('Fornecedor não existe!');
    }

    await db.Product.create(payload);
}

async function update(id, payload) {
    const product = await getProduct(id);

    const unvalidPayload = await unvalidProduct(product, payload);    
    if (unvalidPayload) {
        throw new Error('O produto "' + payload.nome + '" já está cadastrado!');
    }

    const validCategory = await categoryExists(payload.categoria);
    if(!validCategory) {
        throw new Error('Categoria não existe!');
    }

    const validProvider = await providerExists(payload.fornecedor);
    if(!validProvider) {
        throw new Error('Fornecedor não existe!');
    }

    Object.assign(product, payload);
    await product.save();

    return product.get();
}

async function _delete(id) {
    const product = await getProduct(id);
    await product.destroy();
}

async function getProduct(id) {
    const product = await db.Product.findByPk(id);
    if (!product) throw new Error('Produto não encontrado!');
    return product;
}

async function productAlreadyExists(product) {
    const productFound = await db.Product.findOne({ where: { nome: product.nome } });
    
    if(productFound) {
        return true;
    }

    return false;
}

async function unvalidProduct(product, payload) {
    if(payload.nome && product.nome !== payload.nome) {
        return await productAlreadyExists(payload);
    }

    return false;
}

async function categoryExists(id) {
    const count = await db.Category.count({ where: { id: id } });

    if (count != 0) {
        return true;
    }

    return false;
}

async function providerExists(id) {
    const count = await db.Provider.count({ where: { id: id } });

    if (count != 0) {
        return true;
    }

    return false;
}