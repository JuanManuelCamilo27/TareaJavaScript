// Cada producto que vende el super es creado con esta clase
class Producto {
  sku; // Identificador único del producto
  nombre; // Su nombre
  categoria; // Categoría a la que pertenece este producto
  precio; // Su precio
  stock; // Cantidad disponible en stock

  constructor(sku, nombre, precio, categoria, stock) {
    this.sku = sku;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;

    // Si no me definen stock, pongo 10 por default
    if (stock) {
      this.stock = stock;
    } else {
      this.stock = 10;
    }
  }
}

// Creo todos los productos que vende mi super
const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
  productos; // Lista de productos agregados
  categorias; // Lista de las diferentes categorías de los productos en el carrito
  precioTotal; // Lo que voy a pagar al finalizar mi compra

  // Al crear un carrito, empieza vació
  constructor() {
    this.precioTotal = 0;
    this.productos = [];
    this.categorias = [];
  }

  //función que agrega @{cantidad} de productos con @{sku} al carrito
  async agregarProducto(sku, cantidad) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Busco el producto en la "base de datos"
          const producto = await findProductBySku(sku);
          console.log(`-----------------`);
          console.log(`Agregando ${cantidad} ${sku}`);
          console.log(`-----------------`);

          console.log("Se encontro el producto", producto);
          console.log(`-----------------`);

          //Creo el nuevo producto
          const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);

          //Checkeo si el producto esta o no en el carro
          const indexProducto = this.productos.findIndex((prod) => prod.sku === nuevoProducto.sku);

          //Checkeo si la categoria ya esta en el array
          const indexCategoria = this.categorias.findIndex((cat) => cat === producto.categoria);

          //Si el producto no esta en el carro, lo pusheo y calculo el precio
          if (indexProducto === -1) {
            //Si la categoria no esta, la pusheo
            if (indexCategoria === -1) {
              this.categorias.push(producto.categoria);
            }
            this.productos.push(nuevoProducto);
            this.precioTotal = this.precioTotal + producto.precio * cantidad;
          } else {
            //Si el producto ya esta en el carro, aumento la cantidad y calculo el precio
            this.productos[indexProducto].cantidad += nuevoProducto.cantidad;
            this.precioTotal = this.precioTotal + producto.precio * cantidad;
          }

          //Por ultimo, devolvemos el carrito con los productos, las categorias y el precio total
          console.log("Productos en el Carro:", this.productos);
          console.log("Categorias de Productos:", this.categorias);
          console.log("Precio Total:", this.precioTotal);

          //Resolvemos la promesa
          resolve(`Producto agregado correctamente`);
          console.log(`-----------------`);
        } catch (err) {
          //Manejamos el error
          console.log(err);
          reject(`Error a la hora de agregar el producto`);
        }
      }, 2000);
    });
  }

  //función que elimina @{cantidad} de productos con @{sku} del carrito
  async eliminarProducto(sku, cantidad) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Busco el producto en la "base de datos"
          const producto = await findProductBySku(sku);

          console.log(`-----------------`);
          console.log(`Eliminando ${cantidad} ${sku}`);
          console.log(`-----------------`);

          //Manejamos el caso en que el producto a eliminar no este en el carro
          const index = this.productos.find((producto) => producto.sku === sku);
          if (!index) {
            reject(`El producto que queres eliminar no esta en el carrito`);
          }

          //Loop para recorrer el array de productos
          for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].sku == sku) {
              if (cantidad >= this.productos[i].cantidad) {
                //Si ambos if son true, eliminamos el producto del carro por completo y
                //acutalizamos el precio
                this.precioTotal = this.precioTotal - producto.precio * this.productos[i].cantidad;
                this.productos.splice(i, 1);

                //Checkeamos que la categoria a eliminar exista
                const indexCategoria = this.categorias.findIndex(
                  (categ) => categ === producto.categoria
                );
                //Si la categoria existe, la eliminamos
                if (indexCategoria > -1) {
                  this.categorias.splice(indexCategoria, 1);
                }
              } else {
                //Si la cantidad a eliminar es menor a la que hay en el carrito, actualizamos
                this.productos[i].cantidad -= cantidad;
                this.precioTotal = this.precioTotal - producto.precio * cantidad;
              }
            }
          }

          //Por ultimo, devolvemos el carrito con los productos, las categorias y el precio total
          console.log("Productos en el Carro:", this.productos);
          console.log("Precio Total:", this.precioTotal);
          console.log("Categorias de Productos:", this.categorias);
          //Resolvemos
          console.log(`-----------------`);
          resolve(`Se ha eliminado con exito la cantidad de productos deseada`);
          console.log(`-----------------`);
        } catch {
          //Manejamos el error
          console.log(`"No se puede eliminar el producto ${sku}."`);
          reject(
            `Error, el sku del producto no corresponde a alguno de los productos de nuestra base de datos`
          );
        }
      }, 2000);
    });
  }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
  sku; // Identificador único del producto
  nombre; // Su nombre
  cantidad; // Cantidad de este producto en el carrito

  constructor(sku, nombre, cantidad) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find((product) => product.sku === sku);
      if (foundProduct) {
        resolve(foundProduct);
      } else {
        reject(`Product ${sku} not found`);
      }
    }, 1500);
  });
}

const carrito = new Carrito();
carrito
  .agregarProducto("FN312PPE", 5)
  .then((res) => {
    console.log(res);
    carrito
      .agregarProducto("FN312PPE", 5)
      .then((res) => {
        console.log(res);
        carrito
          .agregarProducto("UI999TY", 3)
          .then((res) => {
            console.log(res);
            carrito
              .agregarProducto("UI999TY", 2)
              .then((res) => {
                console.log(res);
                carrito
                  .eliminarProducto("UI999TY", 5)
                  .then((res) => console.log(res))
                  .catch((rej) => console.log(rej));
              })
              .catch((rej) => console.log(rej));
          })
          .catch((rej) => console.log(rej));
      })
      .catch((rej) => console.log(rej));
  })
  .catch((rej) => console.log(rej));
