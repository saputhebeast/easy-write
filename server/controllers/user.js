import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import PostModel from '../models/post.js'

const salt = bcrypt.genSaltSync(10)
const secret = "SomeRandomString"

export const registerUser = async (req, res) => {
        const {username, password} = req.body
        try{
            const userDoc = await User.create({
                username,
                password: bcrypt.hashSync(password, salt)
            })
            res.json(userDoc)
        }catch(e){
            console.log(e)
            res.status(400).json(e)
        }
}

export const loginUser = async (req, res) => {
    const {username, password} = req.body
    const userDoc = await User.findOne({username})
    const logged = bcrypt.compareSync(password, userDoc.password)

    if(logged){
        jwt.sign({username, id: userDoc._id}, secret, {}, (error, token) => {
            if(error){
                res.json("something went wrong with jwt")
            }
            res.cookie('token', token).status(200).json({
                id: userDoc._id,
                username
            })
        })
    }else{
        res.status(400).json('wrong credentials')
    }
}

export const userProfile = async (req, res) => {
    const { token } = req.cookies
    try{
        jwt.verify(token, secret, {}, (error, info) => {
            if(error){
                res.status(400).status("something went wrong")
            }
            res.status(200).json(info)
        })
    }catch(error){
        res.status(400).json({"msg": "token error"})
    }
}

export const userLogout = async (req, res) => {
    res.cookie('token', '').json('ok')
}

export const postArticle = async(req, res) => {
    const {originalname, path} = req.file
    const parts = originalname.split('.')
    const extension = parts[parts.length - 1]
    const newPath = path+'.'+extension
    fs.renameSync(path, newPath)
    
    const {token} = req.cookies
    jwt.verify(token, secret, {}, async (error, info) => {
        if(error){
            res.status(400).json("something went wrong")
        }
        const {title, summary, content} = req.body
        const postDoc = await PostModel.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id
        })
        res.json(postDoc)
    })
}

export const getPosts = async (req, res) => {
    const posts = await PostModel.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    res.json(posts)
}

export const getPost = async (req, res) => {
    const {id} = req.params
    const post = await PostModel.findById(id)
        .populate('author', ['username'])
    res.json(post)
}

export const editPost = async (req, res) => {
    let newPath = null
    if(req.file){
        const {originalname, path} = req.file
        const parts = originalname.split('.')
        const extension = parts[parts.length - 1]
        newPath = path+'.'+extension
        fs.renameSync(path, newPath)
    }

    const {token} = req.cookies
    jwt.verify(token, secret, {}, async (error, info) => {
        if(error){
            res.status(400).json("something went wrong")
        }
        const {id, title, summary, content} = req.body
        const postDoc = await PostModel.findById(id)
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)

        if(!isAuthor){
            return res.status(400).json("you are not the author of this post")
        }
        
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover
        })

        res.json(postDoc)
    })
}
