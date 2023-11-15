const Product = require("./Product");
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.lastId = 0;
    this.products = [];
    this.codeList = [];
    this.path = path;
    this.checkPath();
  }

  checkPath() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "", "utf-8");
    } else {
      this.refreshProducts();
    }
  }

  addProduct(product) {
    if (product instanceof Product) {
      this.checkProduct(product);
    } else {
      throw new Error("El dato ingresado no pertenece a Product");
    }
  }

  getProducts() {
    return this.products.map((product) => product);
  }

  getProductById(id) {
    if (this.isValidId(id)) {
      return this.products[id - 1];
    } else {
      throw new Error("Not Found");
    }
  }

  isValidId(id) {
    return id >= 1 && id <= this.lastId;
  }

  checkProduct(product) {
    if (this.isValidProduct(product)) {
      this.add(product);
    } else {
      throw new Error(
        "El producto ingresado no es válido. Revise las propiedades del producto ingresado"
      );
    }
  }

  isValidProduct(product) {
    if (this.isInCodeList(product.code)) {
      throw new Error("El producto ingresado tiene un Codigo repetido");
    }
    return (
      !this.isDataNull(product.title) &&
      !this.isDataNull(product.description) &&
      !this.isDataNull(product.price) &&
      !this.isDataNull(product.thumbnail) &&
      !this.isDataNull(product.code) &&
      !this.isDataNull(product.stock)
    );
  }

  isDataNull(data) {
    return data == null;
  }

  isInCodeList(code) {
    return this.codeList.includes(code);
  }

  refreshProducts() {
    this.lastId = 0;
    this.products = [];
    this.codeList = [];
    let archive = this.getArchive();
    this.products = this.getProductsInString(archive);
  }

  getArchive() {
    return fs.readFileSync(this.path, "utf-8");
  }

  getProductsInString(archive) {
    let list = archive.split("\n");
    let newProducts = [];
    for (let i = 0; i < list.length - 1; i++) {
      const { title, description, price, thumbnail, code, stock } =JSON.parse(list[i]);

      this.lastId++;
      newProducts.push(
        new Product(this.lastId ,title, description, price, thumbnail, code, stock)
      );
      this.codeList.push(code);
    }
    return newProducts;
  }

  add(product) {
    this.products.push(product);
    this.codeList.push(product.code);
    this.lastId++;
    this.addToArchive(product);
  }

  addToArchive(product) {
    let string = JSON.stringify(product);
    fs.appendFileSync(this.path, string + "\n", "utf-8");
  }

  deleteProduct(id) {
    if (this.isValidId) {
      this.delete(this.products[id - 1]);
    } else {
      throw new Error("Not Found");
    }
  }

  delete(product) {
    this.products = this.products.filter((iterator) => iterator !== product);
    this.lastId--;
    this.refreshArchive();
  }

  refreshArchive() {
    fs.writeFileSync(this.path, "", "utf-8");
    this.addAllProducts();
  }

  addAllProducts() {
    let newArchive = "";
    for (let i = 0; i < this.products.length; i++) {
      newArchive += JSON.stringify(this.products[i]) + "\n";
    }
    fs.writeFileSync(this.path, newArchive, "utf-8");
  }

  updateProduct(id, product) {
    if (this.isValidId(id) && this.isProductValidToChange(id, product)) {
      this.remplazeProduct(id, product);
    } else {
      throw new Error("Not Found");
    }
  }

  isProductValidToChange(id, newProduct){
    return newProduct.code == this.products[id-1].code || !this.isInCodeList(newProduct.code);
  }

  remplazeProduct(id, newProduct) {
    this.products[id - 1] = newProduct;
    this.refreshArchive();
  }
}

module.exports = ProductManager;
