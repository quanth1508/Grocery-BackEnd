const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const multer = require("multer");

const app = express();

var consOptions = {
    origin: "http://localhost:8081"
};

var imageModel = require('./app/models/imageModel');

app.use(cors(consOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    return res.json( { message: "Welcome" });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen request
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
const Role = db.role;
const dbConfig = require("./app/config/db.config");

db.mongoose.set('strictQuery', false);
db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
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

app.use(bodyParser.urlencoded(
  { extended:true }
))

app.set("view engine","ejs");

// SET STORAGE
app.use(express.static('public'));

let imageName = "";
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${process.cwd()}/public/assets`);
  },
  filename: function(req, file, cb) {
    imageName = Date.now() + path.extname(file.originalname);
    cb(null, imageName);
  }
});

var upload = multer({ storage: storage })
app.get("/assets",(req,res)=>{
  res.sendFile(`${process.cwd()}/public/assets/${req.path}`)
})

app.post("/uploadphoto", upload.single('image'),(req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_img = img.toString('base64');
  var final_img = {
      contentType:req.file.mimetype,
      image: new Buffer(encode_img, 'base64')
  };
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
                url: "http://localhost:8080/assets/" + imageName 
              }
          })
      }
  })
})