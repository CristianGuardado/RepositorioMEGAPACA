import express from "express"
import customersController from "../controllers/customersController.js"

//Usamos Router() de la libreria
//Definir los metodos HTTP a utlizar
const router = express.Router();

router.route("/")
.get(customersController.getCustomer);


router.route ("/:id")
.put(customersController.updateCustomer)
.delete(customersController.deleteCustomer);

export default router; 