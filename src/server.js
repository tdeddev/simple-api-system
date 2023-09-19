const express = require('express')
const app = express()
const authRouter = require('./routers/auth')
const bodyParsay = require('body-parser')
const queryRouter = require('./routers/sqlQuery')
require('dotenv').config()

const config = {
    port : process.env.PORT
}
app.use(bodyParsay.json())
app.use('/api', authRouter)
app.use('/api/query', queryRouter)

app.listen(config.port, () => console.log(`Server running... PORT ${config.port}`))