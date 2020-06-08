const express = require('express');
const router = express.Router();
const db = require('../data/dbConfig');

router.get('/', async (req, res) => {
  try {
    const accounts = await db('accounts').limit(req.query.limit || 20).orderBy(req.query.sortby || 'id');
    res.status(200).json(accounts);
  } catch(err) {
    res.status(500).json({ error: "Could not retrieve accounts from database"});
  }
});

router.get('/:id', validateAccountId, async (req, res) => {
  res.status(200).json(req.account);
});

router.post('/', validateAccount, async (req, res) => {
  try {
    const account = await db('accounts').insert(req.body);
    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ error: "Could not add post to database" });
  }
});

router.put('/:id', validateAccountId, validateAccount, async (req, res) => {
  try {
    const updatedAccount = await db('accounts').where({ id: req.params.id}).update(req.body);
    res.status(200).json(updatedAccount);
  } catch (err) {
    res.status(500).json({ error: "Could not change post in database" });
  }
});

router.delete('/:id', validateAccountId, async (req, res) => {
  try {
    const deleted =  await db('accounts').where({ id: req.params.id }).del();
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Could not delete account in database" });
  }
});

async function validateAccountId(req, res, next) {
  try {
    const account = await db('accounts').where({ id: req.params.id });
    if (account.length === 0) return res.status(404).json({ error: "Invalid Account ID" });
    req.account = account;
    next();
  } catch {
    res.status(500).json({ error: "Could not retrieve account from database" });
  }
}

function validateAccount(req, res, next) {
  if (!req.body.name || !req.body.budget) {
    return res.status(400).json({ error: "Must include a name and budget" });
  }
  next();
}

module.exports = router;