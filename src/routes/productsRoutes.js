import productController from "../controllers/productsController.js";
import { Router } from "express";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/img');  
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  
  },
});

const upload = multer({ storage });
const router = Router()


router.post('/create', upload.single('thumbnail'), productController.store);
router.get('/edit/:pid', productController.edit);
router.put('/edited/:pid', upload.single('thumbnail'), productController.edited);
router.delete('/delete/:pid', productController.delete);


export default router;
