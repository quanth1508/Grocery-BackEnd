import express, { json, urlencoded, static as s } from "express";
import cors from "cors";
import pkg from 'body-parser';
const { urlencoded: _urlencoded } = pkg;
import mongoose from "mongoose";
import { BASEURL } from "./app/config/db.config.js";
import image from './app/models/imageModel.js';
import authRoutes from './app/routes/auth.routes.js'
import productRoutes from './app/routes/product.routes.js'
import uploadRouter from "./app/routes/upload.routes.js";
import bankRoutes from "./app/routes/bank.routes.js";


const app = express();

var consOptions = {
    origin: `${BASEURL}:8080`
};

app.use(cors(consOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(authRoutes)
app.use(productRoutes)
app.use(uploadRouter)
app.use(bankRoutes)
app.use(_urlencoded(
  { extended:true }
))
app.use(s('public'))

app.set("view engine","ejs");

// simple route
app.get("/", (req, res) => {
  return res.json( { message: "Welcome" });
})

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