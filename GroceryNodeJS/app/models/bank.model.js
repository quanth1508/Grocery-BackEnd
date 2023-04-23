'use strict'
import mongoose from "mongoose";

const BankSchema = new mongoose.Schema({
    bank: String,
    accountName: String,
    accountNumber: String,
    logo: String,
    shortName: String,
    name: String,
    code: String,
    user_id: String,
}, {
    collection: 'bank',
    timestamps: true
})

/* bank model example
{
      id: 17,
      name: 'Ngân hàng TMCP Công thương Việt Nam',
      code: 'ICB',
      bin: '970415',
      isTransfer: 1,
      short_name: 'VietinBank',
      logo: 'https://api.vietqr.io/img/ICB.3d4d6760.png',
      support: 3
    }
*/

export default mongoose.model("bank", BankSchema, "bank")