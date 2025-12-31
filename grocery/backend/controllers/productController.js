import { Product } from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export const addProduct = async (req,res)=>{
    
    try {

         const { name, price, category, stock, description } = req.body;

    // validation
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image required" });
    }


    // upload images to cloudinary
    const imageUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "products",
          resource_type: "image"
        }
      );

      imageUrls.push(result.secure_url);
    }

    const product = await Product.create({
      name,
      price,
      category,
      stock,
      description,
      images: imageUrls
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });


        
    } catch (error) {
     
        
         res.status(500).json({ message: error.message });
    }

};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

   return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    return  res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const { name, price, category, stock, description } = req.body;

    // update fields
    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (description) product.description = description;

    // new images upload
    if (req.files && req.files.length > 0) {
      const imageUrls = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            folder: "products",
            resource_type: "image"
          }
        );

        imageUrls.push(result.secure_url);
      }

      product.images = imageUrls;
    }

    await product.save();

    res.status(200).json({ message: "Product updated successfully",
      product
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // 1️⃣ Product check
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    

    // 3️⃣ Delete product from MongoDB
    await product.deleteOne();

    res.status(200).json({
      message: "Product & Cloudinary images deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllProductsSearch = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    let query = {};

    // 🔍 Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // 📦 Category filter
    if (category) {
      query.category = category;
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 📊 Only available stock
    query.stock = { $gt: 0 };

    const products = await Product.find(query);

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getAllProductsPagination= async (req, res) => {
  try {
    const { page = 1, limit = 5, search, category } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




