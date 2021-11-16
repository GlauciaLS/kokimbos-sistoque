const db = require('_helpers/db');
const Sequelize = require('sequelize');
const inventoryService = require('../inventory/inventory.service');
const userService = require('../users/user.service');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {

    var returnList = [];
    var orders = await db.Order.findAll();

    for(let order of orders) {
        let ordersMapped = await getOrdersRecipes(order);
        returnList.push(ordersMapped);  
    }

    return returnList;
}

async function getById(id) {
    let order = await getOrder(id);
    return await getOrdersRecipes(order);
}

async function create(payload, user) {

    await checkReceiptsAvailability(payload);

    payload.status = "Não finalizado";
    payload.idFuncionario = user;

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

    await checkReceiptsAvailability(payload);

    await userService.getById(payload.idFuncionario);

    const order = await getOrder(id);

    Object.assign(order, payload);
    await order.save();

    return await updateOrderRecipes(id, payload);
}

async function _delete(id) {
    const order = await getOrder(id);
    await order.destroy();
}

async function getOrder(id) {
    const order = await db.Order.findByPk(id);
    if (!order) throw new Error('Pedido não encontrado!');
    return order;
}

async function recipeExists(receita) {
    const recipeFound = await db.Recipe.findOne({ where: { id: receita.id } });
    
    if(recipeFound) {
        return true;
    }

    return false;    
}

async function getOrdersRecipes(order) {
    var recipes = [];
    
    const recipesById = await db.OrderRecipe.findAll({ where: { 
        idPedido: order.id
    }});

    for(let recipe of recipesById) {
        let recipeMapped = {};

        const recipeFound = await db.Recipe.findOne({
            where: {
                id: recipe.idReceita
            }
        });

        recipeMapped.nome = recipeFound.nome;
        recipeMapped.qtd = recipe.qtd;

        recipes.push(recipeMapped);
    }

    order.dataValues.produtos = recipes;

    return order;
}

async function checkReceiptsAvailability(payload) {
    const productsMap = new Map();

    //Get amount needed
    for(let receita of payload.receitas) {
        const receitaIsValid = await recipeExists(receita);
        if(!receitaIsValid) {
            throw new Error("A receita de ID " + receita.id + " não foi encontrada!");
        }

        const recipeProducts = await db.RecipeProduct.findAll({ where: { idReceita: receita.id }});
        for(let product of recipeProducts) {
            if(productsMap.get(product.id)) {
                let value = productsMap.get(product.id);
                value = value + (receita.qtd * product.qtd);
                productsMap.set(product.id, value);
            }
            else {
                productsMap.set(product.id, (receita.qtd * product.qtd));
            }
        }
    }

    //Check availability
    for(let [key, value] of productsMap) {
        const inventoriesList = await db.Inventory.findAll({ where: { idProduto: key }});

        var total = inventoriesList.length !== 0 ? inventoriesList.map(item => item.qtd).reduce((prev, next) => prev + next) : 0;
        
        if(total < value) {
            let product = await db.Product.findByPk(key);
            throw new Error("Não foi possível concluir o pedido pois não há " + product.nome + " o suficiente");
        }
    }

    
    await updateInventories(productsMap);
}

async function updateInventories(productsMap) {

    for(let [key, value] of productsMap) {
        let valueRemaining = value;
        
        const inventories = await db.Inventory.findAll({ where: { idProduto: key }});

        while(valueRemaining != 0) {
            for(let inventory of inventories) {
                if(inventory.qtd > valueRemaining) {
                    let newValue = inventory.qtd - valueRemaining;
                    let inventoryUpdated = await inventoryService.getById(inventory.id);
    
                    inventoryUpdated.qtd = newValue;    
                    inventoryUpdated.save();
    
                    valueRemaining = 0;
                    break;
                }
                else if(inventory.qtd === value) {
                    inventoryService.delete(inventory.id);

                    valueRemaining = 0;
                    break;
                }
                else {    
                    valueRemaining = valueRemaining - inventory.qtd;
                    inventoryService.delete(inventory.id);               
                }                
            }
        }
    }
}

async function updateOrderRecipes(id, payload) {
    let orderReturn = {};
    orderReturn.id = id;
    orderReturn.idFuncionario = payload.idFuncionario;
    orderReturn.dataPedido = payload.dataPedido;

    orderReturn.receitas = [];

    let orderRecipes = await db.OrderRecipe.findAll({ where: { 
        idPedido: id
    }});

    for(let orderRecipe of orderRecipes) {
        await orderRecipe.destroy();
    }

    for(let receita of payload.receitas) {
        const recipeMapped = {};

        recipeMapped.idPedido = id;
        recipeMapped.idReceita = receita.id;
        recipeMapped.qtd = receita.qtd;

        db.OrderRecipe.create(recipeMapped);

        const recipeFound = await db.Recipe.findOne({
            where: {
                id: receita.id
            }
        });

        orderReturn.receitas.push({
            nome: recipeFound.nome,
            qtd: receita.qtd
        });
    }    

    return orderReturn;
}