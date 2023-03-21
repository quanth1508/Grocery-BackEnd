import { Schema, model } from 'mongoose';
 
var imageSchema = new Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
 
//Image is a model which has a schema imageSchema
 
export default new model('Image', imageSchema);