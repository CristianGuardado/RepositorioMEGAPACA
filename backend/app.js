import express from 'express';
import productRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employeesController from './src/routes/employees.js';
import customerRoutes from "./src/routes/customer.js";



//Creo una constante que guarde Express
const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employeesController);
app.use("/api/customers", customerRoutes );
app.use("api/registerCustomer")

export default app;