const config = require('config.json');
const { Pool, Client } = require('pg');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    const { host, port, user, password, database } = config.database;
    const sequelize = new Sequelize(`postgres://${user}:${password}@${host}:${port}/${database}`, {dialect: 'postgres', ssl: true, dialectOptions: {
      ssl: true
    }});
    
    db.User = require('../users/user.model')(sequelize);
    db.TypeUser = require('../typeUser/typeUser.model')(sequelize);
    db.Provider = require('../provider/provider.model')(sequelize);
    db.Representative = require('../representative/representative.model')(sequelize);
    db.Category = require('../category/category.model')(sequelize);
    db.Product = require('../product/product.model')(sequelize);
    db.Recipe = require('../recipe/recipe.model')(sequelize);
    db.RecipeProduct = require('../recipe-product/recipe-product.model')(sequelize);
    db.Inventory = require('../inventory/inventory.model')(sequelize);

    await sequelize.sync();
    
    //await connection.query(`INSERT INTO kokimbosbackend.typeusers (id, nome, createdAt, updatedAt) VALUES ('1', '1', '2001-01-01', '2001-01-01');`);
    //await connection.query(`INSERT INTO kokimbosbackend.users (id, nome, cargo, dataNascimento, cpf, rg, telefone, tipoUsuario, login, senha, hash, createdAt, updatedAt) VALUES ('1', 'Admin', 'Admin', '2000-01-01', '111.111.111-11', '22.222.222-2', '5555-5555', '1', 'admin', 'admin', '$2a$10$BnH.xm/PzRTKIszhjI.Wuuegi.OxfepEdheBAVV34GoiGBsy6KJRO', '2000-01-01', '2000-01-01');`);
}
