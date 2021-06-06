const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('We are on sample1');
 });

module.exports = router;