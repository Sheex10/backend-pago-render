const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: 'TU_ACCESS_TOKEN_AQUÍ' // ← reemplázalo con tu token de prueba o producción
});

app.post('/crear-preferencia', async (req, res) => {
  try {
    const { items, usuario } = req.body;

    console.log("🛍️ Productos en carrito:", items);
    console.log("👤 Usuario:", usuario);

    const mpItems = items.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      currency_id: 'CLP',
      unit_price: item.precio
    }));

    const preference = {
      items: mpItems,
      back_urls: {
        success: `https://tusitio.com/success?usuario_id=${usuario?.id || ''}`,
        failure: `https://tusitio.com/failure?usuario_id=${usuario?.id || ''}`
      },
      auto_return: 'approved',
      metadata: {
        usuario_id: usuario?.id,
        nombre: usuario?.nombre,
        correo: usuario?.correo,       // ← coincide con tu tabla
        rut: usuario?.rut,
        direccion: usuario?.direccion,
        telefono: usuario?.telefono
      }
    };

    const result = await mercadopago.preferences.create(preference);
    res.json({ init_point: result.body.init_point });

  } catch (e) {
    console.error("❌ Error creando preferencia:", JSON.stringify(e, null, 2));
    res.status(500).json({ error: e.message || "Error desconocido al crear preferencia" });
  }
});

app.listen(3000, () => {
  console.log('🟢 Servidor Mercado Pago corriendo en http://localhost:3000');
});
