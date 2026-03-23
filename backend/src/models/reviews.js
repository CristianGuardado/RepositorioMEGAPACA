/*
campos

idEmployee
idProducts
rating(Number)
comment(string)
*/

import { Schema, model } from "mongoose";

const reviewsSchema = new Schema ({
     idEmployee:{
        type: String
    },
    idProducts: {
        type: String
    },
    rating: {
        type: Number
    },
    comment: {
        type: String
    } 
},{
    timestamps: true,
    strict: false
})
export default model("reviews", reviewsSchema)