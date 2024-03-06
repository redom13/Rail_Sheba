const express=require('express')
const router=express.Router()
const db=require('../db/db')
const bcrypt = require("bcrypt");
const authorize=require('../middlewares/authorize')

function isEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
}

router.put('/updatePassword', authorize, async (req, res) => {
    try {
      const username = req.user.id;
      const { oldPassword, newPassword } = req.body;
        const user = await db.execute('SELECT * FROM login_credentials WHERE username=:username', [username], db.options);
        const validPassword = await bcrypt.compare(oldPassword, user.rows[0].LOGIN_PASSWORD);
        if (validPassword) {
          const salt = await bcrypt.genSalt(10);
          const bcryptPassword = await bcrypt.hash(newPassword, salt);
          await db.execute('UPDATE login_credentials SET login_password=:bcryptPassword WHERE username=:username', [bcryptPassword, username], db.options);
          res.json({ success: true, message: 'Password updated' });
        } else {
          res.json({ success: false, message: 'Incorrect password' });
        }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

router.get('/',authorize,async(req,res)=>{
    try{
        const username=req.user.id;
        console.log(username)
        if (!isEmail(username)) {
            const user=await db.execute('SELECT * FROM passengers WHERE contact_no=:username',[username],db.options)
            res.json(user.rows[0])
        }
        else{
            const user=await db.execute('SELECT * FROM passengers WHERE email=:username',[username],db.options)
            console.log(user.rows[0])
            res.json(user.rows[0])
        }
    }
    catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports=router