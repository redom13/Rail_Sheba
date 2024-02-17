const express=require('express')
const router=express.Router()
const db=require('../db/db')
const authorize=require('../middlewares/authorize')

function isEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
}

router.get('/',authorize,async(req,res)=>{
    try{
        const {username}=req.user;
        if (!isEmail(username)) {
            const user=await db.execute('SELECT * FROM passengers WHERE contact_no=:username',[username],db.options)
            res.json(user.rows[0])
        }
        else{
            const user=await db.execute('SELECT * FROM passengers WHERE email=:username',[username],db.options)
            res.json(user.rows[0])
        }
    }
    catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports=router