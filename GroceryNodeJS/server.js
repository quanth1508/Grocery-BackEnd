import express, { json, urlencoded, static as s } from "express";
import cors from "cors";
// import { urlencoded as _urlencoded } from "body-parser";
import pkg from 'body-parser';
const { urlencoded: _urlencoded } = pkg;
import { extname } from 'path';
import { readFileSync } from "fs";
import multer, { diskStorage } from "multer";
import mongoose from "mongoose";

const app = express();

var consOptions = {
    origin: "http://localhost:8081"
};

import image from './app/models/imageModel.js';

app.use(cors(consOptions));

app.use(json());

app.use(urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    return res.json( { message: "Welcome" });
});

import authRoutes from './app/routes/auth.routes.js'
import productRoutes from './app/routes/product.routes.js'
app.use(authRoutes);
app.use(productRoutes);

// set port, listen request
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

import role from "./app/models/role.model.js";
const Role = role;
import { HOST, PORT as _PORT, DB } from "./app/config/db.config.js";

mongoose.set('strictQuery', false);
mongoose
    .connect(`mongodb://${HOST}:${_PORT}/${DB}`, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB");
        initial();
    })
    .catch((error) => {
        console.log("Connection error: ", error);
    });

function initial() {
    Role.estimatedDocumentCount((err, count) => {
          if (!err && count === 0) {
            new Role({
              name: "user"
            }).save(err => {
              if (err) {
                console.log("error", err);
              }
      
              console.log("added 'user' to roles collection");
            });
      
            new Role({
              name: "moderator"
            }).save(err => {
              if (err) {
                console.log("error", err);
              }
      
              console.log("added 'moderator' to roles collection");
            });
      
            new Role({
              name: "admin"
            }).save(err => {
              if (err) {
                console.log("error", err);
              }
      
              console.log("added 'admin' to roles collection");
            });
          }
        });
}

function getDB() {
  return _db;
}

app.use(_urlencoded(
  { extended:true }
))

app.set("view engine","ejs");

// SET STORAGE
app.use(s('public'));

let imageName = "";
const storage = diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${process.cwd()}/public/assets`);
  },
  filename: function(req, file, cb) {
    imageName = Date.now() + extname(file.originalname);
    cb(null, imageName);
  }
});

var upload = multer({ storage: storage })
app.get("/assets",(req,res)=>{
  res.sendFile(`${process.cwd()}/public/assets/${req.path}`)
})

app.post("/api/v1/uploadphoto", upload.single('image'),(req, res) => {
  var img = readFileSync(req.file.path);
  var encode_img = img.toString('base64');
  var final_img = {
      contentType:req.file.mimetype,
      image: new Buffer(encode_img, 'base64')
  };
  create(final_img,function(err,result) {
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
                url: "http://localhost:8080/assets/" + imageName 
              }
          })
      }
  })
})