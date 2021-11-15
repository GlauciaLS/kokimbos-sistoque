const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        idPedido: { type: DataTypes.INTEGER, allowNull: false },
        idReceita: { type: DataTypes.INTEGER, allowNull: false },
        qtd: { type: DataTypes.INTEGER, allowNull: false },
    };

    const options = {
        defaultScope: {
            attributes: { exclude: [] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('OrderRecipe', attributes, options);
}