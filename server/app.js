import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './database/connect.js'
import router from './routes/routes.js'
import cookieParser from 'cookie-parser'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const corsOptions ={
    credentials: true,    
    origin: true,         
}

const app = express()
const port = process.env.PORT || 5000

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use('/', router)

connectDB()

app.listen(port, () => {
    console.log(`server is listening on port ${port}...`)
})
