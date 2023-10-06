import express from "express";
import productController from "../controllers/productsController.js";
const router = express.Router();
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


router.get('/', productController.list);
router.get('/detail/:pid', productController.detalleProducto);
router.get('/create', productController.create);
router.post('/create', upload.single('thumbnail'), productController.store);
router.get('/edit/:pid', productController.edit);
router.put('/edit/:pid', upload.single('thumbnail'), productController.edited);
router.delete('/delete/:id', productController.delete);

export default router;
