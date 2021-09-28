const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const typeUserService = require('./typeUser.service');

router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    typeUserService.create(req.body)
        .then(() => res.json({ message: 'Cadastrado com sucesso!' }))
        .catch(next);
}

function getAll(req, res, next) {
    typeUserService.getAll()
        .then(typeUsers => res.json(typeUsers))
        .catch(next);
}

function getById(req, res, next) {
    typeUserService.getById(req.params.id)
        .then(typeUser => res.json(typeUser))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    typeUserService.update(req.params.id, req.body)
        .then(typeUser => res.json(typeUser))
        .catch(next);
}

function _delete(req, res, next) {
    typeUserService.delete(req.params.id)
        .then(() => res.json({ message: 'Tipo de usuário deletado com sucesso!' }))
        .catch(next);
}