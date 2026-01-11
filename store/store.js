export const store = {
  user: null,
  transactions: [],
  categories: [], // ✅
  backendStatus: "unknown",
  listeners: new Set(),

  setUser(data) {
    this.user = data;
    this.transactions = data?.transactions ?? [];
    this.emit();
  },

  setCategories(kat) {
    this.categories = kat; // ✅ teljes lista
    this.emit();
  },

  setBackendStatus(status) {
    this.backendStatus = status;
    this.emit();
  },

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },

  emit() {
    for (const fn of this.listeners) fn(this);
  }
};
