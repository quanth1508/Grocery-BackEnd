import secret  from "../config/auth.config.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Response from "../utils/Response.Class.js";
import THQError from "../utils/THQError.Class.js";
import errorHelper from "../helpers/error.helper.js";
const ROLES  = ["user", "admin", "moderator"];
import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken;

import pkg from 'bcryptjs';
const { hashSync, compareSync } = pkg;

export function signup(req, res) {
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    password: hashSync(req.body.password, 8),
    bio: req.body.bio,
    avatar: req.body.avatar,    
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
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
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.status(200).send({
              success: true,
              message: "Bạn đã đăng ký tài khoản thành công!"
            })
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ 
              success: false,
              message: err,
              data: null,
            });
            return;
          }
          res.status(200).send({
            success: true,
            message: "Bạn đã đăng ký tài khoản thành công!"
          })
        });
      });
    }
  });
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

      var token = sign({ id: user.id }, secret, {
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