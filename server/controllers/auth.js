import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import user from "../models/user.js" 

export const register= async (req,res) => {
    try {
        const {
            firstName,
            lastName,
            email, 
            password,
            picturePath,
            location,
            occupation
        } = req.body;
        // generate a key to encrypted the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt); 

        const newUser = new user({
            firstName,
            lastName,
            email,
            password:passwordHash,
            picturePath,
            friends:[],
            location,
            occupation,
            viewedProfile:Math.floor(Math.random()*10000),
            impression:Math.floor(Math.random()*10000)
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json({ error : err.message });
    }
};

// logging in

export const login = async (req,res)=>{
    try {
        const { email, password} =req.body;
        const User = await user.findOne({email:email});
        if(!User ) return res.status(400).json({msg : "User does not exist. "});
        const isMatch = await bcrypt.compare( password, User.password );
        if(! isMatch)return res.status(400).json({msg : "Invalid username or password."});

        const token =jwt.sign({id : User._id}, process.env.JWT_SECRET);
        delete User.password;
        res.status(200).json({ token,User});
        
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}