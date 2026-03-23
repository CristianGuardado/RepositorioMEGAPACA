import express from "express";
import employeesController from "../controllers/employeesController.js";

//utilizar ROuter()
const router = express.Router();

router
.route("/")
.get(employeesController.getEmployees)
.post(employeesController.insertEmployee);

router
.route("/:id")
