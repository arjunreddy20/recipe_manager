const { verifyToken } = require('../config/auth');

const authenticate = (req, res, next) => {
  try{
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.replace('Bearer ', ''); 
    //console.log("authtoken", token);
  
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });
  
    req.user = decoded;
    next();
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
};

module.exports = { authenticate };