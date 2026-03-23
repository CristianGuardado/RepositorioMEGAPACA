//Creamos un array de funciones
const employeesController = {};


//Importar el Schema de la collecion que voy a utilizar
import employeesModel from "../models/employees.js";

//SELECT
employeesController.getEmployees = async(req, res) => {
    const employees = await employeesModel.find();
    res.json(employees);
};

//INSERT
employeesController.insertEmployee = async(req, res) => { 

    //1 Solicitar los datos
    const {name, lastName, salary, DUI, phone, email, password, idBranches } =
    req.body;

    //2 Llena mi modelo con los datos que acabo de pedir 
    const newEmployee = new employeesModel({
        name,
        lastName,
        salary,
        DUI,
        phone,
        email,
        password,
        idBranches,
    });

    //3 Guardo todo en la base de datos
    await newEmployee.save();

    res.json({message: "Employee saved"})
};

//ELIMINAR
employeesController.deleteEmployee = async(req, res) => {
    await employeesModel.findByIdAndDelete(req.params.id);
    res.json({message: "Employee deleted"})
};




//ACTUALIZAR
employeesController.updateEmployee = async (req, res) =>{

    //1 Solicito los nuevos datos
    const{name, lastName, salary, DUI, phone, email, password, idBranches } = req.body;
    //2 actualizo
    await employeesModel.findByIdAndUpdate(
        req.params.id,
        {
            name,
            lastName,
            salary,
            DUI,
            phone,
            email,
            password,
            idBranches,
        },
        {new: true},
    );

    res.json({message: "Employee update"});
 };

 export default employeesController;