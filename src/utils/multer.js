import multer from "multer";

export const fileStorageCourse = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/courses");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".")[1];
    const uniqeId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqeId}.${ext}`);
  },
});

export const fileFilter = (req, file, cb) => {
  if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
