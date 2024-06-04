import mongoose from 'mongoose';
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, 
      index: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true, 
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select : false,
    },
    photo: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },  
    },
    gender : {
      type : String,
      required: true,
      enum: ["male", "female","others"],
    },
    age : {
      type : Number,
      required: true,
    },
    resetToken : {
      type : String,
      default : ""
    },
  },
  { timestamps: true }
);



userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}



export const User = mongoose.model('User', userSchema);

