const Medicine = require("../models/Medicine");

router.post('/', verifyJWT, async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).send({ message: 'Medicine added successfully' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
