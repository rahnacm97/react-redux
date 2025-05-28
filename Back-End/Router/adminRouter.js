const express = require('express')
const router = express.Router()
const adminController = require('../Controller/adminController')
const verifyToken = require('../Middleware/verifyToken')

router.post('/login',adminController.AdminLoginPage)
router.get('/users',verifyToken,adminController.fetchingUserData)
router.delete('/users/:id',verifyToken,adminController.deleteuser)
router.put('/users/:id',verifyToken,adminController.userUpdate)
router.post('/users',verifyToken,adminController.addNewUser)

module.exports = router