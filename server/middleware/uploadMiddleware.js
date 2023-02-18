import multer from 'multer'

export const uploadMiddle = multer({dest: 'uploads/'})