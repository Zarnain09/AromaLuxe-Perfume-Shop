/* ===================== AromaLuxe Shared UI Layer ===================== */

function bottleSwatch(p, size) {
  size = size || 100;
  return `<div class="bottle-swatch" style="background:linear-gradient(160deg, ${p.color1}, ${p.color2});">
    <div class="bottle-cap"></div>
    <div class="bottle-label">${p.name}</div>
  </div>`;
}

function starString(rating) {
  const r = Math.round(rating);
  return "★★★★★☆☆☆☆☆".slice(5 - r, 10 - r);
}

function renderHeaderFooter() {
  const user = getCurrentUser();
  const path = location.pathname.split("/").pop() || "index.html";
  const nav = [
    ["index.html", "Home"],
    ["shop.html", "Shop"],
    ["about.html", "About"],
    ["contact.html", "Contact"],
  ];
  const navHtml = nav.map(([href, label]) =>
    `<li class="nav-item"><a class="nav-link ${path === href ? "active-link" : ""}" href="${href}">${label}</a></li>`
  ).join("");

  const userHtml = user
    ? `<li class="nav-item dropdown">
         <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Hi, ${user.name.split(" ")[0]}</a>
         <ul class="dropdown-menu dropdown-menu-end">
           ${user.isAdmin ? '<li><a class="dropdown-item" href="admin.html">Admin Panel</a></li>' : ""}
           <li><a class="dropdown-item" href="wishlist.html">Wishlist</a></li>
           <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
         </ul>
       </li>`
    : `<li class="nav-item"><a class="nav-link" href="login.html">Login / Sign Up</a></li>`;

  document.getElementById("site-header").innerHTML = `
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top al-navbar">
    <div class="container">
      <a class="navbar-brand al-brand" href="index.html">AromaLuxe</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">${navHtml}</ul>
        <ul class="navbar-nav align-items-lg-center gap-lg-2">
          <li class="nav-item"><a class="nav-link" href="wishlist.html">♡ Wishlist</a></li>
          <li class="nav-item"><a class="nav-link position-relative" href="cart.html">🛍 Cart
            <span class="badge rounded-pill bg-warning text-dark" id="cartBadge">${cartCount()}</span></a></li>
          ${userHtml}
        </ul>
      </div>
    </div>
  </nav>`;

  document.getElementById("site-footer").innerHTML = `
  <footer class="al-footer">
    <div class="container py-5">
      <div class="row gy-4">
        <div class="col-md-4">
          <h5 class="al-brand">AromaLuxe</h5>
          <p class="text-light-50">Signature fragrances for every story. Discover perfumes crafted to be remembered.</p>
        </div>
        <div class="col-md-4">
          <h6>Quick Links</h6>
          <ul class="list-unstyled">
            <li><a href="shop.html">Shop</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="col-md-4">
          <h6>Newsletter</h6>
          <p class="small text-light-50">Get updates on new arrivals and offers.</p>
          <form id="newsletterForm" class="d-flex gap-2">
            <input type="email" required class="form-control form-control-sm" placeholder="Your email" id="newsletterEmail">
            <button class="btn btn-warning btn-sm text-nowrap" type="submit">Subscribe</button>
          </form>
          <div id="newsletterMsg" class="small text-warning mt-1"></div>
        </div>
      </div>
      <hr class="border-secondary">
      <p class="text-center small text-light-50 mb-0">&copy; 2026 AromaLuxe. College Project Demo.</p>
    </div>
  </footer>`;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", (e) => { e.preventDefault(); logoutUser(); location.href = "index.html"; });

  const newsForm = document.getElementById("newsletterForm");
  if (newsForm) newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    subscribeNewsletter(document.getElementById("newsletterEmail").value);
    document.getElementById("newsletterMsg").textContent = "Subscribed! Thank you.";
    newsForm.reset();
  });
}

function requireLogin(redirect) {
  if (!getCurrentUser()) { location.href = "login.html?next=" + (redirect || location.pathname.split("/").pop()); return false; }
  return true;
}

document.addEventListener("DOMContentLoaded", renderHeaderFooter);
