import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File as FormidableFile } from "formidable";
import { createWriteStream } from "@/utils/storage";
import { generateRandomString } from "@/utils";
import path from "path";
import { createReadStream } from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return;

  try {
    const session = await getServerSession(req, res, authOptions);
    console.log({ session });
    if (session == null) {
      res.status(401).json({
        message: "ログインしてください",
      });
      return;
    }

    const dir = req.query.dir ?? "";

    const form = new IncomingForm();
    form.parse(req, async (err, _fields, files) => {
      if (err) {
        res.status(500).json({
          method: req.method,
          error: err,
        });
        return;
      }

      const file = (files.file as FormidableFile[])[0];
      const ext = path.extname(file.originalFilename ?? "");
      const filepath = dir + generateRandomString(64) + ext;

      createReadStream(file.filepath)
        .pipe(await createWriteStream(filepath))
        .on("finish", () => {
          res.status(200).json({
            filepath: "https://storage.googleapis.com/ai_crypto/" + filepath,
          });
        })
        .on("error", (err) => {
          res.status(500).json("File upload error: " + err.message);
        });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
