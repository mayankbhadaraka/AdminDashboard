const User = require("./Model/User").User;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const crypto = require("crypto");
const { Op } = require("sequelize");
const fs = require("fs");

const upload = multer({
  limits: {
    fileSize: 100000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpe?g|png)$/i)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});

const hash = (password) => {
  const hash = crypto.createHmac("sha256", "NEWSEC");
  let hashed = null;
  hash.on("readable", () => {
    const data = hash.read();
    if (data) {
      hashed = data.toString("hex");
    }
  });
  hash.write(password);
  hash.end();
  return hashed;
};

function generateAccessToken(id) {
  return jwt.sign(id, "IAMMAYANK");
}

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, "IAMMAYANK");
    console.log(data);
    next();
    return data;
  } catch {
    return res.sendStatus(403);
  }
};
const authorizationAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, "IAMMAYANK");
    const userExist = User.findOne({ where: { id: data } });
    if (userExist) {
      if (userExist.isAdmin == true) {
        next();
      }
    } else {
      res.status(404).json({ message: "No user Found" });
    }
    next();
  } catch {
    return res.sendStatus(403);
  }
};

router.post("/login", async (req, res) => {
  console.log(req.body);
  const { Email, Password } = req.body;
  const newPassword = hash(Password);
  if (!Email || !Password) {
    res.json({ message: "Enter Details Properly." });
  } else {
    const userExist = await User.findOne({ where: { Email: Email.toLowerCase() } });
    if (userExist) {
      if (userExist.dataValues.Password === newPassword) {
        console.log(userExist.dataValues.id);
        const token = generateAccessToken(userExist.dataValues.id);
        console.log(token);
        res.cookie("access_token", token, {
          httpOnly: true,
        });
        res
          .status(200)
          .send({ user: userExist.dataValues, message: "Login Successfull." });
      } else {
        res.status(404).json({ message: "Invalid Email or Password" });
      }
    } else {
      res.status(404).json({ message: "No User Found" });
    }
  }
});

