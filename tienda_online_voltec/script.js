
// ============================================================
// VOLTEC - CATÁLOGO DE PRODUCTOS
// ============================================================

const products = [

  {
    id: 1,
    name: "Capacitor electrolítico 1000 µF",
    category: "Capacitores",
    price: 1500,
    image:"Capacitor electrolitico 25v.jpg",
    description: "25 V, ideal para filtrado de fuentes."
  },

  {
    id: 2,
    name: "Capacitor electrolítico 2200 µF",
    category: "Capacitores",
    image:"Capacitor electrolitico.jpg",
    price: 2000,

  description: "35 V, ideal para filtrado de fuentes."
  },

  {
    id: 3,
    name: "Capacitor cerámico 100 nF",
    category: "Capacitores",
    price: 500,
    image: "capacitor.jpg",
    description: "Capacitor para filtrado."
  },

  {
    id: 4,
    name: "Regulador MC7812CT",
    category: "Semiconductores",
    price: 1000,
    image:"Regulador de tencion 7812.jpg",
    description: "Regulador de tensión positiva de 12 V."
  },

  {
    id: 5,
    name: "Regulador MC7805CT",
    category: "Semiconductores",
    price: 1000,
    image:"regulador 7805.jpg",
    description: "Regulador de tensión positiva de 5 V."
  },

  {
    id: 6,
    name: "Regulador MC7808CT",
    category: "Semiconductores",
    price: 1000,
    image:"Regulador 7808.jpg",
    description: "Regulador de tensión positiva de 8 V."
  },

  {
    id: 7,
    name: "Diodo 1N4007",
    category: "Semiconductores",
    price: 250,
    image:"diodo rectificador.jpg",
    description: "Diodo rectificador de 1 A."
  },

  {
    id: 8,
    name: "Bornera de 2 polos",
    category: "Conectores y terminales ",
    price: 300,
    image:" bornera de 2polos.jpg",
    description: "Conector eléctrico para unir cables de forma segura y sencilla."
  },

  {
    id: 9,
    name: "Kit Arduino",
    category: "Proximamente",
    price: 0,
    image:"kit arduino.jpg",
    description: "Placa de desarrollo para prototipos."
  },

  {
    id: 10,
    name: "Jumper",
    category: "Proximamente",
    price: 0,
    image:"jumpers.jpg",
    description: "Cables de conexión ideales para protoboards y proyectos electrónicos con Arduino."
  }

];


// ============================================================
// VARIABLES GLOBALES
// ============================================================

let cart = [];
let activeCategory = "Todos";
let searchTerm = "";


// ============================================================
// ELEMENTOS DEL DOM
// ============================================================

const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");


// ============================================================
// FORMATO DE PRECIOS
// ============================================================

const money = value => {
  return "$" + value.toLocaleString("es-AR");
};


// ============================================================
// RENDERIZADO DEL CATÁLOGO
// ============================================================

function renderProducts() {

  let filtered = products.filter(product => {

    const matchesCategory =
      activeCategory === "Todos" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;

  });

  const sort = document.getElementById("sortSelect").value;

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  // Generar tarjetas de productos

  productGrid.innerHTML = filtered.map(product => `

    <article class="product-card">

      <div class="product-image">

        ${
          product.image
            ? `<img src="${product.image}" alt="${product.name}">`
            : product.icon
        }

      </div>

      <div class="product-info">

        <span class="product-category">
          ${product.category}
        </span>

        <h3>
          ${product.name}
        </h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-bottom">

          <span class="price">
            ${money(product.price)}
          </span>

          <button
            class="add-button"
            onclick="addToCart(${product.id})"
          >
            Agregar +
          </button>

        </div>

      </div>

    </article>

  `).join("");

  document.getElementById("emptyMessage").hidden =
    filtered.length > 0;

}


// ============================================================
// AGREGAR PRODUCTOS AL CARRITO
// ============================================================

function addToCart(id) {

  const product = products.find(product => product.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  renderCart();

}


// ============================================================
// MODIFICAR CANTIDAD DE PRODUCTOS
// ============================================================

function changeQuantity(id, amount) {

  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();

}


// ============================================================
// RENDERIZADO DEL CARRITO
// ============================================================

function renderCart() {

  const count = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  document.getElementById("cartCount").textContent = count;

  document.getElementById("cartTotal").textContent =
    money(total);

  document.getElementById("cartItems").innerHTML =

    cart.length

      ? cart.map(item => `

          <div class="cart-item">

            <div>
              <h4>${item.name}</h4>
              <p>${money(item.price)} c/u</p>
            </div>

            <div class="quantity">

              <button onclick="changeQuantity(${item.id}, -1)">
                −
              </button>

              <span>${item.quantity}</span>

              <button onclick="changeQuantity(${item.id}, 1)">
                +
              </button>

            </div>

          </div>

        `).join("")

      : '<p class="empty-message">Tu carrito está vacío.</p>';

}


// ============================================================
// ABRIR Y CERRAR CARRITO
// ============================================================

function openCart() {

  cartPanel.classList.add("open");
  overlay.classList.add("show");

}

function closeCart() {

  cartPanel.classList.remove("open");
  overlay.classList.remove("show");

}


// ============================================================
// EVENTOS DEL CARRITO
// ============================================================

document.getElementById("cartToggle")
  .addEventListener("click", openCart);

document.getElementById("closeCart")
  .addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);


// ============================================================
// FILTROS POR CATEGORÍA
// ============================================================

document.querySelectorAll("[data-category]")
  .forEach(button => {

    button.addEventListener("click", () => {

      activeCategory = button.dataset.category;

      renderProducts();

      document.getElementById("catalogo")
        .scrollIntoView({
          behavior: "smooth"
        });

    });

  });


// ============================================================
// BUSCADOR
// ============================================================

function search() {

  searchTerm = document.getElementById("searchInput")
    .value
    .trim()
    .toLowerCase();

  activeCategory = "Todos";

  renderProducts();

}

document.getElementById("searchBtn")
  .addEventListener("click", search);

document.getElementById("searchInput")
  .addEventListener("input", search);


// ============================================================
// ORDENAMIENTO POR PRECIO
// ============================================================

document.getElementById("sortSelect")
  .addEventListener("change", renderProducts);


// ============================================================
// FINALIZAR COMPRA
// ============================================================

document.getElementById("checkoutBtn")
  .addEventListener("click", () => {

    if (!cart.length) {
      alert("El carrito está vacío.");
      return;
    }

    alert(
      "¡Gracias! Esta es una demostración. " +
      "Todavía no está conectado a un sistema de pagos."
    );

  });


// ============================================================
// INICIALIZACIÓN
// ============================================================

renderProducts();
renderCart();
