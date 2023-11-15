const express = require("express")
const ProductManager = require("../js/ProductManager")

const app = express();
const PORT = 5000;
const manager = new ProductManager("./data/data.txt")

app.use(express.urlencoded({extended:true}))

app.get("/",(req, res)=>{
  res.send("<h3>Bienvenido a mi primer servidor</h3>")
})

app.get("/products", (req, res) => {
  const { limit } = req.query;

  let products = manager.getProducts();

  if (limit) {
    const limitInt = parseInt(limit);
    if (!isNaN(limitInt) && limitInt > 0) {
      products = products.slice(0, limitInt);
    } else {
      products = {"Error" : `el limite "${limit}" no es valido`}
    }
  }

  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const {id} = req.params;
  let mensaje = manager.getProducts();

  if (id) {
    const idInt = parseInt(id);
    if (!isNaN(idInt) && idInt > 0 && idInt < mensaje.length) {
      mensaje = manager.getProductById(id)
    } else {
      mensaje = {"Error" : `el id: ${id} No es un id valido`}
    }
  }

  res.json(mensaje);
});


app.listen(PORT, ()=>console.log(`Servidor recibiendo en el puerto: ${PORT}`))