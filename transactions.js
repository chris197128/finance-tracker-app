import pool from "./db.js";



// Get all transactions from SQL
export async function getAllTransactions() {
  const [rows] = await pool.query(`
    SELECT t.id, t.amount, t.description, t.date, c.name AS category, category_id
    FROM main_transactions t
    JOIN categories c ON t.category_id = c.id
    ORDER BY t.date DESC
  `);
  return rows;
}

//gets a specific transaction from SQL
export async function getTransactionById(id) {
  try{
    const [rows] = await pool.query(`
      SELECT t.id, t.amount, t.description, t.date, c.name AS category, category_id
      FROM main_transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?`, 
      [id]
    );
    return rows[0];

} catch (err){
  console.error("DB ERROR:", err);
  throw err;
}
}

//adds a transaction to SQL
export async function addTransaction(amount, category_id, description, date) {
  try{
    const [result] = await pool.query(
      'INSERT INTO main_transactions (amount, category_id, description, date) VALUES (?, ?, ?, ?)',
      [amount, category_id, description, date]
    );
    return result.insertId; 

  }catch(err){
    console.error("DB ERROR:", err);
    throw err;
  }
}

//deletes a transaction from SQL
export async function deleteTransaction(id) {
  try{
    await pool.query(
      'DELETE FROM main_transactions WHERE id = ?',
      [id]
    );
    

  }catch(err){
    console.error("DB ERROR:", err);
    throw err;
  }
}

//edits a transaction in SQL
export async function editTransaction(amount, category_id, description, date, id) {
  await pool.query(`
    UPDATE main_transactions
    SET amount = ?, category_id = ?, description = ?, date = ?
    WHERE id = ?`, 
    [amount, category_id, description, date, id]
  );
}