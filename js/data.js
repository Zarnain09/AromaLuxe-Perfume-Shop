/* ===================== AromaLuxe "Database" Layer =====================
   Simulated backend + database using localStorage, as specified in the
   project proposal (client-side JS acting as the data/persistence layer). */

const DB_KEYS = {
  PRODUCTS: "al_products",
  USERS: "al_users",
  CURRENT_USER: "al_current_user",
  CART: "al_cart",
  WISHLIST: "al_wishlist",
  REVIEWS: "al_reviews",
  ORDERS: "al_orders",
  SUBSCRIBERS: "al_subscribers",
  MESSAGES: "al_messages",
};

const SEED_PRODUCTS = [
  { id: "p1", name: "Velvet Oud", category: "Men", family: "Woody", price: 85, notes: "Oud, Amber, Leather", color1: "#3b2a1a", color2: "#8a6d3b", desc: "A deep, smoky oud perfume with warm amber and leather undertones — bold and long-lasting." },
  { id: "p2", name: "Golden Bloom", category: "Women", family: "Floral", price: 75, notes: "Jasmine, Rose, Vanilla", color1: "#7a1f3d", color2: "#e0a8c0", desc: "A radiant floral bouquet of jasmine and rose, softened with warm vanilla." },
  { id: "p3", name: "Citrus Breeze", category: "Unisex", family: "Fresh", price: 60, notes: "Bergamot, Lemon, Mint", color1: "#1f5c3b", color2: "#bfe6a0", desc: "A crisp, energizing citrus burst perfect for everyday wear." },
  { id: "p4", name: "Midnight Noir", category: "Men", family: "Spicy", price: 90, notes: "Black Pepper, Cedarwood, Musk", color1: "#141414", color2: "#5a5a5a", desc: "A sharp, confident scent built on black pepper, cedarwood, and smooth musk." },
  { id: "p5", name: "Rose Mystique", category: "Women", family: "Floral", price: 80, notes: "Rose, Peony, Sandalwood", color1: "#9c2c4f", color2: "#f0c2d4", desc: "An elegant rose and peony composition resting on creamy sandalwood." },
  { id: "p6", name: "Ocean Mist", category: "Unisex", family: "Aquatic", price: 65, notes: "Sea Salt, Driftwood, Citrus", color1: "#0e3a52", color2: "#8fd0e8", desc: "A breezy aquatic fragrance evoking sea salt air and sun-warmed driftwood." },
  { id: "p7", name: "Amber Dusk", category: "Men", family: "Oriental", price: 95, notes: "Amber, Vanilla, Tobacco", color1: "#4a2f12", color2: "#c98a3b", desc: "A rich oriental blend of amber, vanilla, and warm tobacco leaf." },
  { id: "p8", name: "Blush Petal", category: "Women", family: "Floral", price: 70, notes: "Peony, Lychee, Musk", color1: "#b8597a", color2: "#f6d5e2", desc: "A soft, playful floral with juicy lychee and a gentle musk base." },
  { id: "p9", name: "Vetiver Storm", category: "Men", family: "Woody", price: 88, notes: "Vetiver, Bergamot, Patchouli", color1: "#2b3a1f", color2: "#8fae5c", desc: "An earthy, grounded fragrance of vetiver and patchouli lifted by bergamot." },
  { id: "p10", name: "Sweet Vanilla", category: "Women", family: "Gourmand", price: 72, notes: "Vanilla, Caramel, Tonka Bean", color1: "#5c3a1e", color2: "#e8c08a", desc: "A cozy, sweet gourmand scent of vanilla, caramel, and tonka bean." },
  { id: "p11", name: "Neutral Grace", category: "Unisex", family: "Musk", price: 68, notes: "White Musk, Iris, Cedar", color1: "#3a3a42", color2: "#c6c6d2", desc: "A clean, minimal musk fragrance with soft iris and cedar." },
  { id: "p12", name: "Royal Saffron", category: "Unisex", family: "Luxury", price: 110, notes: "Saffron, Oud, Rose", color1: "#5c1414", color2: "#e0b84a", desc: "An opulent, rare blend of saffron, oud, and rose for a signature statement scent." },
];

function initDB() {
  if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
  }
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([
      { name: "Admin", email: "admin@aromaluxe.com", password: "admin123", isAdmin: true }
    ]));
  }
  if (!localStorage.getItem(DB_KEYS.CART)) localStorage.setItem(DB_KEYS.CART, JSON.stringify([]));
  if (!localStorage.getItem(DB_KEYS.WISHLIST)) localStorage.setItem(DB_KEYS.WISHLIST, JSON.stringify([]));
  if (!localStorage.getItem(DB_KEYS.REVIEWS)) localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify({}));
  if (!localStorage.getItem(DB_KEYS.ORDERS)) localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]));
  if (!localStorage.getItem(DB_KEYS.SUBSCRIBERS)) localStorage.setItem(DB_KEYS.SUBSCRIBERS, JSON.stringify([]));
  if (!localStorage.getItem(DB_KEYS.MESSAGES)) localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify([]));
}

