const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('general/landing', { title: "STEMConnect" , auth: true, listingType: "Resume"});
    
  });




module.exports = router;