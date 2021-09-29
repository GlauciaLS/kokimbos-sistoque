const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const representativeService = require('./representative.service');

router.post('/register', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        celular: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    representativeService.create(req.body)
        .then(() => res.json({ message: 'Cadastrado com sucesso!' }))
        .catch(next);
}

function getAll(req, res, next) {
    representativeService.getAll()
        .then(representatives => res.json(representatives))
        .catch(next);
}

function getById(req, res, next) {
    representativeService.getById(req.params.id)
        .then(representative => res.json(representative))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(),
        celular: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    representativeService.update(req.params.id, req.body)
        .then(representative => res.json(representative))
        .catch(next);
}

function _delete(req, res, next) {
    representativeService.delete(req.params.id)
        .then(() => res.json({ message: 'Representante deletado com sucesso!' }))
        .catch(next);
}