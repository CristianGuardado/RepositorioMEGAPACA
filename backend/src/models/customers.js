/*campos
name
lastName
birthdate
email
password
isVerified
loginAttemps
timeOut

*/


import { Schema, model } from "mongoose";

const customersSchema = new Schema ({

    name: {type:String},
    lastName: {type:String},
    birthday: {type:Date},
    email: {type: String},
    password: {type:String},
    isVerified: {type: Boolean},
    loginAttemps: {type:Number},
    timeOut: {type:Date},
},
{
    timestamps: true,
    strict: false,
},
);

export default model("Customers",customersSchema);