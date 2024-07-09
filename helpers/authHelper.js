const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// generate hashed password
const hashedPassword = (password)=>{
   try {
    const salt = bcrypt.genSaltSync(10);
   return bcrypt.hashSync(password, salt);
   } catch (error) {
     console.log(error);
   }
}

// compare gashed password
const comparePassword = (password, hashpassword)=>{
   try {
     return bcrypt.compareSync(password, hashpassword)
   } catch (error) {
    console.log(error);
   }
}

// create token
const createToken = (id) => {
  try {
      return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1d' })
  } catch (error) {
      console.log(error);
  }
}

module.exports = {hashedPassword, comparePassword, createToken};

