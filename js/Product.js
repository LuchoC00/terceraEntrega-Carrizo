class Product{
  constructor(id,title, description, price, thumbnail, code, stock) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }

  toString(){
    return `Producto: ${this.title}, Descripción: ${this.description}, Precio: ${this.price}, Thumbnail: ${this.thumbnail}, Código: ${this.code}, Stock: ${this.stock}`;
  }
}

module.exports = Product;