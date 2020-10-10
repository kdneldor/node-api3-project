const express = require("express");
const posts = require("./postDb");
const router = express.Router();

router.get("/", (req, res) => {
  posts.get(req.query).then((posts) => {
    res.status(200).json(posts);
  });
});

router.get("/:id", (req, res) => {
  posts
    .getById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post information could not be retrieved.",
      });
    });
});

router.delete("/:id", (req, res) => {
  posts
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "Post was deleted.",
        });
      } else {
        res.status().json({
          message: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed.",
      });
    });
});

router.put("/:id", (req, res) => {
  if (!req.body.user_id || !req.body.text) {
    return res.status(400).json({
      errorMessage: "Please provide User ID and Text for post.",
    });
  }
  posts
    .update(req.params.id, req.body)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post information could not be modified.",
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
