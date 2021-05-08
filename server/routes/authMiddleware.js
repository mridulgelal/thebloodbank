const express = require('express');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config({path: '../.env'})

module.exports = (req, res, next) =>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/loginregister');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/loginregister')
    }
}



// module.exports = (req, res, next) =>{
//     try{
//     const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
//     req.userData = decoded;
//     next();
//     } catch(error){
//         return res.send(401).json({
//             message: 'failed'
//         });
//     }
   
// }