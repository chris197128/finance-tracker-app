import pool from "./db.js";


// Get all categories from SQL
export async function getAllCategories() {
  try {
    const [rows] = await pool.query(`SELECT * FROM categories`);
    return rows;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }

}

//Adds new category to SQL
export async function addCategory(catName) {
  try{
    const[rows] = await pool.query(`INSERT INTO categories (name) VALUES(?)`, [catName]);
    return rows.insertId;
  }catch(err){
    console.error("DB ERROR:", err);
    throw err;
  }
}