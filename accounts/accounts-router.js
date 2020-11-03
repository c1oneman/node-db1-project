const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

const Accounts = {
    getAll() {
      return db('accounts')
    },
    getById(id) {
        // return db('posts').where({ id }).first()
        return db('accounts').where({ id })
      },
      create(post) {
        return db('accounts').insert(post)
      },
      update(id, post) {
        return db('accounts').where({ id }).update(post)
      },
      delete(id) {
        return db('accounts').where({ id }).del()
      }
  }

  router.get('/', (req, res) => {
    Accounts.getAll()
      .then(data => {
        res.json(data)
      })
      .catch(error => {
        res.json({ error: error.message })
      })
  });

  router.get('/:id', (req, res) => {
    Accounts.getById(req.params.id)
      .then(data => {
        // if empty dataset, do something different
        if (!data.length) {
          res.json({ message: 'no account with said id' })
        } else {
          res.json(data[0])
        }
      })
      .catch(error => {
        res.json({ message: error.message })
      })
  });
  
  router.post('/', (req, res) => {
    Accounts.create(req.body)
      .then(([id]) => {
        return Accounts.getById(id).first()
      })
      .then(data => {
        res.json(data)
      })
      .catch(error => {
        res.json({ message: error.message })
      })
  });

  router.put('/:id', async (req, res) => {
    try {
      const count = await Accounts.update(req.params.id, req.body)
      if (!count) {
        res.json({ message: 'no accounts with that id' })
      } else {
        const updatedPost = await Accounts.getById(req.params.id).first()
        res.json(updatedPost)
      }
    } catch (error) {
      res.json({ message: error.message })
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const deletedRowsNumber = await Accounts.delete(req.params.id)
      if (!deletedRowsNumber) {
        res.json({ message: 'no post with given id' })
      } else {
        res.json({ message: 'Accounts deleted successfully' })
      }
    } catch (error) {
      res.json({ message: error.message })
    }
  });
  
  module.exports = router;