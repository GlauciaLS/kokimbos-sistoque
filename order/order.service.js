const db = require('_helpers/db');
const Sequelize = require('sequelize');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return db.Order.findAll();
}

async function getById(id) {
    return getOrder(id);
}

async function create(payload) {

    for(let receita of payload.receitas) {
        const receitaIsValid = await recipeExists(receita);
        if(!receitaIsValid) {
            throw new Error("A receita de ID " + receita.id + " não foi encontrada!");
        }

        const recipeProducts = db.RecipeProduct.findAll({ where: { idReceita: receita.id }});
        for(let recipe of recipeProducts) {
            const inventories = db.Inventory.findAll({ where: { idProduto: recipe.idProduto }});
            let enoughProducts = false;

            for(let inventory of inventories) {
                if(inventory.qtd >= )
            }
        }
    }

    payload.status = "Não finalizado";

    const pedido = await db.Order.create(payload);
    for(let receita of payload.receitas) {
        const pedidoReceitaMapeado = {};

        pedidoReceitaMapeado.idPedido = pedido.id;
        pedidoReceitaMapeado.idReceita = receita.id;
        pedidoReceitaMapeado.qtd = receita.qtd;

        db.OrderRecipe.create(pedidoReceitaMapeado)
    }
}

async function update(id, payload) {
    const order = await getOrder(id);

    const orderChanged = payload.nome && order.nome !== payload.nome;

    if (orderChanged && await db.Order.findOne({ where: { nome: payload.nome } })) {
        throw new Error('A categoria "' + payload.nome + '" já existe!');
    }

    Object.assign(order, payload);
    await order.save();

    return order.get();
}

async function _delete(id) {
    const order = await getOrder(id);
    await order.destroy();
}

async function getOrder(id) {
    const order = await db.Order.findByPk(id);
    if (!order) throw new Error('Categoria não encontrada!');
    return order;
}

async function recipeExists(receita) {
    const recipeFound = await db.Recipe.findOne({ where: { id: receita.id } });
    
    if(recipeFound) {
        return true;
    }

    return false;    
}