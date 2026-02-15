import express from "express";
import { getAllTransactions, addTransaction, getTransactionById, deleteTransaction, editTransaction } from "../transactions.js";




const router = express.Router();

//tells backend to add a transaction
router.post("/transactions", async (req, res) => {
    const {amount, category_id, description, date} = req.body;

    try {
        const newId = await addTransaction(amount, category_id, description, date);
        res.json({success: true, id: newId});
    }catch(err) {
        res.status(500).json({error: "Failed to add transaction" });

    }
});

//returns all transactions to frontend
router.get("/transactions", async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

//returns a specific transaction to frontend
router.get("/transactions/:id", async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "failed to fetch transaction by id"});
  }
});

//deletes a specific transaction
router.delete("/transactions/:id", async (req, res) => {
  console.log("delete route hit with id:", req.params.id);
  try {
    await deleteTransaction(req.params.id);
    res.json({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Failed to delete transaction"});
  } 
});

//edits a specific transaction
router.put("/transactions/:id", async (req, res) => {
    const {amount, category_id, description, date} = req.body;
    const id = req.params.id;

    try {
        await editTransaction(amount, category_id, description, date, id);
        res.json({success: true});
    }catch(err) {
      console.error(err);  
      res.status(500).json({error: "Failed to edit transaction" });

    }
});








export default router;

