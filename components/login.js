function elFromHTML(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function Login() {
  return elFromHTML(`
    <section class="auth">
      <div class="auth-card">
        <div class="auth-brand">
          <div class="logo">₿</div>
          <div>
            <div class="brand-title">Budget</div>
            <div class="brand-sub">követő</div>
          </div>
        </div>

        <h1 class="auth-title">Bejelentkezés</h1>
        <p class="auth-sub">
          Lépj be az adataidhoz, és folytasd ott, ahol abbahagytad.
        </p>

        <form class="auth-form">
          <label class="field">
            <span>Email</span>
            <input class="input-email" type="email" placeholder="pl. admin@gmail.com" required />
          </label>
          <label class="field">
            <span>Jelszó</span>
            <input class="input-password" type="password" placeholder="Jelszó" required />
          </label>
          <button class="btn btn-primary" type="submit">Belépés</button>
          <p class="auth-error" role="alert" aria-live="polite"></p>
        </form>
      </div>
    </section>
  `);
}
