function elFromHTML(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function TransactionDetailModal() {
  return elFromHTML(`
    <div class="modal tx-detail-modal" aria-hidden="true">
      <div class="modal-backdrop"></div>
      <div class="modal-card tx-detail-card" role="dialog" aria-modal="true" aria-labelledby="txDetailTitle">
        <div class="modal-head">
          <h3 id="txDetailTitle">Tranzakció részletei</h3>
          <button class="btn btn-ghost btn-small btn-tx-detail-close" type="button">✕</button>
        </div>
        <div class="tx-detail-body">
          <div class="tx-detail-row">
            <span class="muted">Kategória</span>
            <div class="tx-detail-value tx-detail-category">-</div>
          </div>
          <div class="tx-detail-row">
            <span class="muted">Dátum</span>
            <div class="tx-detail-value tx-detail-date">-</div>
          </div>
          <div class="tx-detail-row">
            <span class="muted">Típus</span>
            <div class="tx-detail-value tx-detail-type">-</div>
          </div>
          <div class="tx-detail-row">
            <span class="muted">Összeg</span>
            <div class="tx-detail-value tx-detail-amount">-</div>
          </div>
        </div>
        <div class="tx-detail-actions">
          <button class="btn btn-small btn-edit-transaction" type="button">Szerkeszt</button>
          <button class="btn btn-small btn-danger btn-delete-transaction" type="button">Töröl</button>
        </div>
      </div>
    </div>
  `);
}
