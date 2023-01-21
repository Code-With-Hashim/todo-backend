const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { authModals } = require('../modals/Authenticated.modals')

const authRouter = express.Router()
const SECRET_KEY = process.env.SECRET_KEY


authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body


    try {
        const existingUser = await authModals.findOne({ email })

        if (existingUser) {
            res.status(403).send({
                message: "User is Already been registered with this email ID",
                status: 'false'
            })
        } else {
            bcrypt.hash(password, 5, async function (err, hash) {
                if (err) {
                    res.status(404).send({
                        message: 'Something went wrong , Please try again',
                        status: 'false'
                    })
                } else {
                    try {

                        await authModals.create({ email, password: hash, name })

                        res.status(200).send({
                            message: 'User Created Successfully',
                            status: 'ok'
                        })

                    } catch (error) {

                        res.status(404).send({
                            message: 'Something went wrong , Please try again',
                            status: 'false'
                        })

                    }
                }
            });
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            message: 'Something went wrong , Please try again',
            status: 'false'
        })

    }
})

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {

        const isUserExist = await authModals.findOne({ email })

        if (isUserExist) {
            bcrypt.compare(password, isUserExist.password, function (err, result) {
                var token = jwt.sign({ UserId: isUserExist._id }, SECRET_KEY);

                if (result) {
                    res.status(200).send({
                        message: 'Login Successfully',
                        token,
                        status: 'ok'
                    })
                } else {
                    res.status(401).send({
                        message: 'Invalid Credential',
                        status: 'false'
                    })
                }

            });
        } else {
            res.status(401).send({
                message: 'Invalid Credential',
                status: 'false'
            })
        }

    } catch (error) {
        console.log(error)
        res.status(404).send({
            message: 'Something went wrong , Please try again',
            status: 'false'
        })
    }
})

authRouter.get("/getProfile", async (req, res) => {

    const token = req.headers.authorization?.split(" ")[1]
    
    if(token) {
        var { UserId } = jwt.verify(token, SECRET_KEY);
    }


    try {
        const getProfile = await authModals.findOne({ _id : UserId })

        res.send({ getProfile, stauts: 'ok' })

    } catch (error) {
        res.status(404).send({
            message: 'Something went wrong , Please try again',
            status: 'false'
        })
    }
})

module.exports = { authRouter }