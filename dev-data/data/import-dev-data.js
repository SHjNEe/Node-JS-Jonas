const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB Connection success");
  });

// const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");

// IMPORT DATA INTO DB
const Users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const importData = async function () {
  try {
    await User.create(Users);
    console.log("Data success");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
//DELETE ALL DATA FROM FB

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log("Delete many is successful");
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
