import express from 'express';
import productRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employeesController from './src/routes/employees.js';
import customerRoutes from "./src/routes/customer.js";
import registerCustomerRoutes from './src/routes/registerCustomer.js';
import cookieParser from 'cookie-parser';
import loginCustomersController from './src/routes/login.js';
import logoutRoutes from './src/routes/logout.js';
import cors from 'cors';
import recoveryPasssordRoutes from "./src/routes/recoveryPassword.js"


//Creo una constante que guarde Express
const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    //Permitir el envio de cookies y credenciales
    credentials: true
}),
);

app.use(cookieParser())

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employeesController);
app.use("/api/customers", customerRoutes );
//app.use("/api/registerCustomer")
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/login", loginCustomersController);
app.use("/api/logout", logoutRoutes)
app.use("/api/recoveryPassword", recoveryPasssordRoutes)

export default app;