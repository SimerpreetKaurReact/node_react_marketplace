const router = require('express').Router();
//const init = require("./init");

router.get('/api/v1', (req, res) => res.send('Oee api 3.0'));
router.use('/tours', require('./tourRoutes'));
router.use('/users', require('./userRoutes'));

router.use('/reviews', require('./reviewRoutes'));

module.exports = router;
