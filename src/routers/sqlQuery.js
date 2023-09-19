const express = require('express')
const auth = require('../middleware/middle')
const router = express.Router();
const knex = require('../database')
const moment_tz = require('moment-timezone')
const moment = require('moment')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    res.send('API OK')
})

router.post('/get_member', auth, async (req, res) => {
    try {
        let dateNow = moment_tz().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss")
        let start = moment(dateNow).subtract(7, 'd').format("YYYY-MM-DD HH:mm:ss")
        let start_date = req.body.start_date || start
        let end_date = req.body.end_date || dateNow
        let where = []
        let limit = req.body.limit || 2

        if(!!(start_date || end_date)){
            where.push('emp_create_date', '>=', start_date)
            where.push('emp_create_date', '<=', end_date)
        }

        let member = await knex('employee').select().where('emp_create_date', '>=', start_date).where('emp_create_date', '<=', end_date).limit(limit)

        if(!!member){
            res.send({
                msg : 'OK',
                code : 0,
                data : member
            })
        }

        res.status(400).send('Not found')
        
    }catch (error){
        console.log(error.message)
    }
})

router.post('/update_member', auth, async(req, res) => {
    
    let token = req.body.token || req.query.token || req.headers['x-access-token']

    try {
        let {password, role} = req.body
        let member = await knex('employee').select('emp_id').where({emp_token : token})
        
        if(!member){
            return res.status(400).send('member not found!')
        }

        let bcryptPass = await bcrypt.hash(password, 10);
        
        let obj = {
            emp_password : bcryptPass,
            emp_role : role
        }

        if(!obj){
            return res.status(400).send('Input data for update')
        }

        let update = await knex('employee').update(obj).where({emp_id : member[0].emp_id})

        if(!!update){
            res.send({
                msg : "success",
                code : 0,
                data : []
            })
        }

        res.status(400).send('error')


    } catch (error) {
        console.log(error.message)
    }
})

router.post('/dl_member', auth, async(req, res) => {
    try {
        let dl_member = await knex('employee').where({emp_id : req.body.id}).del()

        if(!dl_member){
            return res.send({
                msg : "error",
                code : 100
            })
        }

        res.send({
            msg : 'success',
            code : 0
        })
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router
