const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

const MAX_CV_TEXT_LENGTH = Number(process.env.AI_MAX_CV_TEXT || 8000);

const extractPdfText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy?.();
  return result.text || '';
};

const extractTextFromFile = async (filePath, originalName) => {
  const ext = path.extname(originalName || filePath).toLowerCase();

  let rawText = '';

  if (ext === '.pdf') {
    rawText = await extractPdfText(filePath);
  } else if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    rawText = result.value || '';
  } else if (ext === '.txt') {
    rawText = fs.readFileSync(filePath, 'utf8');
  } else {
    throw new Error('Định dạng file không hỗ trợ. Chỉ chấp nhận PDF, DOCX, DOC, TXT');
  }

  const normalized = rawText.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    throw new Error('Không đọc được nội dung từ file CV. Vui lòng kiểm tra file.');
  }

  if (normalized.length > MAX_CV_TEXT_LENGTH) {
    return {
      text: normalized.slice(0, MAX_CV_TEXT_LENGTH),
      truncated: true,
      originalLength: normalized.length,
    };
  }

  return { text: normalized, truncated: false, originalLength: normalized.length };
};

module.exports = { extractTextFromFile, MAX_CV_TEXT_LENGTH };
