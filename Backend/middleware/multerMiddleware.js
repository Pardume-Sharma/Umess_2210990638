import multer from 'multer';
import path from 'path';

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const qrCodeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/qrcodes/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadFields = multer().fields([
  { name: 'avatarImage', maxCount: 1, storage: avatarStorage },
  { name: 'qrCodeImage', maxCount: 1, storage: qrCodeStorage },
]);

const uploadFieldsForProfileUpdate =  multer().fields([
  { name: 'avatarImage', maxCount: 1, storage: avatarStorage }
])

export { uploadFields, uploadFieldsForProfileUpdate };
