const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return db.Category.findAll();
}

async function getById(id) {
    return getCategory(id);
}

async function create(payload) {
    if (await db.Category.findOne({ where: { nome: payload.nome } })) {
        throw new Error('Categoria já cadastrada!');
    }

    await db.Category.create(payload);
}

async function update(id, payload) {
    const category = await getCategory(id);

    const categoryChanged = payload.nome && category.nome !== payload.nome;

    if (categoryChanged && await db.Category.findOne({ where: { nome: payload.nome } })) {
        throw new Error('A categoria "' + payload.nome + '" já existe!');
    }

    Object.assign(category, payload);
    await category.save();

    return category.get();
}

async function _delete(id) {
    const category = await getCategory(id);
    await category.destroy();
}

async function getCategory(id) {
    const category = await db.Category.findByPk(id);
    if (!category) throw new Error('Categoria não encontrada!');
    return category;
}