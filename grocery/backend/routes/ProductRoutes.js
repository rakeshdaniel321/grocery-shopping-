import express from 'express';
import { product } from '../models/Product';
import { isAdmin } from '../middleware/authMiddleware';
import { upload } from '../middleware/multer';
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productController';


const router = express.Router();

router.post("/products",product,isAdmin,upload.array("images",5),addProduct);

router.put("/products/:id",product,isAdmin,upload.array("images",5),updateProduct);

router.delete("/products/:id",protect,isAdmin,deleteProduct);

router.get("/products",getAllProducts);
router.get("/products/:id",getProductById);

