const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const gastoRoutes = require("./routes/gastos");
const userRoutes = require("./routes/users"); 

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/gastos", gastoRoutes);
app.use("/api/users", userRoutes); 


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));


app.get("/", (req, res) => {
  res.send("API de Seguimiento de Gastos");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
