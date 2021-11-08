const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        idReceita: { type: DataTypes.INTEGER, allowNull: false },
        idProduto: { type: DataTypes.INTEGER, allowNull: false },
        qtd: { type: DataTypes.DOUBLE, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: [] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('RecipeProduct', attributes, options);
}