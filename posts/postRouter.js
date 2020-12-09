const express = require("express");
const posts = require("./postDb");
const router = express.Router();

router.get("/", (req, res, next) => {
  posts
    .get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id", validatePostId(), (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", (req, res) => {
  posts
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The post has been deleted",
        });
      } else {
        res.status(404).json({
          message: "The post could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the post",
      });
    });
});

router.put("/:id", validatePostId(), (req, res) => {
  posts
    .update(req.params.id, req.body)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the post",
      });
    });
});

// custom middleware

function validatePostId() {
  return (req, res, next) => {
    posts
      .getById(req.params.id)
      .then((post) => {
        if (post) {
          req.post = post;
          next();
        } else {
          res.status(404).json({
            message: "Post not found",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Error retrieving the post",
        });
      });
  };
}

module.exports = router;
