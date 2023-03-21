import { verify } from "jsonwebtoken";
import secret from "../config/auth.config.js";

import User from "../models/user.model.js";
import Role from "../models/role.model.js";
const ROLES  = ["user", "admin", "moderator"];

function verifyToken(req, res, next) {
  var bearerToken = req.headers['authorization'] || req.headers['x-access-token'];
  const token = String(bearerToken).split(' ')[1];
  if (token) {
    verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ 
            success: false,
            message: "Unauthorized!" 
          });return res.status(401).send
        }
        req.decoded = decoded;
        next();
    });
  } else {
    return res.json({
      success: false,
      message: 'Không tồn tại token'
    });
  }
};

function isAdmin(req, res, next) {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

function isModerator(req, res, next) {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
export default authJwt;