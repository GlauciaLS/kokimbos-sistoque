const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return db.RecipeCategory.findAll();
}

async function getById(id) {
    return getRecipeCategory(id);
}

async function create(payload) {
    if (await db.RecipeCategory.findOne({ where: { nome: payload.nome } })) {
        throw new Error('Categoria de receita já cadastrada!');
    }

    await db.RecipeCategory.create(payload);
}

async function update(id, payload) {
    const recipeCategory = await getRecipeCategory(id);

    const recipeCategoryChanged = payload.nome && recipeCategory.nome !== payload.nome;

    if (recipeCategoryChanged && await db.RecipeCategory.findOne({ where: { nome: payload.nome } })) {
        throw new Error('A categoria de receita"' + payload.nome + '" já existe!');
    }

    Object.assign(recipeCategory, payload);
    await recipeCategory.save();

    return recipeCategory.get();
}

async function _delete(id) {
    const recipeCategory = await getRecipeCategory(id);
    await recipeCategory.destroy();
}

async function getRecipeCategory(id) {
    const recipeCategory = await db.RecipeCategory.findByPk(id);
    if (!recipeCategory) throw new Error('Categoria de receita não encontrada!');
    return recipeCategory;
}