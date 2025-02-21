import multer from "multer";

export const fileStorageCourse = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/courses");
  },
  filename: (req, file, cb) => {
    const ext = file.originalName.split(".")[1];
    const uniqeId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqeId}.${ext}`);
  },
});

export const fileFilter = (req, file, cb) => {
  if (
    file.mimeType === "image/jpg" ||
    file.mimeType === "image/jpeg" ||
    file.mimeType === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
