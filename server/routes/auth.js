const express = require('express');
const app = express();
const router = express.Router();
const dbs = require('../dbConnect');
const db = dbs.getConnection();
const requireAuth = require('./authMiddleware');

// const cors = require('cors');
// const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
// const session = require('express-session')
var jwt = require('jsonwebtoken');
var alert = require('alert');
const dotenv = require('dotenv');

dotenv.config({path: '../.env'})


const bcrypt = require('bcryptjs');

// app.use(
//     cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//     credentials: true
// })
// );

// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true})); 

// app.use(
//     session({
//         key: "userId",
//         secret: "subscribe",
//         resave: false, 
//         saveUnitilialized: false,
//         cookie: {
//             expires: 60 * 60 * 24,
//                 }
//         })
// );


router.post("/register",  (req, res)=>{
    console.log(req.body);
        const fname = req.body.create_fname;
        const Address = req.body.create_address;
        const contact = req.body.create_contact;
        const email = req.body.create_email;
        const password = req.body.create_password;
        const group = req.body.blood_group;

        db.query('SELECT Email FROM Donor WHERE Email = ?', [email], async (err, results)=>{
            if(err){
                console.log(err);
            }
            if(results.length>0){
               return( alert('email exsts'),console.log("registation failed"), res.redirect('/loginregister'))
            }     
            
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword)


            const queryString ="INSERT INTO Donor(Name, Address, Contact, Password,Email, Blood_group) VALUES(?,?,?,?,?,?) "
            db.query(queryString, [fname, Address, contact, hashedPassword,email, group], (err, result)=>{
                if(err){
                    console.log("falied" + err)
                     //res.sendStatus(500);   
                }
                
            
                console.log("inserted sucessfully")
                 res.redirect("/home");
                res.end()
            })
            
        });  
       
     
    });
    


    router.post('/login', async (req, res)=>{
        try{
            const email = req.body.email;
            const password = req.body.password;

            if(!email || !password){
                return( alert('enter email and password'),console.log("log in failed"))  
            }
                
                db.query('SELECT Email, password FROM Donor WHERE Email = ?', [email], async (err, results)=>{
                    console.log(results)
                  
                        if(!results || !(await bcrypt.compare(password, results[0].password))){
                            //  res.status(401)
                             
                            return( alert('email or passowrd is incorrect'),console.log("login failed"), res.redirect('/loginregister'));
                        } 
                        else{
                            const id = results[0].id;
                            
                            const token = jwt.sign({id}, process.env.JWT_SECRET, {
                                expiresIn:  24 * 60 * 60 * 1000
                            });
                            console.log("the tokenis" + token)

                            const cookieOptions = {
                                expires: new Date(
                                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                                ),
                                httpOnly: true
                            }
                            res.cookie('jwt', token, cookieOptions);
                            console.log("logged in");
                            res.status(200).redirect("/userpage")
                        }
                       
                        
                        // console.log("logged in");
                        // res.redirect("/history");
                        //  res.end()
                       
                        
                })
              

                // db.query('SELECT Email, password FROM Donor WHERE Email = ?', [email], async (err, result)=>{
                //     if (err){
                //         res.send({err:err});
                //     }

                //     if(result.length > 0){
                //         bcrypt.compare(password, result[0].password, (error, response)=>{
                //             if(response){
                                
                //               req.session.user = result;
                //               console.log(req.session.result);
                //                 res.send(result);
                                
                //             }
                //             else {
                //                 res.send({message: "wrong"});
                //             }
                //         });
                //     }
                //     else{
                //         res.send({message: "doesnt exist"})
                //     }
                // })
               
               
            
        }
        catch(error){
            console.log(error);
        }
       
        
    })



    router.post('/donor', (req, res)=>{
        const email = req.body.email;
        const date = req.body.date;
        db.query('SELECT Email FROM Donor WHERE Email = ?', [email], async (err, results)=>{
         
            if(err){
                console.log(err);
            }
            if(results.length>0){
                const queryString ="INSERT INTO donorHistory(Email, Date) VALUES(?,?) "
                db.query(queryString, [email, date], (err, results)=>{
                    console.log(results)
                    if(err){
                        console.log("falied" + err)
                         //res.sendStatus(500);   
                    }
                    
                
                    console.log("inserted sucessfully")
                     res.redirect("/");
                    res.end()
                })

            }     
            else{
                return( alert('email is incorrect'),console.log("failed"), res.redirect('/history'));
            }
        })
    })





module.exports = router;
