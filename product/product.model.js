const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        nome: { type: DataTypes.STRING, allowNull: false },
        descricao: { type: DataTypes.STRING, allowNull: false },
        unidadeMedida: { type: DataTypes.STRING, allowNull: false },
        preco: { type: DataTypes.DOUBLE, allowNull: false },
        localArmazenamento: { type: DataTypes.STRING, allowNull: false },
        categoria: { type: DataTypes.INTEGER, allowNull: false },
        fornecedor: { type: DataTypes.INTEGER, allowNull: false },
    };

    const options = {
        defaultScope: {
            attributes: { exclude: [] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Product', attributes, options);
}