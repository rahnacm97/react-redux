const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const verifyToken = require('../Middleware/verifyToken')
const multer = require('multer');
const upload = multer({ dest: 'Uploads/' });

router.post('/signup',userController.userSignup);
router.post('/login',userController.userLogin);
router.get('/profile/:id',userController.getUserProfile)
router.post('/profile/update/:id', upload.single('profilePic'), userController.updateProfile);
router.get('/userdata/:id',verifyToken,userController.getUserData)
router.get('/users/:id',verifyToken,userController.takeUserData)

module.exports =  router