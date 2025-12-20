function elFromHTML(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function SidebarBrand() {
  return elFromHTML(`
    <div class="brand">
      <div class="logo">₿</div>
      <div>
        <div class="brand-title">Budget</div>
        <div class="brand-sub">követő</div>
      </div>
    </div>
  `);
}

function SidebarNav() {
  return elFromHTML(`
    <nav class="nav">
      <!-- // DB: nem kell, de route alapján 'active' class -->
      <a class="nav-item btn">
      <span class="ujtran ">💸</span> Új tranzakció
      </a>
      <a class="nav-item active" href="#dashboard">
        <span class="nav-icon">📊</span> Dashboard
      </a>
      <a class="nav-item" href="#transactions">
        <span class="nav-icon">🧾</span> Tranzakciók
      </a>
      <a class="nav-item" href="#categories">
        <span class="nav-icon">🏷️</span> Kategóriák
      </a>
      <a class="nav-item" href="#settings">
        <span class="nav-icon">⚙️</span> Beállítások
      </a>
    </nav>
  `);
}

function SidebarFooter() {
  return elFromHTML(`
    <div class="sidebar-footer">
      <!-- // DB: user adatok -->
      <!-- // user: { id, name, email, avatarInitial/ avatarUrl } -->
      <div class="user-card">
        <div class="avatar">?</div>
        <div class="user-meta">
          <div class="user-name">-</div>
          <div class="user-email">-</div>
        </div>
      </div>

      <!-- // DB: nem kell; auth/logout action -->
      <button class="btn btn-ghost">Kijelentkezés</button>
    </div>
  `);
}

export function Sidebar() {
  const aside = document.createElement("aside");
  aside.className = "sidebar";

  // SIDEBAR
  // // DB: user (aktuális felhasználó)
  // // DB: navigation state (aktuális oldal/route alapján active)

  aside.appendChild(SidebarBrand());
  aside.appendChild(SidebarNav());
  aside.appendChild(SidebarFooter());

  return aside;
}
