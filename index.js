const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: 'TEST-TU-APP_USR-8763169598786001-061522-d49ad624d2b2d6d88fed02af56edfc7d-2501309670-TOKEN'  // ← cambia esto por tu token real de pruebas
});

app.post('/crear-preferencia', async (req, res) => {
  try {
    const items = req.body.items.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      currency_id: 'CLP',
      unit_price: item.precio
    }));

    const preference = {
      items,
      back_urls: {
        success: "https://tusitio.com/success",
        failure: "https://tusitio.com/failure"
      },
      auto_return: "approved"
    };

    const result = await mercadopago.preferences.create(preference);
    res.json({ init_point: result.body.init_point });
  } catch (e) {
    console.error("❌ Error creando preferencia:", JSON.stringify(e, null, 2));
    res.status(500).json({ error: e.message || "Error desconocido al crear preferencia" });
  }
});

app.listen(3000, () => console.log('🟢 Servidor Mercado Pago corriendo en http://localhost:3000'));
