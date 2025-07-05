const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
// for storing images
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1];
    const filename = uuidv4() + "." + fileType;
    cb(null, filename);
  },
});

// filter only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError("EXPECT_IMAGE_ONLY", "Only images are allowed"),
      false
    );
  }
};

const limits = {
  fileSize: MAX_IMAGE_SIZE,
};

const MyClassesProfile = multer({ storage, limits, fileFilter }).single(
  "MyClassesProfile"
);
const galleryImages = multer({ storage, limits, fileFilter }).single(
  "galleryImage"
);

module.exports = {
  MyClassesProfile,
  galleryImages,
};
