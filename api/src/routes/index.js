const { Router } = require('express');
// Importar todos los routers;
const ProductRoutes = require('./products');
const UserRoutes = require('./users');
const CategoryRouter = require('./categories');

const router = Router();
router.use('/categories', CategoryRouter);
router.use('/products', ProductRoutes);

router.use('/users', UserRoutes);

module.exports = router;