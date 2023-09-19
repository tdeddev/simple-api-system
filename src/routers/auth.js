const express = require('express')
const router = express.Router()
const knex = require('../database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/middle')
const moment_tz = require('moment-timezone')

router.post('/register', async (req, res) => {

    try {
        let { username, password, role } = req.body
        let dateNow = moment_tz().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss")
        if(!(username, password)){
            return res.status(400).send("input your data!")
        }

        let key = process.env.SECERT_KEY
        let bcryptPassword = await bcrypt.hash(password, 10);
        let token = jwt.sign({user : username}, key, {expiresIn : "2h"})
        let insert = {
            emp_username : username,
            emp_password : bcryptPassword,
            emp_role : role,
            emp_token : token,
            emp_create_date : dateNow
        }

        // validate user in database
        let user = await knex('employee').select('emp_username').where({emp_username : username})
        if(user.length > 0){
            if(username && user[0].emp_username){
                return res.status(400).send('user already!!')
            }
        }
    
        let knex_insert = await knex('employee').insert(insert)
    
        if(!!knex_insert){
            res.send({
                status : "201",
                code : "0",
                msg : "OK",
                data : "method insert"
            })
        }
        
    } catch (error) {
        console.log(error.message)
    }

})

router.post('/login', async (req, res) => {

    try {
        let { username, password } = req.body
        let key = process.env.SECERT_KEY
        if(!(username && password)){
            return res.status(400).send("Input data login")
        }

        let login = {
            username : username
        }

        // validate if user in our database
        let user = await knex.select().from('employee').where({emp_username : username})

        if(user.length == 0){
            return res.status(400).send("Input data login")
        }

        if(user && (await bcrypt.compare(password, user[0].emp_password))){
            //create token
            const token = jwt.sign({user : username}, key, {expiresIn: "2h"})

            //save token
            login.password = password
            login.token = token
            await knex('employee').update('emp_token', token).where({emp_username : user[0].emp_username})
            .then(() => {
                res.status(200).json(login)
            })
        }else{
            res.status(400).send("password is wrong!!")
        }
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/welcome', auth, async (req, res) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token']

    if(!token){
        return res.status(400).send('guest')
    }

    try {
        let employee = await knex('employee').select('emp_username', 'emp_role').where({emp_token : token})
        
        if(employee.length == 0 ){
            return res.status(400).send('No data!')
        }
        let profile = {
            Title : "Profile",
            User : employee[0].emp_username,
            Role : employee[0].emp_role
        }
        res.send({
            msg : "OK",
            code : 0,
            data : profile
        })
        
    } catch (error) {
        console.log(error)
    }

})


module.exports = router
