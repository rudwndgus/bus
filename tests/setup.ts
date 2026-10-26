import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
const data = new Map<string, string>();
const storage: Storage = {
  get length() {
    return data.size;
  },
  clear: () => data.clear(),
  getItem: (key) => data.get(key) ?? null,
  key: (i) => Array.from(data.keys())[i] ?? null,
  removeItem: (key) => {
    data.delete(key);
  },
  setItem: (key, value) => {
    data.set(key, String(value));
  },
};
Object.defineProperty(globalThis, "localStorage", {
  value: storage,
  configurable: true,
});
afterEach(cleanup);
