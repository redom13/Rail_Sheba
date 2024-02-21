const validRegister = function(req, res, next) {
  console.log("hi");  
  const {nid,first_name,last_name,date_of_birth,contact_no,idtype,email,password} = req.body;
  console.log(req.body)
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      console.log(!email.length);
      if (![nid,first_name,last_name,date_of_birth,contact_no,idtype,email,password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.json("Invalid Email");
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.json("Invalid Email");
      }
    }
  
    next();
  };

  const validLogin = function(req,res,next){
    const{ username,password } = req.body;

    if(req.path === "/login") {
      if(![username,password].every(Boolean)){
        return res.json("Missing Login Credentials!!");
      }
      next();
    }
  };

  module.exports={ validRegister, validLogin};