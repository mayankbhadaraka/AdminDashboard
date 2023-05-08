const DataTypes = require("sequelize");

const con = require("../DB/DB");

const User = con.define("user", {
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      LastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Address: {
        type: DataTypes.STRING,
      },
      Mobile: {
        type: DataTypes.INTEGER,
      },
      Email: {
        type: DataTypes.STRING,
      },
      Password: {
        type: DataTypes.STRING,
      },
      isAdmin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
      },
      ProfilePicture:{
        type:DataTypes.STRING,
        allowNull:false
      },
});

con
  .sync()
  .then(() => {
    console.log("User table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = { User };
