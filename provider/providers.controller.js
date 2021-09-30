const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const providerService = require('./provider.service');

router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        razaoSocial: Joi.string().required(),
        cnpj: Joi.string().required(),
        email: Joi.string().required(),
        telefone: Joi.string(),
        nomeFantasia: Joi.string(),
        site: Joi.string(),
        celular: Joi.string(),
        representante: Joi.number().required(),
        cep: Joi.string().required(),
        nomeEndereco: Joi.string().required(),
        numero: Joi.string().required(),
        complemento: Joi.string(),
        bairro: Joi.string().required(),
        cidade: Joi.string().required(),
        estado: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    providerService.create(req.body)
        .then(() => res.json({ message: 'Cadastrado com sucesso!' }))
        .catch(next);
}

function getAll(req, res, next) {
    providerService.getAll()
        .then(providers => res.json(providers))
        .catch(next);
}

function getById(req, res, next) {
    providerService.getById(req.params.id)
        .then(provider => res.json(provider))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        razaoSocial: Joi.string().empty(),
        cnpj: Joi.string().empty(),
        email: Joi.string().empty(),
        telefone: Joi.string().empty(),
        nomeFantasia: Joi.string().empty(),
        site: Joi.string().empty(),
        celular: Joi.string().empty(),
        representante: Joi.number().empty(),
        cep: Joi.string().empty(),
        nomeEndereco: Joi.string().empty(),
        numero: Joi.string().empty(),
        complemento: Joi.string().empty(),
        bairro: Joi.string().empty(),
        cidade: Joi.string().empty(),
        estado: Joi.string().empty()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    providerService.update(req.params.id, req.body)
        .then(provider => res.json(provider))
        .catch(next);
}

function _delete(req, res, next) {
    providerService.delete(req.params.id)
        .then(() => res.json({ message: 'Fornecedor deletado com sucesso!' }))
        .catch(next);
}