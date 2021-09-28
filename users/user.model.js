const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        nome: { type: DataTypes.STRING, allowNull: false },
        cargo: { type: DataTypes.STRING, allowNull: false },
        dataNascimento: { type: DataTypes.DATEONLY, allowNull: false },
        cpf: { type: DataTypes.STRING, allowNull: false },
        rg: { type: DataTypes.STRING, allowNull: false },
        telefone: { type: DataTypes.STRING, allowNull: false },
        tipoUsuario: { type: DataTypes.INTEGER, allowNull: false },
        login: { type: DataTypes.STRING, allowNull: false },
        senha: { type: DataTypes.STRING, allowNull: false },
        hash: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}