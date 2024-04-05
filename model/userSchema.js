const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['employee', 'employer'] },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (v) {
                return /^[\w=\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email`
        }
    },
    password: { type: String, minLength: 6, required: true },
    token: String,
    image: String,
    address: { type: String, required: true },
    workArea: {
        type: { type: String },
        areas: {
            type: [String], required: function () {
                return this.role === 'employee';
            }
        },
    },
    mobile: { type: String, required: true },
    workExperience: { type: String, required: true },
    details: String,
})

//the users name should be same as the database clustor name

const user = mongoose.model('users', userSchema);

module.exports = user;