import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export {__dirname};


export const setUserSession = (req, res, next) => {
    res.locals.user = req.session.user;
    next();
  };  
 