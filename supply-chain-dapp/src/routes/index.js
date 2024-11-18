import { Router } from 'express';
import { instance } from '../lib/instance.js';

const router = Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.send('Welcome to the Supply Chain DApp API');
});

// Set roles
router.post('/setDistributor', async (req, res) => {
  try {
    const trx = await instance.setDistributor(req.body.address);
    console.log(trx);
    res.json(trx);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post('/setRetailer', async (req, res) => {
  try {
    const trx = await instance.setRetailer(req.body.address);
    console.log(trx);
    res.json(trx);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post('/setCustomer', async (req, res) => {
  try {
    const trx = await instance.setCustomer(req.body.address);
    console.log(trx);
    res.json(trx);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// Distributor adds an item
router.post('/addItem', async (req, res) => {
  try {
    const { itemId, itemName, mfDate, expDate, totalQty } = req.body;
    const trx = await instance.addItem(itemId, itemName, mfDate, expDate, totalQty);
    console.log(trx);
    res.json(trx);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// Retailer accesses item
router.post('/accessItem', async (req, res) => {
  try {
    const { itemId, qty } = req.body;
    const trx = await instance.accessItem(itemId, qty);
    console.log(trx);
    res.json(trx);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// Customer claims ownership
router.post('/claimOwnership', async (req, res) => {
  try {
    const { itemId, qty } = req.body;
    const trx = await instance.claimOwnership(itemId, qty);
    console.log(trx);
    res.json(trx);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// View basic item details
router.get('/viewItemBasicDetails', async (req, res) => {
  try {
    const itemId = req.query.itemId;
    const result = await instance.viewItemBasicDetails(itemId);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// View item dates
router.get('/viewItemDates', async (req, res) => {
  try {
    const itemId = req.query.itemId;
    const result = await instance.viewItemDates(itemId);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

export default router;

