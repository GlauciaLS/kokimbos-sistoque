const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const inventoryService = require('./inventory.service');

router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.get('/product/:id', authorize(), getInventoryByProductId);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        idProduto: Joi.number().empty(),
        qtd: Joi.number().empty(),
        dataRecebimento: Joi.string().empty(),
        dataVencimento: Joi.string().empty()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    inventoryService.create(req.body)
        .then(() => res.json({ message: 'Cadastrado com sucesso!' }))
        .catch(next);
}

function getAll(req, res, next) {
    inventoryService.getAll()
        .then(inventorys => res.json(inventorys))
        .catch(next);
}

function getById(req, res, next) {
    inventoryService.getById(req.params.id)
        .then(inventory => res.json(inventory))
        .catch(next);
}

function getInventoryByProductId(req, res, next) {
    inventoryService.getInventoryByProductId(req.params.id)
        .then(inventory => res.json(inventory))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        idProduto: Joi.number().empty(),
        qtd: Joi.number().empty(),
        dataRecebimento: Joi.string().empty(),
        dataVencimento: Joi.string().empty()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    inventoryService.update(req.params.id, req.body)
        .then(inventory => res.json(inventory))
        .catch(next);
}

function _delete(req, res, next) {
    inventoryService.delete(req.params.id)
        .then(() => res.json({ message: 'Estoque deletado com sucesso!' }))
        .catch(next);
}