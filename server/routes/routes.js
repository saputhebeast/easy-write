import express from 'express'
import { registerUser, loginUser, userProfile, userLogout, postArticle, getPosts, getPost, editPost } from '../controllers/user.js'
import { uploadMiddle } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/profile').get(userProfile)
router.route('/logout').post(userLogout)
router.route('/post').post(uploadMiddle.single('file'), postArticle)
router.route('/post').get(getPosts)
router.route('/post/:id').get(getPost)
router.route('/post').put(uploadMiddle.single('file'), editPost)

export default router
