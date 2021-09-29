const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        nome: { type: DataTypes.STRING, allowNull: false },
        celular: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: [] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Representative', attributes, options);
}