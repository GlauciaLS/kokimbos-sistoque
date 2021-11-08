const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const recipeService = require('./recipe.service');

router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        produtos: Joi.array().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    recipeService.create(req.body)
        .then(() => res.json({ message: 'Cadastrado com sucesso!' }))
        .catch(next);
}

function getAll(req, res, next) {
    recipeService.getAll()
        .then(categorys => res.json(categorys))
        .catch(next);
}

function getById(req, res, next) {
    recipeService.getById(req.params.id)
        .then(category => res.json(category))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(),
        produtos: Joi.array().required()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    recipeService.update(req.params.id, req.body)
        .then(category => res.json(category))
        .catch(next);
}

function _delete(req, res, next) {
    recipeService.delete(req.params.id)
        .then(() => res.json({ message: 'Receita deletada com sucesso!' }))
        .catch(next);
}