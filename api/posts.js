const express = require("express");
const router = express.Router();
const {
  find,
  insert,
  findById,
  findPostComments,
  insertComment,
  findCommentById,
  remove,
  update,
} = require("../data/db");

// GET: /api/posts
router.get("/", (req, res) => {
  find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

// POST: /api/posts
router.post("/", (req, res) => {
  const post = req.body;
  if (post.title && post.contents) {
    insert(post)
      .then((post) => {
        console.log(post);
        findById(post.id)
          .then((post) => {
            res.status(201).json(post);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error:
                "There was an error trying to find post just saved to the database",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
});

// POST: /api/posts/:id/comments
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const comment = req.body;
  findById(id).then((post) => {
    if (post) {
      if (comment.text) {
        insertComment({
          ...comment,
          post_id: id,
        })
          .then((comment) => {
            findCommentById(comment.id)
              .then((comment) => {
                res.status(201).json(comment);
              })
              .catch((err) => {
                res.status(500).json({
                  error:
                    "There was an error while saving the comment to the database",
                });
              });
          })
          .catch((err) => {
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database",
            });
          });
      } else {
        res.status(400).json({
          errorMessage: "Please provide text for the comment.",
        });
      }
    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist.",
      });
    }
  });
});

// GET: /api/posts/:id/comments
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  findById(id).then((post) => {
    if (post) {
      findPostComments(id)
        .then((comments) => {
          res.status(200).json(comments);
        })
        .catch((err) => {
          res.status(500).json({
            error: "The comments information could not be retrieved.",
          });
        });
    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    }
  });
});

// GET: /api/posts/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  findById(id)
    .then((post) => {
      console.log(post);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// DELETE: /api/posts/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  remove(id)
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ message: `post with id ${id} was deleted` });
      } else {
        res.status(404).json({ message: "post was not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "The post could not be removed",
      });
    });
});

// PUT: /api/posts/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  if (req.body.title || req.body.contents) {
    update(id, req.body)
      .then((count) => {
        if (count) {
          findById(id)
            .then((post) => {
              res.status(200).json(post);
            })
            .catch((err) => {
              res
                .status(500)
                .json({ error: "The post information could not be modified." });
            });
        } else {
          res
            .status(404)
            .json({
              message: "The post with the specified ID does not exist.",
            });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  } else {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post.",
      });
  }
});

module.exports = router;
