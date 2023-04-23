import secret  from "../config/auth.config.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Response from "../utils/Response.Class.js";
import THQError from "../utils/THQError.Class.js";
import errorHelper from "../helpers/error.helper.js";
const ROLES  = ["user", "admin", "moderator"];
import jwt from 'jsonwebtoken'
import pkg from 'bcryptjs';
const { hashSync, compareSync } = pkg;

export function signup(req, res) {
  try {

    if (!req.body) {
      throw THQError("Không có dữ liệu")
    }
    const newUser = new User({
      name: req.body.name,
      phone: req.body.phone,
      password: hashSync(req.body.password, 8),
      bio: req.body.bio,
      avatar: req.body.avatar
    });
  
    newUser.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
        Role.find(
          {
            name: { $in: req.body.roles }
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
  
            user.roles = roles.map(role => role._id);
            var user_id = user._id.valueOf()
            user.user_id =  user_id
            user.save((err, savedUser) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              console.log(savedUser)
              res.status(200).send(new Response(
                true,
                "Chúc mừng bạn đã đăng ký tài khoản thành công!",
                savedUser
              ))
            });
          }
        );
    });
  } catch (error) {
    errorHelper.sendError(res, signup, error)
  }
}

export function signin(req, res) {
  try {
    if (!req.body) {
        throw THQError("Thiếu trường thông tin!")
    } 

    User.findOne({
      phone: req.body.username
    })
    .populate("roles", "-__v")
    .exec((err, user) => {
        if (!user) {
          return res.status(404).send({ 
            success: false,
            message: "Không tìm thấy thông tin tài khoản." 
          });
        }
  
        if (err) {
          res.status(500).send({
            success: false,
            message: err 
          });
          return;
        }
  
        var passwordIsValid = compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            success: false,
            accessToken: null,
            message: "Mật khẩu không chính xác."
          });
        }
        let dataUser = {
          user_id: user._id.valueOf()
        }
        var token = jwt.sign(dataUser, secret, {
          expiresIn: 86400 * 30 // expired 1 month token
        });
  
        var authorities = [];
  
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        console.log(user)
        res.status(200).send({
          success: true,
          data: {
              id: user._id,
              name: user.name,
              phone: user.phone,
              roles: authorities,
              bio: user.bio,
              avatar: user.avatar,
              token: token,
          }
        }
        );
    });
} catch (error) {
  errorHelper.sendError(res, signin, error)
}
}