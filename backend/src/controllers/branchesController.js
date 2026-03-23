//Crear un array de funciones
const branchesController ={};

import branches from "../models/branches.js";
//Importara la collecion que usare
import branchesModel from "../models/branches.js";


//SELECT
branchesController.getbranches = async(req, res) => { 
    const branches = await branchesModel.find();
    res.json(branches)
};

//INSERTAR
branchesController.insertarBranches = async (req, res) =>{
    //#1 Solicitar los datos a guardar
    const { name,address,schedule,isActive}= req.body;
    
    //#2 Llenar el modelo con estos datos 
    const newBranch = new branchesModel({name, address, schedule, isActive});

    //#3 Guaradar todo en la base de datos
    await newBranch.save();

    res.json({message: "Branch saved"})
};

//DELETE 
branchesController.deleteBranches  =async (req, res) =>{
    await branchesModel.findByIdAndDelete(req.para,satisfies,id)
    res.json({message: "Branch deleted"})
}

//UPDATE
branchesController.updateBranches = async (req, res) =>{ 
    //1 Solicitar los nuevos datos
    const { name,address,schedule,isActive}= req.body;

    //2 Actualizo
    await branchesModel.findByIdAndUpdate(
        req.params.id,
        {
            name,
            address,
            schedule,
            isActive,
        },
        {new: true},
    );

    res.json({message: "Branches Update"})
};

export default branchesController;
















