const { Router } = require('express');
const authentication = require('../middleware/authentication.js');
const Post = require('../models/Post.js');

module.exports = Router()
  .post('/', authentication, async (req, res, next) => {
    try {
      const post = await Post.insert({
        userId: req.user.id,
        post: req.body.post,
      });
      res.json(post);
    } catch (error) {
      next(error);
    }
  })

  .get('/', authentication, async (req, res, next) => {
    try {
      const post = await Post.getAll();
      res.send(post);
    } catch (error) {
      next(error);
    }
  })

  .delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const post = await Post.deleteById(id);

      res.json(post);
    } catch (error) {
      next(error);
    }
  });
