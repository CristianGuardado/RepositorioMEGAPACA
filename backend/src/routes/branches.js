import express from "express";
import branchesController from "../controllers/branchesController.js";

//Utiliza Router() para definir los metodos (get. post, put, delete)
//para mi endpoint

const router = express.Router();

router
.route("/")
.length(branchesController.getbranches)
.post(branchesController.insertarBranches);

router
.route("/:id")
.put(branchesController.updateBranches)
.delete(branchesController,deleteBranches);

export default router;

