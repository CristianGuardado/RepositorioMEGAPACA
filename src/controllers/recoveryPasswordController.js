import jsonwebtoken from "jsonwebtoken"; //Generar tokens
import bcrypt from "bcryptjs"; //Encriptar contraseña
import crypto from "crypto"; //Generara codigo aleatorio
import nodemailer from "nodemailer"; //Enviar correos

import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";

import { config  } from "../../config.js";
import customerModel from "../models/customers.js"




//Array de funciones
const recoveryPasswordController = {};

recoveryPasswordController.requestCode = async (req, res) =>{
    try{

        //1# Solicitamos los datos
        const { email } = req.body;

        //Validar que el correo si exista en la base de datos
        const userFound = await customerModel.findOne({ email });

        if(!userFound){
            return res.status(404).json({message: "User not found"})
        }

        //gernerar el codigo aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex")


        //Guardadmos todo en un token
        const token = jsonwebtoken.sign(
            //#1  Que vamos a guardar?
            {email, randomCode, userType: "customer", verified: false},
            //#2 clave secreta
            config.JWT.secret,
            //#3 Cuanto expira?
            {expiresIn: "15m"}
        )


        res.cookie("recoveryCookie", token, {maxAge: 15 * 60 * 1000})


        //Enviar por corero electronico el codigo que generamos

        //#1 - Quien lo envia? 
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })


        //#2 mailOptions -> Quien lo envia y como? 
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Codigo de recuperacion",
            body: "El codigo expira en 15 minutos",
            html: HTMLRecoveryEmail(randomCode)
        }


        //#3 Enviar el correo electronico
        transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                return res.status(500).json({message: "Error sending email"})
            }
        })

        return res.status(200).json({message : "Email sent"})
        
    }catch (error ) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

recoveryPasswordController.verifyCode = async (req, res) => { 
    try{
        //1# Solicitamos los datos
        const { code } = req.body;

        //Obtenemos la informacion que esta dentro del token 
        //Accedemos a la cookie
        const token = req.cookies.recoveryCookie;

        const decoded = jsonwebtoken.verify(token, config.JWT.secret)


        //Ahora comparo el codigo que el usuario escribio con el que esta dentro del teokne
        if(code !== decoded,randomCode){
                return res.status(400).json({message: "Invalid code"})
        }



        //En cambio, si escribe bien el codigo vamos a colocar en el token que ya esta verificado
        const newToken = jsonwebtoken.sign(
            //1# que vamos a guardar?
            {email: decoded.email, userType: "Customer", verified: true },
            //2# Calve secreta
            config.JWT.secret,
            //3# Cuado expira? 
            {expiresIn: "15m"}
        );

        res.cookie("recoveryCookie", newToken, {maxAge: 15 * 60 * 1000});

        return res.status(200).json({message: "Code verified successfully"});

    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server error"})

    }
};


recoveryPasswordController.newPassword = async (req, res) => { 
    try { 
        //1# Solicitamos los datos
        const {newPassword, confirmNewPassword} = req.body;


        //Comparo las dos contraseñas 
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({message: "Password doesnt match"})
        }

        //Vamos comprobar que la constante verified que esta en el token
        //ya que em true (o sea que  haya pasado por el paso 2)
        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);


        if(!decoded.verified){
            return res.status(400).json({message: "Code note verified"})
        }


        //ENCRIPTAR
        const passwordHash = await bcrypt.hash(newPassword, 10)

        //Actulizamos la contraseña en la base de datos
        await customerModel.findOneAndUpdate(
            { email: decoded.email},
            { password: passwordHash },
            { new: true} ,
        );

        res.clearCookie("recoveyCookie");

        return res.status(200).json({message: "Password Update"})
    }catch (error){ 
        console.log("error"+error)
        return res.status(500).json({ message: "Internal Sever error"});
    }
};

export default recoveryPasswordController;
