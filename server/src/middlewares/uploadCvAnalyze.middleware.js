const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MAX_FILE_SIZE = Number(process.env.AI_MAX_FILE_SIZE || 2 * 1024 * 1024); // 2MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/cv-analyze';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `analyze-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Chỉ chấp nhận file PDF, DOC, DOCX hoặc TXT (tối đa 2MB)'), false);
};

const uploadCvAnalyze = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

module.exports = uploadCvAnalyze;
