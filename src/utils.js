import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export {__dirname};

//SESSION
export const setUserSession = (req, res, next) => {
    res.locals.user = req.session.user;
    next();
  };
    
//HASHEO 
  export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

//JSONWEBTOKEN
const PRIVATE_KEY = 'CoderHoasd12 as21nj'
export const generateToken = user => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' })
    return token
}
export const authToken = (req, res, next) => {
    const token = req.headers.auth
    if(!token) return res.status(401).send({error: 'No auth'})
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: 'No authorized'})
        req.user = credentials.user
        next()
    })
}

 