import { Storage, AddAclOptions } from "@google-cloud/storage";
import nodePath from "node:path";

export const storage = new Storage({
  projectId: "aicrypto-389808",
  keyFilename: nodePath.resolve(__dirname, "../key/gcloud.json"),
});

export async function createBucket(
  option: { defaultACL?: AddAclOptions } = {}
) {
  const bucket = storage.bucket("ai_crypto");
  const acl = option.defaultACL ?? {
    entity: "allUsers",
    role: Storage.acl.READER_ROLE,
  };

  await bucket.acl.default.add(acl);
  return bucket;
}
