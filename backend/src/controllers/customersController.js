
import customersModel from "../models/customers.js";


//Array de funciones
const customersController = { };

customersController.getCustomer = async (req, res) =>{ 
    try{
        const customers = await customersModel.find();
        return res.status(200).json(customers);
    } catch(error){
        console.log("error"+ error);
        return res.status(500).json({message: "Internal server error"})
    }
};

//UPDATE
customersController.updateCustomer = async (req, res) =>{ 
    try{
        //Solicitamos los nuevos datos
        let{
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttemps,
            timeOut,
        } = req.body;

        //Validaciones
        name = name?.trim()
       email = email?.trim()


    //Valores requeridos
    if(!name || !email || !password){
        return res.status(400).json({message: "Fields requered"})
    }

    //Validaciones de fechas
    if(birthdate > new Date || birthdate < new Date("1901-01-01")){
        return res.status(400).json({message: "Invalid date"})
    }

    const customersUpdated = await customersModel.findByIdAndUpdate(
        req.params.id,
        {
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttemps,
            timeOut,
        },
        {new: true },
    );

    if(!customersUpdated){
        return res.status(404).json({message: "Customer not found"})
    }
    return res.status(200).json({message: "Customer updated"})

    }catch(error){  
        console.log("error " + error);
        return res.status(500).json({message: "Internal server error"});
    }
};


//ELIMINAR
customersController.deleteCustomer = async (req, res) =>{
    try{
        const deleteCustomer = customersModel.findByIdAndDelete(req.params.id);


        //si no se elimino es porque no encontro el id
        if(!deleteCustomer) { 
            returnres.status(404).json({message: "Customer not found"});
        }

     return res.status(200).json({message: "customerdeleted"});
    }catch(error) {
        console.log("error" + error );
        return res.status(500).json({message: "Internal server error"})
    }
};
export default customersController;