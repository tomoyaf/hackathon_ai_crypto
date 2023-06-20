import { LRUCache } from "lru-cache";

let _auth: LRUCache<string, any, unknown>;
const authConfig = {
  max: 500,
  ttl: 1000 * 60 * 10, // 10分
};

// シングルトンクラスが開発環境で使えないためこのような形にした
export function getAuthKeyStore() {
  // if (process.env.NODE_ENV !== "production") {
  //   global._authKeyStore =
  //     global._authKeyStore || new LRUCache<string, any>(authConfig);
  //   return global._authKeyStore as LRUCache<string, any>;
  // } else {
  //   _auth = _auth || new LRUCache<string, any>(authConfig);
  //   return _auth;
  // }

  global._authKeyStore =
    global._authKeyStore || new LRUCache<string, any>(authConfig);
  return global._authKeyStore as LRUCache<string, any>;
}
