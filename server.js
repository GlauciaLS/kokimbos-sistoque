require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/users', require('./users/users.controller'));
app.use('/type-users', require('./typeUser/typeUsers.controller'));
app.use('/representatives', require('./representative/representatives.controller'));
app.use('/providers', require('./provider/providers.controller'));
app.use('/categories', require('./category/categories.controller'))
app.use('/products', require('./product/products.controller'));
app.use('/recipes', require('./recipe/recipes.controller'))
app.use('/recipe-categories', require('./recipe-category/recipe-categories.controller'))
app.use('/inventories', require('./inventory/inventories.controller'))
app.use('/orders', require('./order/orders.controller'))
app.use('/', require('./healthcheck/healthcheck.controller'))

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));