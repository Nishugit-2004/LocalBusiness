import jwt from 'jsonwebtoken'
const authMiddleware = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
    try {
        const decoded = jwt.verify(token, process.env.secret);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ message: 'No token provided' });
  
    try {
      const decoded = jwt.verify(token, 'admintoken'); // Match the secret used in login
      req.admin = decoded.admin; // will have id, name, email
      next();
    } catch (err) {
      res.status(403).json({ message: 'Token is not valid' });
    }
  };

export default authMiddleware;
