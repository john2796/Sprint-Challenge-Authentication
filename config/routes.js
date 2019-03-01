const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../auth/authenticate");
const db = require("../database/dbConfig");

const jwtKey =
  process.env.JWT_SECRET ||
  "add a .env file to root of project with the JWT_SECRET variable";

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};
// @route    GET api/register
// @desc     regsiter
// @Access   Public
async function register(req, res) {
  // implement user registration
  let user = req.body;
  if (!user.username) {
    return res.status(400).json({ username: "Username field is required" });
  }
  if (!user.password) {
    return res.status(400).json({ password: "Password field is required" });
  }
  try {
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    const [users] = await db.insert(req.body).into("users");

    const getUser = await db
      .select()
      .from("users")
      .where({ id: users })
      .first();

    res.status(200).json(getUser);
  } catch (err) {
    res.status(500).json({ message: `internal server err ${err}` });
  }
}
// @route    GET api/login
// @desc     login
// @Access   Public
async function login(req, res) {
  let { username, password } = req.body;
  try {
    const user = await db
      .select()
      .from("users")
      .where({ username: username })
      .first();
    const isMatch = await bcrypt.compare(password, user.password);
    //save user in cookies
    if (isMatch) {
      //req.session.user = user;
      const payload = {
        id: user.id,
        username: user.username
      };

      jwt.sign(
        payload,
        jwtKey,
        { expiresIn: 1000 * 60 * 60 * 5 }, // 5hours
        (err, token) => {
          res.json({
            success: true,
            token
          });
        }
      );
    } else {
      res.status(400).json({ message: "password incorrect" });
    }
  } catch (err) {
    res.status(500).json({ message: `internal err server ${err}` });
  }
}
// @route    GET api/jokes
// @desc     get all jokes
// @Access   Private
function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}
