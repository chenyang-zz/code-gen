import { Store as _Store } from "@tauri-apps/plugin-store";

export default class Store {
	static #store: _Store;

	static async _getStore() {
		if (!this.#store) {
			this.#store = await _Store.load("store.json");
		}
		return this.#store;
	}

	static async get<T>(key: string) {
		const store = await this._getStore();
		return store.get<T>(key);
	}

	static async set<T>(key: string, value: T) {
		const store = await this._getStore();
		return store.set(key, value);
	}
}
