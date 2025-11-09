const express = require("express");
const router = express.Router();

const books = [
  { title: "Clean Code", author: "Robert C. Martin" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt" },
  { title: "Design Patterns", author: "Erich Gamma" },
];

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get("/", isAuthenticated, (req, res) => {
  res.render("books", { user: req.user, books });
});

module.exports = router;
