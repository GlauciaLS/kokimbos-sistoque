const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    getByCategoryId,
    create,
    update,
    delete: _delete
};

async function getAll() {
    var returnList = [];
    var recipes = await db.Recipe.findAll();

    for(let recipe of recipes) {
        let recipeMapped = await getRecipeProducts(recipe);
        returnList.push(recipeMapped);  
    }

    return returnList;
}

async function getById(id) {
    let recipe = await getRecipe(id);
    return await getRecipeProducts(recipe);
}

async function getByCategoryId(id) {
    const recipeCategoryExists = await findRecipeCategory(id);
    if(!recipeCategoryExists) {
        throw new Error('Tipo de receita não encontrada!');
    }

    var returnList = [];
    let recipes = await db.Recipe.findAll({ where: { categoriaReceita: id }});

    for(let recipe of recipes) {
        let recipeMapped = await getRecipeProducts(recipe);
        returnList.push(recipeMapped); 
    }

    return returnList;
}

async function create(payload) {
    if (await db.Recipe.findOne({ where: { nome: payload.nome } })) {
        throw new Error('Receita já cadastrada!');
    }

    const recipeCategoryExists = await findRecipeCategory(payload.categoriaReceita);
    if(!recipeCategoryExists) {
        throw new Error('Tipo de receita não encontrada!');
    }

    const produtos = payload.produtos;
    for(let produto of produtos) {
        const productIsValid = await productAlreadyExists(produto);
        if(!productIsValid) {
            throw new Error('O produto de id ' + produto.id + ' não existe!');
        }
    }

    const recipe = await db.Recipe.create(payload);
    for(let produto of produtos) {
        const produtoMapeado = {};

        produtoMapeado.idReceita = recipe.id;
        produtoMapeado.idProduto = produto.id;
        produtoMapeado.qtd = produto.qtd;

        db.RecipeProduct.create(produtoMapeado);
    } 
}

async function update(id, payload) {

    const recipeCategoryExists = await findRecipeCategory(payload.categoriaReceita);
    if(!recipeCategoryExists) {
        throw new Error('Tipo de receita não encontrada!');
    }

    const recipe = await getRecipe(id);

    const recipeChanged = payload.nome && recipe.nome !== payload.nome;

    if (recipeChanged && await db.Recipe.findOne({ where: { nome: payload.nome } })) {
        throw new Error('A receita "' + payload.nome + '" já existe!');
    }

    const produtos = payload.produtos;
    for(let produto of produtos) {
        const productIsValid = await productAlreadyExists(produto);
        if(!productIsValid) {
            throw new Error('O produto de id ' + produto.id + ' não existe!');
        }
    }

    Object.assign(recipe, payload);
    await recipe.save();

    return await updateRecipeProducts(id, payload);
}

async function _delete(id) {
    const recipe = await getRecipe(id);

    let productsById = await db.RecipeProduct.findAll({ where: { 
        idReceita: id
    }});

    for(let product of productsById) {
        await product.destroy();
    }

    await recipe.destroy();
}

async function getRecipe(id) {
    const recipe = await db.Recipe.findByPk(id);
    if (!recipe) throw new Error('Receita não encontrada!');
    return recipe;
}

async function productAlreadyExists(product) {
    const productFound = await db.Product.findOne({ where: { id: product.id } });
    
    if(productFound) {
        return true;
    }

    return false;
}

async function getRecipeProducts(recipe) {
    var products = [];
    
    const productsById = await db.RecipeProduct.findAll({ where: { 
        idReceita: recipe.id
    }});

    for(let product of productsById) {
        let productMapped = {};

        const productFound = await db.Product.findOne({
            where: {
                id: product.idProduto
            }
        });

        productMapped.nome = productFound.nome;
        productMapped.qtd = product.qtd;

        products.push(productMapped);
    }

    recipe.dataValues.produtos = products;

    return recipe;
}

async function updateRecipeProducts(id, recipe) {
    let recipeReturn = {};
    recipeReturn.id = id;
    recipeReturn.produtos = [];

    let productsById = await db.RecipeProduct.findAll({ where: { 
        idReceita: id
    }});

    for(let product of productsById) {
        await product.destroy();
    }

    for(let produto of recipe.produtos) {
        const produtoMapeado = {};

        produtoMapeado.idProduto = produto.id;
        produtoMapeado.qtd = produto.qtd;

        db.RecipeProduct.create(produtoMapeado);

        const productFound = await db.Product.findOne({
            where: {
                id: produto.id
            }
        });

        recipeReturn.produtos.push({
            nome: productFound.nome,
            qtd: produto.qtd
        });
    }    

    return recipeReturn;
}

async function findRecipeCategory(id) {
    const count = await db.RecipeCategory.count({ where: { id: id } });

    if (count != 0) {
        return true;
    }

    return false;
}