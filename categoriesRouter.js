import express from "express";
import { getAllCategories, addCategory } from "../categories.js";

const router = express.Router();

//Returns all categories to the front end
router.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});


//Tells backend to add category to sql
router.post("/categories", async (req, res) => {
  try{
    const {catName} = req.body;
    
    if(!catName) {
      return res.status(400).json({ error: "Category name required" });
    }
    
    const newId = await addCategory(catName);
    res.json({newId});
  } catch (err) {
    console.error("POST /categories error:", err);
    res.status(500).json({ error: "Failed to add category" });
  }
  
});

export default router;
