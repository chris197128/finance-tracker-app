
import express from "express";
import cors from "cors";
import categoriesRouter from "./api/categoriesRouter.js";
import transactionsRouter from "./api/transactionsRouter.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(categoriesRouter);
app.use(transactionsRouter);


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
