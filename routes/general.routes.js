const express = require ('express');
const router = express.Router();
const path = require('path');

router.get ('/mussum', (req, res) => {
    res.sendFile(path.resolve('algo.html'))
})

router.get ('/', (req, res) => {
    res.send ('Hello World')
})

router.get ('/oi', (req, res) => {
    res.send ('oi')
})

module.exports = router