function getProducts() { return JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS)) || []; }
function saveProducts(list) { localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(list)); }
function getProduct(id) { return getProducts().find(p => p.id === id); }

function addProduct(product) {
  const list = getProducts();
  product.id = "p" + (Date.now());
  list.push(product);
  saveProducts(list);
}
function updateProduct(id, updates) {
  const list = getProducts().map(p => p.id === id ? { ...p, ...updates } : p);
  saveProducts(list);
}
function deleteProduct(id) {
  saveProducts(getProducts().filter(p => p.id !== id));
}

/* ---------- Users / Auth ---------- */
function getUsers() { return JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || []; }
function saveUsers(list) { localStorage.setItem(DB_KEYS.USERS, JSON.stringify(list)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER)); }
function setCurrentUser(user) { localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user)); }
function logoutUser() { localStorage.removeItem(DB_KEYS.CURRENT_USER); }

function registerUser(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { ok: false, msg: "An account with this email already exists." };
  users.push({ name, email, password, isAdmin: false });
  saveUsers(users);
  return { ok: true };
}
function loginUser(email, password) {
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, msg: "Invalid email or password." };
  setCurrentUser(user);
  return { ok: true, user };
}

/* ---------- Cart ---------- */
function getCart() { return JSON.parse(localStorage.getItem(DB_KEYS.CART)) || []; }
function saveCart(cart) { localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart)); }
function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (item) item.qty += qty; else cart.push({ id, qty });
  saveCart(cart);
}
function updateCartQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) { cart = cart.filter(c => c.id !== id); }
  else { cart = cart.map(c => c.id === id ? { ...c, qty } : c); }
  saveCart(cart);
}
function removeFromCart(id) { saveCart(getCart().filter(c => c.id !== id)); }
function clearCart() { saveCart([]); }
function cartCount() { return getCart().reduce((n, c) => n + c.qty, 0); }
function cartTotal() {
  return getCart().reduce((sum, c) => { const p = getProduct(c.id); return p ? sum + p.price * c.qty : sum; }, 0);
}

/* ---------- Wishlist ---------- */
function getWishlist() { return JSON.parse(localStorage.getItem(DB_KEYS.WISHLIST)) || []; }
function saveWishlist(list) { localStorage.setItem(DB_KEYS.WISHLIST, JSON.stringify(list)); }
function isWishlisted(id) { return getWishlist().includes(id); }
function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) list = list.filter(w => w !== id); else list.push(id);
  saveWishlist(list);
  return list.includes(id);
}

/* ---------- Reviews ---------- */
function getReviews(productId) {
  const all = JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS)) || {};
  return all[productId] || [];
}
function addReview(productId, name, rating, comment) {
  const all = JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS)) || {};
  if (!all[productId]) all[productId] = [];
  all[productId].push({ name, rating, comment, date: new Date().toLocaleDateString() });
  localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(all));
}
function avgRating(productId) {
  const r = getReviews(productId);
  if (!r.length) return 0;
  return (r.reduce((s, x) => s + Number(x.rating), 0) / r.length).toFixed(1);
}

/* ---------- Orders / Checkout ---------- */
function placeOrder(shipping) {
  const orders = JSON.parse(localStorage.getItem(DB_KEYS.ORDERS)) || [];
  const order = {
    id: "ORD" + Date.now().toString().slice(-8),
    items: getCart().map(c => ({ ...c, product: getProduct(c.id) })),
    total: cartTotal(),
    shipping,
    date: new Date().toLocaleString(),
  };
  orders.push(order);
  localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
  clearCart();
  return order;
}

/* ---------- Newsletter / Contact ---------- */
function subscribeNewsletter(email) {
  const list = JSON.parse(localStorage.getItem(DB_KEYS.SUBSCRIBERS)) || [];
  if (!list.includes(email)) list.push(email);
  localStorage.setItem(DB_KEYS.SUBSCRIBERS, JSON.stringify(list));
}
function submitContactMessage(name, email, message) {
  const list = JSON.parse(localStorage.getItem(DB_KEYS.MESSAGES)) || [];
  list.push({ name, email, message, date: new Date().toLocaleString() });
  localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(list));
}

initDB();
