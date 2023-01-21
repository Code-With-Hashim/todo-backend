const mongoose = require('mongoose')

const authSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
} , {
    versionKey : false,
    timestamps : true
})

const authModals = mongoose.model('grow-calculator-auth', authSchema)

module.exports = { authModals }