router.post("/saveData", upload.single("ProfilePicture"), async (req, res) => {
  if (req.file) {
    const { FirstName, LastName, Address, Mobile, Email, Password } = req.body;
    const ProfilePicture = `/${req.file.originalname}`;
    try {
      const myFileName = ProfilePicture.split(".").join("-" + Date.now() + ".");
      console.log(myFileName)
      await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toFile(
          "C:/Users/mayan/Desktop/Lucent Innovation/LoginRegisterWithSQL/FrontEnd/public/Images" +
            `${myFileName}`
        );
      if (
        !FirstName ||
        !LastName ||
        !Address ||
        !Mobile ||
        Mobile.length != 10 ||
        JSON.stringify(parseInt(Mobile)).length !== Mobile.length ||
        !Email ||
        !Password
      ) {
        res.status(422).json({ message: "Fill Details Properly." });
      } else {
        try {
          const newUser = await User.findOne({ where: { Email: Email.toLowerCase()} });
          if (newUser) {
            res.status(422).json({ message: "Email Already Exist." });
          } else {
            const hashedPassword = hash(Password);
            console.log(hashedPassword);
            try {
              await User.create({
                FirstName: FirstName,
                LastName: LastName,
                Address: Address,
                Mobile: parseInt(Mobile),
                Email: Email.toLowerCase(),
                Password: hashedPassword,
                ProfilePicture: myFileName,
              });
              res.status(200).json({ message: "Register Successfully." });
            } catch (error) {
              res.status(404).json({ message: error });
            }
          }
        } catch (error) {
          res.status(404).json({ message: error });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  } else {
    const { FirstName, LastName, Address, Mobile, Email, Password } = req.body;
    console.log("No Image");
    const ProfilePicture = null;
    try {
      if (
        !FirstName ||
        !LastName ||
        !Address ||
        !Mobile ||
        Mobile.length != 10 ||
        JSON.stringify(parseInt(Mobile)).length !== Mobile.length ||
        !Email ||
        !Password
      ) {
        res.status(422).json({ message: "Fill Details Properly." });
      } else {
        try {
          const newUser = await User.findOne({ where: { Email: Email } });
          if (newUser) {
            res.status(422).json({ message: "Email Already Exist." });
          } else {
            const hashedPassword = hash(Password);
            try {
              await User.create({
                FirstName: FirstName,
                LastName: LastName,
                Address: Address,
                Mobile: parseInt(Mobile),
                Email: Email,
                Password: hashedPassword,
                ProfilePicture: ProfilePicture,
              });
              res.status(200).json({ message: "Register Successfully." });
            } catch (error) {
              res.status(404).json({ message: error });
            }
          }
        } catch (error) {
          res.status(404).json({ message: error });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
});

router.get("/logInUser", authorization, async (req, res) => {
  const token = req.cookies.access_token;
  const data = jwt.verify(token, "IAMMAYANK");
  const userExist = await User.findOne({ where: { id: data } });
  if (userExist) {
    res
      .status(200)
      .json({ log: userExist.dataValues, message: "Login Successfull" });
  } else {
    res.status(404).json({ message: "No user Found" });
  }
});

router.put(
  "/Update",
  upload.single("ProfilePicture"),
  authorization,
  async (req, res) => {
    console.log("Update", req.file);
    if (req.file) {
      const { FirstName, LastName, Address, Mobile, Email, Password } =
        req.body;
      const ProfilePicture = `/${req.file.originalname}`;
      console.log(ProfilePicture);
      try {
        await sharp(req.file.buffer)
          .resize({ width: 250, height: 250 })
          .png()
          .toFile(
            "C:/Users/mayan/Desktop/Lucent Innovation/LoginRegisterWithSQL/FrontEnd/public/Images" +
              `/${req.file.originalname}`
          );
      } catch {
        res.json({ message: "Unable to Update Image." });
      }
      if (
        !FirstName ||
        !LastName ||
        !Address ||
        !Mobile ||
        Mobile.length != 10 ||
        JSON.stringify(parseInt(Mobile)).length !== Mobile.length ||
        !Email ||
        !Password
      ) {
        res.status(401).json({ message: "Fill Details Properly." });
      } else {
        const userExist = await User.findOne({ where: { Email: Email } });
        if (userExist.dataValues.Password == Password) {
          console.log("Profile without pass", ProfilePicture);
          if (userExist) {
            const update = await User.update(
              {
                FirstName: FirstName,
                LastName: LastName,
                Address: Address,
                Mobile: Mobile,
                Email: Email,
                ProfilePicture: ProfilePicture,
                Password: Password,
              },
              {
                where: { id: userExist.dataValues.id },
              }
            );
            res.status(200).json({ message: "Updated Successfully." });
          } else {
            res.status(404).json({ message: "No User Found" });
          }
        } else {
          const NewPassword = hash(Password);
          console.log(ProfilePicture);
          const update = await User.update(
            {
              FirstName: FirstName,
              LastName: LastName,
              Address: Address,
              Mobile: Mobile,
              Email: Email,
              ProfilePicture: ProfilePicture,
              Password: NewPassword,
            },
            { where: { id: userExist.dataValues.id } }
          );
          res.status(200).json({ message: "Updated Successfully" });
        }
      }
    } else {
      const { FirstName, LastName, Address, Mobile, Email, Password } =
        req.body;
      if (
        !FirstName ||
        !LastName ||
        !Address ||
        !Mobile ||
        Mobile.length != 10 ||
        JSON.stringify(parseInt(Mobile)).length !== Mobile.length ||
        !Email ||
        !Password
      ) {
        res.status(401).json({ message: "Fill Details Properly." });
      } else {
        const userExist = await User.findOne({ where: { Email: Email } });
        console.log(userExist.dataValues);
        if (userExist.dataValues.Password == Password) {
          if (userExist) {
            const update = await User.update(req.body, {
              where: { id: userExist.dataValues.id },
            });
            res.status(200).json({ message: "Updated Successfully." });
          } else {
            res.status(404).json({ message: "No User Found" });
          }
        } else {
          const NewPassword = hash(Password);
          const update = await User.update(
            {
              FirstName: FirstName,
              LastName: LastName,
              Address: Address,
              Mobile: Mobile,
              Email: Email,
              Password: NewPassword,
            },
            { where: { id: userExist.dataValues.id } }
          );
          res.status(200).json({ message: "Updated Successfully" });
        }
      }
    }
  }
);

router.delete(
  "/DeleteUser",
  authorization,
  authorizationAdmin,
  async (req, res) => {
    const id = req.query.id;
    const DeleteUse = await User.findOne({where:{ id: id }});
    if (DeleteUse) {
      const Add = "C:/Users/mayan/Desktop/Lucent Innovation/LoginRegisterWithSQL/FrontEnd/public/Images" +`${DeleteUse.dataValues.ProfilePicture}`;
      fs.unlink(Add, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      await User.destroy({ where: { id: id } });
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "No User Found" });
    }
  }
);

router.get("/Pagination", async (req, res) => {
  let limit = parseInt(req.query.limit);
  let page = req.query.page;
  let offset = limit * (page - 1);
  let search = req.query.search;
  try {
    const data = await User.findAndCountAll({
      where: {
        isAdmin: false,
        [Op.or]: [
          { FirstName: { [Op.like]: `%${search}%` } },
          { LastName: { [Op.like]: `%${search}%` } },
          { Address: { [Op.like]: `%${search}%` } },
          { Email: { [Op.like]: `%${search}%` } },
        ],
      },
      limit: limit,
      offset: offset,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/Logout", authorization, async (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Logout Sucessfully" });
});

module.exports = router;
