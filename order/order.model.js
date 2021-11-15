const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        dataPedido: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
    };

    const options = {
        defaultScope: {
            attributes: { exclude: [] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Order', attributes, options);
}