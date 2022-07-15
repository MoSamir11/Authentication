const { json } = require("express");
var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var jwt = require("jsonwebtoken");
const { token } = require("morgan");
const adminauth = require("../modal/Admin/adminauth");

const adminController = require("../Controller/AdminController/adminController");

const isAdmin = (req, res, next) => {
  var cookie = req.cookies.admin;
  if (cookie) {
    next();
  } else {
    res.redirect("/login");
  }
};

const isAdminLoggedIn = (req, res, next) => {
  var cookie = req.cookies.admin;
  if (cookie) {
    res.render("error", {
      message:
        "You are not authorized to access this page first Logout from admin",
      error: "Already login as an admin",
    });
  } else {
    next();
  }
};

const isCustomerLoggedIn = (req, res, next) => {
  var cookie = req.cookies.customer;
  if (cookie) {
    res.render("error", {
      message:
        "You are not authorized to access this page first Logout from customer",
      error: "Already login as an Customer",
    });
  } else {
    next();
  }
};
/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/admin-logout", async (req, res, next) => {
  res.clearCookie("admin");
  res.render("../views/Admin/adminlogin");
});

router.post("/product-update", async function (req, res, next) {
  if (req.body) {
    console.log(req.body);
    const data = {
      name: req.body.name,
      company: req.body.company,
      price: req.body.price,
    };
    const updateResponse = await product.updateOne(
      { _id: req.body.id },
      { $set: data }
    );
    console.log(updateResponse);
    if (updateResponse) {
      res.send({
        success: "Data updated Successfully",
      });
    } else {
      res.send({
        error: "Something went wrong",
      });
    }
  }
});

router.get("/admin-signup", isCustomerLoggedIn, (req, res, next) => {
  res.render("../views/Admin/adminauth");
});

router.post("/admin-signup", adminController.adminAdd);

router.get("/admin-login", isCustomerLoggedIn, (req, res, next) => {
  res.render("../views/Admin/adminlogin");
});

router.get("/all-admins", isAdmin, async (req, res) => {
  const data = await adminauth.find({});
  const cookies = req.cookies.admin;
  const userVer = await jwt.verify(cookies, "mysecret");
  res.render("../views/Admin/allAdmin", {
    admin: data,
    name: userVer.data.name,
  });
});

router.post("/admin-login", adminController.adminLogin);

router.post("/delete-admin", adminController.deleteAdmin);

router.get("/edit-customer-profile", async (req, res) => {
  const cookies = req.cookies.customer;
  const userVer = await jwt.verify(cookies, "mysecret");
  const customerDetail = await customer.findOne({ _id: userVer.user.id });
  res.render("../views/customer/EditcustomerProfile", {
    name: customerDetail.name,
    phone: customerDetail.phone,
  });
});

router.get("/customer-signup", isAdminLoggedIn, (req, res, next) => {
  res.render("../views/customer/customersignup");
});

router.get("/customer-login", isAdminLoggedIn, (req, res, next) => {
  res.render("../views/customer/customerlogin");
});


router.get("/customer-logout", (req, res) => {
  res.clearCookie("customer");
  res.render("../views/customer/customerlogin");
});

router.get("/add-outfit", async (req, res) => {
  const cookies = req.cookies.admin;
  const userVer = await jwt.verify(cookies, "mysecret");
  console.log("126-->", userVer.data._id);
  const userName = await adminauth.findOne({ _id: userVer.data._id });
  res.render("../views/Outfit/outfit", { username: userName.name });
});


router.get("/outfits", isAdmin, async function (req, res, next) {
  const data = await outfit.find({});
  res.render("../views/Outfit/allOutfits", { product: data });
});

router.get("/all-customers", isAdmin, async (req, res) => {
  const data = await customer.find({});
  res.render("../views/customer/AllCustomers", { product: data });
});

router.get("/customer-order", async (req, res, next) => {
  const cookies = req.cookies.customer;
  const userVer = await jwt.verify(cookies, "mysecret");
  console.log("180-->", userVer.user.id);
  const name = await customer.findOne({ _id: userVer.user.id });
  const cloth = await outfit.find({});
  res.render("../views/Order/CustomerOrderPage", {
    name: name.name,
    outfit: cloth,
    username: name.name,
    phone: name.phone,
  });
});

router.get("/customer-order/confirm-order/:id", async (req, res) => {
  const outfits = await outfit.findOne({ _id: req.params.id });
  // console.log("171-->", outfits);
  console.log("174-->", req.url.split("/")[3]);
  const cookies = req.cookies.customer;
  const userVer = await jwt.verify(cookies, "mysecret");
  const user = await customer.findOne({ _id: userVer.user.id });
  res.render("../views/Order/confirmOrder", {
    outfit: outfits.outfit,
    size: outfits.size,
    color: outfits.color,
    username: user.name,
    email: user.email,
    quantity: outfits.quantity,
    price: outfits.price,
  });
});


router.get("/order", isAdmin, async (req, res) => {
  const product = await order.find({});
  res.render("../views/Order/AllOrder", { product: product });
});


module.exports = router;
