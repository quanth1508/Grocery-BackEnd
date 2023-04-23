import User from "../models/user.model.js";

async function checkDuplicateUsernameOrEmail(req, res, next) {
  // Valid unique phone
  User.findOne({
    phone: req.body.phone
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Số điện thoại này đã tồn tại!" });
      return;
    }

    next()
  });
};


export default {
  checkDuplicateUsernameOrEmail
}