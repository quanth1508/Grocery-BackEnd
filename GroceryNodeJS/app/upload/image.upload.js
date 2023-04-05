'use strict'

import fs from 'fs';
import multer from 'multer';
import axios from 'axios';
import Response from '../utils/Response.Class.js';
import ErrorHelper from '../helpers/error.helper.js'
import { readFileSync } from "fs";
import imageModel from '../models/imageModel.js';
import { BASEURL } from "../config/db.config.js"

async function uploadImage(req, res) {
    var img = readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType:req.file.mimetype,
        image: new Buffer(encode_img, 'base64')
    }
    
    imageModel.create(final_img,function(err,result) {
        if (err) {
          res.status(500).send({
            success: false,
            message: err 
          });
          return;
        } else {
            res.status(200).send({
                success: true,
                data: {
                  url: `${BASEURL}/assets/` + req.file.filename 
                }
            })
        }
    })
}

export default uploadImage