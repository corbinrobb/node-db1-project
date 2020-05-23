const express = require('express');
const router = express.Router();
const db = require('../data/dbConfig');

router.get('/', async (req, res) => {
  try {
    const accounts = await db('accounts');
    res.status(200).json(accounts);
  } catch(err) {
    res.status(500).json({ error: err});
  }
});

router.get('/:id', validateAccountId, async (req, res) => {
  try {
    const account = await db('accounts').where({ id: req.account });
    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post('/', validateAccount, async (req, res) => {
  try {
    const account = await db('accounts').insert(req.body);
    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put('/:id', validateAccountId, validateAccount, async (req, res) => {
  try {
    const updatedAccount = await db('accounts').where({ id: req.params.id}).update(req.body);
    res.status(200).json(updatedAccount);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', validateAccountId, async (req, res) => {
  try {
    const deleted =  await db('accounts').where({ id: req.account }).del();
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

async function validateAccountId(req, res, next) {
  const account = await db('accounts').where({ id: req.params.id });
  if (account.length === 0) return res.status(404).json({ error: "Invalid Account ID" });
  req.account = req.params.id;
  next();
}

function validateAccount(req, res, next) {
  if (!req.body.name || !req.body.budget) {
    return res.status(400).json({ error: "Must include a name and budget" });
  }
  next();
}

module.exports = router;