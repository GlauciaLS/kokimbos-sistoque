const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        razaoSocial: { type: DataTypes.STRING, allowNull: false },
        cnpj: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        telefone: { type: DataTypes.STRING, allowNull: true },
        nomeFantasia: { type: DataTypes.STRING, allowNull: true },
        site: { type: DataTypes.STRING, allowNull: true },
        celular: { type: DataTypes.INTEGER, allowNull: true },
        cep: { type: DataTypes.STRING, allowNull: false },
        nomeEndereco: { type: DataTypes.STRING, allowNull: false },
        numero: { type: DataTypes.STRING, allowNull: false },
        complemento: { type: DataTypes.STRING, allowNull: true },
        bairro: { type: DataTypes.STRING, allowNull: false },
        cidade: { type: DataTypes.STRING, allowNull: false },
        estado: { type: DataTypes.STRING, allowNull: false },
        representante: { type: DataTypes.INTEGER, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: [] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Provider', attributes, options);
}