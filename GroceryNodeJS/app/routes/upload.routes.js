'use strict'

import { Router } from "express"
import uploadImage from "../upload/image.upload.js"
import process from "process"
import { extname } from 'path';
import multer, { diskStorage } from "multer";
import { readFileSync } from "fs";

const storage = diskStorage({
    destination: function(req, file, cb) {
      cb(null, `${process.cwd()}/public/assets`);
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + extname(file.originalname))
    }
  });

let upload = multer({ storage: storage })
let uploadRouter = Router()

uploadRouter.post(
    "/api/v1/uploadphoto", 
    upload.single('image'),
    uploadImage
)

uploadRouter.use(
    "/assets",
    async (req, res) => {
        try {
            res.sendFile(`${process.cwd()}/public/assets/${req.path}`)
        } catch {

        }
    }
)

export default uploadRouter
