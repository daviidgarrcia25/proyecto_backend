
const express = require('express');
const router = express.Router();
const Gasto = require('../models/Gasto'); 
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

router.post('/', auth, async (req, res) => {
  const { categoria, monto, fecha } = req.body;
  try {
    const nuevoGasto = new Gasto({
      categoria,
      monto,
      fecha,
      usuario: req.user.id
    });
    const gastoGuardado = await nuevoGasto.save();
    res.json(gastoGuardado);
  } catch (err) {
    console.error(err); 
    res.status(500).send('Error del servidor');
  }
});


router.delete("/:id", auth, async (req, res) => {
  
  try {
    const gasto = await Gasto.findById(req.params.id);
    if (!gasto) {
      console.log("Gasto no encontrado");
      return res.status(404).json({ msg: "Gasto no encontrado" });
    }

    await Gasto.findByIdAndDelete(req.params.id);
    res.json({ msg: "Gasto eliminado" });
  } catch (err) {
    console.error(err); 
    res.status(500).send("Error del servidor");
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const gastos = await Gasto.find({ usuario: req.user.id });
    res.json(gastos);
  } catch (err) {
    console.error(err); 
    res.status(500).send('Error del servidor');
  }
});



module.exports = router;
