const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        idProduto: { type: DataTypes.INTEGER, allowNull: false },
        qtd: { type: DataTypes.DOUBLE, allowNull: false },
        dataRecebimento: { type: DataTypes.STRING, allowNull: false },
        dataVencimento: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: [] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Inventory', attributes, options);
}