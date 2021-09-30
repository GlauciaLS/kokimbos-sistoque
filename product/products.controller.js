const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const productService = require('./product.service');

router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        descricao: Joi.string().required(),
        unidadeMedida: Joi.string().required(),
        preco: Joi.number().required(),
        localArmazenamento: Joi.string().required(),
        categoria: Joi.number().required(),
        fornecedor: Joi.number().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    productService.create(req.body)
        .then(() => res.json({ message: 'Cadastrado com sucesso!' }))
        .catch(next);
}

function getAll(req, res, next) {
    productService.getAll()
        .then(products => res.json(products))
        .catch(next);
}

function getById(req, res, next) {
    productService.getById(req.params.id)
        .then(product => res.json(product))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(),
        descricao: Joi.string().empty(),
        unidadeMedida: Joi.string().empty(),
        preco: Joi.number().empty(),
        localArmazenamento: Joi.string().empty(),
        categoria: Joi.number().empty(),
        fornecedor: Joi.number().empty(),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    productService.update(req.params.id, req.body)
        .then(product => res.json(product))
        .catch(next);
}

function _delete(req, res, next) {
    productService.delete(req.params.id)
        .then(() => res.json({ message: 'Produto deletado com sucesso!' }))
        .catch(next);
}