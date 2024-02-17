const jwt=require('jsonwebtoken')
const router=require('express').Router()
const bcrypt=require('bcrypt')
const db=require('../db/db')
const jwtGenerator=require('../utils/jwtGenerator')
const authorize=require('../middlewares/authorize')
const validinfo = require("../middlewares/validinfo");
require("dotenv").config();

router.post('/register',validinfo.validRegister,async(req,res)=>{
    try{
        const {nid,first_name,last_name,date_of_birth,contact_no,idtype,email,password}=req.body

        const user=await db.execute('SELECT * FROM passengers WHERE nid=:nid',[nid],db.options)
        if(user.rows.length!==0){
            return res.status(401).json('User already exists')
        }
        const username=idtype==='email'?email:contact_no;
        console.log(nid);
        console.log(username)
        console.log(password)
        const salt=await bcrypt.genSalt(10)
        const bcryptPassword=await bcrypt.hash(password,salt)
        console.log(bcryptPassword)
        const userEmail=await db.execute('SELECT * FROM LOGIN_CREDENTIALS WHERE username=:username',[username],db.options)
        if(userEmail.rows.length!==0){
        return res.status(401).json('Username already exists!! Try different username:)')
        }
        const binds={
            nid:nid,
            first_name:first_name,
            last_name:last_name,
            date_of_birth:date_of_birth,
            contact_no:contact_no,
            email:email,
        }
        const binds2={
            username:username,
            nid:nid,
            pass:bcryptPassword,
        }
        const sql=`INSERT INTO passengers(nid,first_name,last_name,date_of_birth,contact_no,email) VALUES(:nid,:first_name,:last_name,TO_DATE(:date_of_birth,'YYYY-MM-DD'),:contact_no,:email)`
        const newUser= await db.execute(sql,binds,db.options)
        const sql2=`INSERT INTO LOGIN_CREDENTIALS(USERNAME,NID,LOGIN_PASSWORD) VALUES(:username,:nid,:pass)`
        const newUser2= await db.execute(sql2,binds2,db.options)
        const jwtToken=jwtGenerator(nid)
        res.json({jwtToken})
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

router.post('/login',validinfo.validLogin, async(req,res)=>{
    try{
        const { username,password } = req.body;
        const userLogin = await db.execute(`SELECT * FROM LOGIN_CREDENTIALS WHERE username=:username`,[username],db.options)
        if(userLogin.rows.length === 0)
        {
            return res.status(401).json('Invalid username! Please provide correct username.')
        }
        const validPassword = await bcrypt.compare(
            password,
            userLogin.rows[0].LOGIN_PASSWORD
        );
        if (!validPassword) {
            return res.status(401).json("Invalid password! Please provide correct password");
        }
        const jwtToken = jwtGenerator(userLogin.rows[0].username);
        console.log("login successful");
        return res.json({ jwtToken });
    }
    catch(err){
        console.error(err.message)
        res.status(500).send('server error');
    }
})

router.get('/verify',authorize,async(req,res)=>{
    try{
        res.json(true)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports=router