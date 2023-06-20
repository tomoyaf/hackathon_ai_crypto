import { Storage, AddAclOptions, SaveOptions } from "@google-cloud/storage";

export const storage = new Storage({
  projectId: "aicrypto-389808",
  credentials: {
    type: "service_account",
    project_id: "aicrypto-389808",
    private_key_id: process.env.GCLOUD_PRIVATE_KEY_ID ?? "",
    private_key: process.env.GCLOUD_PRIVATE ?? "",
    client_email: "api-server@aicrypto-389808.iam.gserviceaccount.com",
    client_id: "114231271332667009312",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/api-server%40aicrypto-389808.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  } as any,
});

export async function createBucket(
  option: { defaultACL?: AddAclOptions } = {}
) {
  const bucket = storage.bucket("ai_crypto");
  const acl = option.defaultACL ?? {
    entity: "allUsers",
    role: Storage.acl.READER_ROLE,
  };

  // await bucket.acl.default.add(acl);
  return bucket;
}

export async function uploadFile(
  file: Buffer | string,
  filePath: string,
  uploadOption?: SaveOptions
) {
  const bucket = await createBucket();
  const fileObj = bucket.file(filePath);
  await fileObj.save(file, uploadOption);
  return fileObj;
}

export async function createWriteStream(
  filename: string,
  contentType?: string
) {
  const bucket = await createBucket();
  const stream = bucket.file(filename).createWriteStream({
    gzip: true,
    contentType: contentType,
  });

  return stream;
}
