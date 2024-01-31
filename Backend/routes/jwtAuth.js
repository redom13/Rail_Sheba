const jwt=require('jsonwebtoken')
const router=require('express').Router()
const bcrypt=require('bcrypt')
const db=require('../db/db')
const jwtGenerator=require('../utils/jwtGenerator')
const authorize=require('../middlewares/authorize')
const validinfo = require("../middlewares/validinfo");
require("dotenv").config();

router.post('/register',validinfo,async(req,res)=>{
    try{
        const {nid,first_name,last_name,date_of_birth,contact_no,idtype,email,password}=req.body

        const user=await db.execute('SELECT * FROM passengers WHERE nid=:nid',[nid],db.options)
        if(user.rows.length!==0){
            return res.status(401).json('User already exists')
        }
        const username=idtype==='email'?email:contact_no;
        const binds={
            nid:nid,
            first_name:first_name,
            last_name:last_name,
            date_of_birth:date_of_birth,
            contact_no:contact_no,
            email:email,
            username:username,
            password:bcryptPassword
        }
        const salt=await bcrypt.genSalt(10)
        const bcryptPassword=await bcrypt.hash(password,salt)
        const sql='INSERT INTO passengers(nid,first_name,last_name,date_of_birth,contact_no,email) VALUES(:nid,:first_name,:last_name,:date_of_birth,:contact_no,:email);INSERT INTO LOGIN_CREDENTIALS(username,nid,login_password) values(:username,:nid,:password);'
        const newUser=await db.executeMany(sql,binds,db.options)
        const token=jwtGenerator(newUser.rows[0].nid)
        res.json({token})
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
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