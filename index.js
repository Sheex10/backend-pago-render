const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: 'TEST-8721001581479559-061801-b002b51c6de767681a34cf6a948e228d-2095110352'  // ← cambia esto por tu token real de pruebas
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor Mercado Pago corriendo en puerto ${PORT}`);
});
