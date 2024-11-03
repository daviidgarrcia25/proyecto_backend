const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");


router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Error del servidor" });
  }
});


router.post(
  "/",
  [
    auth,
    body("nombre", "El nombre es requerido").not().isEmpty(),
    body("email", "Por favor incluye un email válido").isEmail(),
    body("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { nombre, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "El usuario ya existe" });
      }

      user = new User({
        nombre,
        email,
        password,
      });

      await user.save();
      res.json({ msg: "Usuario creado con éxito" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);


router.put("/:id", auth, async (req, res) => {
  const { nombre, email } = req.body;
  const userUpdates = {};

  if (nombre) userUpdates.nombre = nombre;
  if (email) userUpdates.email = email;

  try {
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    user = await User.findByIdAndUpdate(req.params.id, { $set: userUpdates }, { new: true });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Error del servidor" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "Usuario eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

module.exports = router;
