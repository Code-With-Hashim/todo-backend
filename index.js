require('dotenv').config()
const express = require('express')
const cors = require('cors')

const { connect } = require('./config/db')
const { authRouter } = require("./routes/Authenticated.routes")

const app = express()
const PORT = process.env.PORT


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: "*"
}))
app.use("/", authRouter)

app.get('/', (req, res) => res.send({ message: 'Hello World' }))
app.post("/calculate", (req, res) => {

    const {P , i , n} = req.body

    // The Formula to calculate return on investment
    // F = P [({(1+i) ^n}-1)/i]
    // console.log(100000*[((1+0.071) ** 15-1)/0.071])

    const F = P*[((1+(i/100)) ** n-1)/(i/100)]

    const total_maturity_value = F

    const total_investment_amount = P * n

    const total_interest_gained = total_maturity_value - total_investment_amount

    res.send({
        total_maturity_value,
        total_investment_amount,
        total_interest_gained
    })
    

   
})

app.listen(PORT, async () => {
    try {
        await connect
        console.log('Database is connected Successfully')
        console.log(`Listening on http://localhost:${PORT}`)

    } catch (error) {
        console.log(error)
    }
})