import express from 'express';

//Creo una constante que guarde Express
const app = express();

app.use(express.json());

app.use("/api/products", productRoutes)

export default app;