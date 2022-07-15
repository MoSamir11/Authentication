const adminauth = require("../../modal/Admin/adminauth");

var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var jwt = require("jsonwebtoken");
const { token } = require("morgan");

exports.adminAdd = async (req, res, next) => {
  const data = JSON.parse(JSON.stringify(req.body));
  console.log(data);
  const isUserExist = await adminauth.findOne({ email: req.body.email });
  if (!isUserExist) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        const createResponce = await adminauth.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          userType: "Admin",
        });
        console.log(createResponce);
        if (createResponce) {
          res.send({ success: "User data added successfully" });
        } else {
          res.send({ error: "Something went wrong" });
        }
      });
    });
  } else {
    res.send({ error: "User already exist" });
  }
};

exports.adminLogin = async (req, res, next) => {
  const data = JSON.parse(JSON.stringify(req.body));
  console.log(data);
  if (data) {
    req.body = JSON.parse(JSON.stringify(req.body));
    var email = req.body.email;
    var password = req.body.password;
    const isUserExist = await adminauth.findOne({
      email: email,
    });
    if (isUserExist) {
      // email match
      bcrypt.compare(
        password,
        isUserExist.password,
        async function (err, result) {
          // result === true
          if (result) {
            //jwt
            await jwt.sign(
              {
                data: isUserExist,
              },
              "mysecret",
              // {
              //   expiresIn: 60 * 60,
              // },
              (err, token) => {
                if (err) {
                  console.log(err);
                } else {
                  res.cookie("admin", token);
                  res.send({
                    success: "login success",
                  });
                }
              }
            );
          } else {
            res.send({
              error: "Password not match",
            });
          }
        }
      );
    } else {
      res.send({
        error: "user not found",
      });
    }
  }
};

exports.deleteAdmin = async (req, res, next) => {
  var id = req.body.id;
  console.log(id);
  const deleteResponse = await adminauth.deleteOne({ _id: id });
  if (deleteResponse) {
    res.send({
      success: "Data deleted successfully",
    });
  } else {
    res.send({
      error: "Something went wrong",
    });
  }
};
