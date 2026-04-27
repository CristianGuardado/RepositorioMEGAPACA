//Crea un array de 
const productsController = {};

//Importar el Schema de la coleccion que vamos a utilizar
import productsModel from "../models/products.js"

//SELECT
productsController.getProducts = async (req, res) =>{
    const products = await productsModel.find()
    res.json(products)
}

//INSERT 
productsController.insertProducts = async (req, res) => { 
    //1# Solicito los datos a guardar
    const {name, descrption, price, stock} = req.body;
    //2# Lleno una instancia de mi Shema
    const NewProduct = new productsModel({name, descrption,price,stock})
    //3# guardar en la base de datos
    await NewProduct.save()

    res.json({message: "Product Saved"}) 
};

//ELiminar
productsController.deleteProducts = async(req, res) =>{
    await productsModel.findByIdAndDelete(req.params.id);
    res.json({message: "Product deleted "});
};


//ACTUALIZAR
productsController.updateProducts = async (req,res) =>{
    //#1 Pido los nuevos datos
    const{ name,descrption, price, stock} = req.body;
    //#2 actualizo los datos
    await productsModel.findByIdAndUpdate(req.params.id,{
        name,
        descrption,
        price,
        stock,
    }, {new:true});

    res.json({message: "product updated"})
};

export default productsController;

