import Express from "express";
import multer from "multer";
import path from "path";

export const mailBoxImageUpload: Express.RequestHandler = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "static");
    },
    filename: (req, file, cb) => {
      cb(null, `mailbox-image-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
}).single("image");
