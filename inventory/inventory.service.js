const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    getInventoryByProductId,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return db.Inventory.findAll();
}

async function getById(id) {
    return getInventory(id);
}

async function getInventoryByProductId(id) {
    return getByProductId(id);
}

async function create(payload) {

    const productIsValid = await productAlreadyExists(payload);
    if(!productIsValid) {
        throw new Error('O produto de id ' + payload.idProduto + ' não existe!');
    }

    await db.Inventory.create(payload);
}

async function update(id, payload) {

    const productIsValid = await productAlreadyExists(payload);
    if(!productIsValid) {
        throw new Error('O produto de id ' + payload.idProduto + ' não existe!');
    }

    const inventory = await getInventory(id);

    Object.assign(inventory, payload);
    await inventory.save();

    return inventory.get();
}

async function _delete(id) {
    const inventory = await getInventory(id);
    await inventory.destroy();
}

async function getInventory(id) {
    const inventory = await db.Inventory.findByPk(id);
    if (!inventory) throw new Error('Estoque não encontrado!');
    return inventory;
}

async function getByProductId(id) {
    const product = await db.Product.findByPk(id);
    if (!product) throw new Error('Produto não encontrado!');

    const inventories = await db.Inventory.findAll({where: {idProduto: id}});
    if (!inventories) throw new Error('Estoque não encontrado!');
    return inventories;
}

async function productAlreadyExists(payload) {
    const productFound = await db.Product.findOne({ where: { id: payload.idProduto } });
    
    if(productFound) {
        return true;
    }

    return false;
}