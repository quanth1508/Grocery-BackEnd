import { MongoClient } from "mongodb";
const urlMongo = "mongodb://localhost:27017"
import { HOST, PORT, DB } from "./config/db.config";

var database;

function connectToServer( callback ) {
    MongoClient.connect(`mongodb://${HOST}:${PORT}/${DB}`,  { useUnifiedTopology: true , useNewUrlParser: true }, function( err, client ) {
        database = client.db(`${DB}`);
        return callback( err );
    })
}

function getDatabase() {
    return database
}

export default {connectToServer, getDb}