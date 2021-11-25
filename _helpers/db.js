const config = require('config.json');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    const { host, port, user, password, database } = config.database;

    const connectionString = (process.env.DATABASE_URL ? process.env.DATABASE_URL : `postgres://${user}:${password}@${host}:${port}/${database}`);
    const connectionConfig = (process.env.NODE_ENV && process.env.NODE_ENV === "production") 
                                ? ({dialect: 'postgres', ssl: true, dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }})
                                : {dialect: 'postgres'};

    const sequelize = new Sequelize(connectionString, connectionConfig);
    
    db.User = require('../users/user.model')(sequelize);
    db.TypeUser = require('../typeUser/typeUser.model')(sequelize);
    db.Provider = require('../provider/provider.model')(sequelize);
    db.Representative = require('../representative/representative.model')(sequelize);
    db.Category = require('../category/category.model')(sequelize);
    db.Product = require('../product/product.model')(sequelize);
    db.Recipe = require('../recipe/recipe.model')(sequelize);
    db.RecipeCategory = require('../recipe-category/recipe-category.model')(sequelize);
    db.RecipeProduct = require('../recipe-product/recipe-product.model')(sequelize);
    db.Inventory = require('../inventory/inventory.model')(sequelize);
    db.Order = require('../order/order.model')(sequelize);
    db.OrderRecipe = require('../order-recipe/order-recipe.model')(sequelize);

    await sequelize.sync();
}
