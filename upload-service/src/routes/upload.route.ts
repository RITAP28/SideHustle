import express from "express";
import { handleUploadVideos } from "../controllers/upload.service";
import multer from "multer";
import { isAuthenticated } from "../middleware/auth.status";

const upload = multer({
  storage: multer.memoryStorage(),
});

export default (router: express.Router) => {
  router.post(
    "/upload",
    isAuthenticated,
    upload.fields([
      {
        name: "video",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    handleUploadVideos
  );
};
