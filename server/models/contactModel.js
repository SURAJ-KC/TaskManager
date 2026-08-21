
const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
    { 
        user_id:{
                 type: mongoose.Schema.Types.ObjectId,
                 require: true,
                 ref:"User",
        },
    firstname:{type:String, required:[true,"Please Add the Contect First Name"]
    },
    lastname:{type:String, required:[true,"Please Add the Contect Last Name"]
    },
    email:{type:String, required:[true,"Please Add the Contect  Email Address"]
    },
    phone:{type:String, required:[true,"Please Add the Contact Phone Number"]
    },
    password:{type:String, required:[true,"Please Add the Password"]
    },
},{ Timestamp : true});

module.exports = mongoose.model("Contact",contactSchema);