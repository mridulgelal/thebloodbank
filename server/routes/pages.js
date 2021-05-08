const express = require('express');
const router = express.Router();
const fs = require('fs')
const requireAuth = require('./authMiddleware');



const fileContent = fs.readFileSync('../thebloodbank_main/homepage.html');
const fileRegister = fs.readFileSync('../thebloodbank_main/loginregister.html');
const fileDonor = fs.readFileSync('../thebloodbank_main/userpage.html')


router.get("/", (req, res)=>{
    res.end(fileContent);
});

router.get("/loginregister", (req, res)=>{
    res.end(fileRegister);
});

router.get("/userpage", requireAuth, (req, res)=>{
    res.end(fileDonor);
})

// router.get("/login", (req, res)=>{
//     res.write("welcom");
//     res.end();
// });


router.get("/home", (req, res)=>{
    res.write("welcome to the Blood Bank");
    res.end();
});

router.get("/logout", (req, res)=>{
    res.cookie('jwt', '', {maxAge:1});
    res.redirect('/');
});

module.exports = router;