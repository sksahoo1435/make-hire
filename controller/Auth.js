const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../model/userSchema');
const bcrypt = require('bcrypt')

exports.signUp = async (req, res) => {
    try {
        const { name, role, email, password,address,image,workArea,workExperience,mobile,details } = req.body;

        // Check if the user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new users({
            name,
            role,
            email,
            password: hashedPassword, // Store the hashed password
            address,
            image,
            workArea,
            workExperience,
            mobile,details
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ email: savedUser.email, userId: savedUser._id }, process.env.SECRET, { expiresIn: '1h' });

        // Send response with token
        res.status(201).json({ message: 'User created successfully', user: savedUser, token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logIn = async (req, res) => {
    try{

        const user = await users.findOne({email:req.body.email});

        const isAuth = bcrypt.compareSync(req.body.password,user.password);

        if(!isAuth){
            throw new Error('Something Wents Wrong');
        }else{
            const token = jwt.sign({ email: req.body.email }, process.env.SECRET);
            user.token = token;
            await user.save();
            res.status(200).json({message:"LogIn successfully ", token:token });
        }



    }catch(error){
        res.status(500).json({message:'Internal server error'})
    }
}

