const express = require("express");
const users = require("./userDb");
const posts = require("../posts/postDb");
const router = express.Router();

router.post("/", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      errorMessage: "Please provide name for the user.",
    });
  }
  users
    .insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the user to the database.",
      });
    });
});

router.post("/:id/posts", (req, res) => {
  if (!req.body.user_id || !req.body.text) {
    return res.status(400).json({
      errorMessage: "Please provide User ID and Text for the post.",
    });
  }
  posts
    .insert(req.body)
    .then((post) => {
      if (post) {
        res.status(201).json(post);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database.",
      });
    });
});

router.get("/", (req, res) => {
  users
    .get(req.query)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status().json({
        error: "The users information could not be retrieved.",
      });
    });
});

router.get("/:id",  (req, res) => {
  users
    .getById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user with the specificed ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The user information could not be retrieved.",
      });
    });
});

router.get("/:id/posts", (req, res) => {
  users
    .getUserPosts(req.params.id)
    .then((posts) => {
      if (posts) {
        res.json(posts);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.delete("/:id", (req, res) => {
  users
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "User was deleted.",
        });
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The user could not be removed.",
      });
    });
});

router.put("/:id", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      errorMessage: "Please provide name for the user.",
    });
  }
  users
    .update(req.params.id, req.body)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The user information could not be modified.",
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  users.getById(req.params.id)
  .then((user) => {
    if (user) {
      req.user = user
      next()
    } else {
      res.status(404).json({
        message: "User not found."
      })
    }
  })
  
  
  
  
  // users.getById(req.params.id);
  // if (user) {
  //   req.user = user;
  //   next();
  // } else {
  //   res.status(400).json({
  //     message: "invalid user id",
  //   });
  // }
}

function validateUser(req, res, next) {
  users.getById(req.params.id)
  .then((user) => {
    if (user) {
      req.user = user
      next()
    } else {
      res.status(404).json({
        message: "User not found",
      })
    }
  })
  // if (!req.body.name) {
  //   return res.status(400).json({
  //     message: "missing user data",
  //   });
  // }
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
