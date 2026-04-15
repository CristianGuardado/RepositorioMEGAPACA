import nodemailer from "nodemailer"; //Enviar correo
import crypto from "crypto";//Generar codigo aleatorio
import jsonwebtoken from "jsonwebtoken"; //token
import bcryptjs from "bcryptjs" //Encriptar

import customerModel from "../models/customers.js"


import { config } from "../../config.js";
import { format } from "path";
//array de funciones 
const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
    //Solicitar los datos 
    const {
name,
lastName,
birthdate,
email,
password,
isVerified
} = req.body;

//VALIDAR QUE EL CORREO NO EXISTA EN LA BASE DE DATOS


    try{

        const existsCustomer = await customerModel.findOne({ email});
        if(existsCustomer){
            return res.status(400).json({message: "Customer already exists"})
        }

        //ENCRIPTAR LA CONTRASEÑA!
        const passwordHashed = await bcryptjs.hash(password, 10)


        //GENERAR UN CODIGO ALEATORIO 
        const randomNumber = crypto.randomBytes(3).toString("hex")

        //GUARDAMOS EN UN TOKEN LA INFORMACION
        const token = jsonwebtoken.sign(
            //#1 Que vamos a guardar?
            {randomNumber,
            name,lastName,
            birthdate,
            email,
            password: passwordHashed,
            isVerified 
        },
        //#2 Secret Key
        config.JWT.secret,
        //#3 cuando expira
        {expiresIn: "15m"}
        );

        res.cookie("resgistrationCookie", token, {maxAge: 15 * 60 *1000})


        //ENVIAMOS EL CODIGO ALEATORIO POR CORRE ELECTRONICO
        //#1 Transporter -> ¿Quieb envia el correo?
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })

        //#2 mailOption -> quien lo recibe y como?
        const mailOptions ={
            from: config.email.user_email,
            to:email,
            subject: "Verificacion de cuenta",
            text: "Para verificar tu cuenta, utiliziza este codigo: "
            + randomNumber + "Expira en 15 minutos"
        }

        //3# Enviar el correo
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log("error"+error)
                return res.status(500).json({message:"Error sending email"})
            }
            return res.status(200).json({message:" Email send"})
        })

    }catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//VERIFICAR EL CODIGO QUE ACAMOS DE ENVIAR 
registerCustomerController.verifyCode = async (req, res) => {
    try{

        const {verificationCodeRequest} = req.body
        //Solicitamos el codigo que escribieron en el frontend
        const token = req.cookies.resgitrationCookie

        //Extraer toda la informacion del token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);
        const{
             name,
             lastName,
            birthdate,
            email,
            password,
            isVerified 
        } = decoded;

        //Comparar lo que el usuario escribio con el codigo que esta en el token
        if(verificationCodeRequest !== storedCode){
            return res.status(400).json({message: "Invalid code"})
        }

        //Si todo esta bien, y el usuario escribe el codigo lo registramos en la BD
        const NewCustomer = new customerModel({
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified: true,
        });

        await NewCustomer.save();

        res.clearCookie("resgistrationCoolie")

        return res.status(200).json({message: "Customer registered"});
        } catch (error) {
            console.log("Error" + error);
            return res.status(500).json({message: "Internal server error"});
                }
};

export default registerCustomerController;