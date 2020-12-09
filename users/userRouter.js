const express = require("express");
const users = require("./userDb");
const router = express.Router();

router.post("/", validateUser(), (req, res) => {
  users
    .insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the user",
      });
    });
});

router.post("/:id/posts", validateUserId(), (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      message: "Need a value for text",
    });
  }

  users
    .addUserPost(req.params.id, req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Could not create user post",
      });
    });
});

router.get("/", (req, res) => {
  users.get
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id", validateUserId(), (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId(), (req, res) => {
  users
    .getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Could not get user posts",
      });
    });
});

router.delete("/:id", validateUserId(), (req, res) => {
  users
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The user has been deleted",
        });
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the user",
      });
    });
});

router.put("/:id", validateUser(), validateUserId(), (req, res) => {
  users
    .update(req.params.id, req.body)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the user",
      });
    });
});

//custom middleware

function validateUserId() {
  return (req, res, next) => {
    users
      .getById(req.params.id)
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(404).json({
            message: "User not found",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Error retrieving the user",
        });
      });
  };
}

function validateUser() {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        message: "Missing user data",
      });
    } else if (!req.body.name) {
      return res.status(400).json({
        message: "Missing required name field",
      });
    }
    next();
  };
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
