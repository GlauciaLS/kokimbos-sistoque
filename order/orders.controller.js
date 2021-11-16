const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const orderService = require('./order.service');

router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        dataPedido: Joi.string().required(),
        receitas: Joi.array().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    orderService.create(req.body, req.user.id)
        .then(() => res.json({ message: 'Cadastrado com sucesso!' }))
        .catch(next);
}

function getAll(req, res, next) {
    orderService.getAll()
        .then(orders => res.json(orders))
        .catch(next);
}

function getById(req, res, next) {
    orderService.getById(req.params.id)
        .then(order => res.json(order))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        idFuncionario: Joi.number().empty(),
        dataPedido: Joi.string().empty(),
        receitas: Joi.array().empty()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    orderService.update(req.params.id, req.body)
        .then(order => res.json(order))
        .catch(next);
}

function _delete(req, res, next) {
    orderService.delete(req.params.id)
        .then(() => res.json({ message: 'Pedido deletado com sucesso!' }))
        .catch(next);
}