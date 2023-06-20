import type { BaseProvider } from "@metamask/providers";
import type { LRUCache } from "lru-cache";

declare global {
  var _authKeyStore: LRUCache<string, any, unknown>;
  interface Window {
    ethereum?: BaseProvider;
  }
}
