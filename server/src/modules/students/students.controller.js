const fs = require('fs');
const SavedJob = require('./savedJob.model');
const AiSuggestion = require('./aiSuggestion.model');
const Application = require('../applications/applications.model');
const Job = require('../jobs/jobs.model');
const { extractTextFromFile, MAX_CV_TEXT_LENGTH } = require('../../utils/cvParser');
const { rankJobsByCv, extractSkills } = require('../../utils/cvMatcher');
const { buildActiveJobFilter } = require('../../utils/jobQuery');

const getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ userId: req.user._id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId', select: 'name logo' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: saved.map((s) => s.jobId).filter(Boolean),
    });
  } catch (error) {
    return next(error);
  }
};

const toggleSaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tuyển dụng' });
    }

    const existing = await SavedJob.findOne({ userId: req.user._id, jobId });
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ success: true, saved: false, message: 'Đã bỏ lưu việc làm' });
    }

    await SavedJob.create({ userId: req.user._id, jobId });
    return res.status(200).json({ success: true, saved: true, message: 'Đã lưu việc làm' });
  } catch (error) {
    return next(error);
  }
};

const checkSavedJob = async (req, res, next) => {
  try {
    const saved = await SavedJob.findOne({ userId: req.user._id, jobId: req.params.jobId });
    return res.status(200).json({ success: true, saved: !!saved });
  } catch (error) {
    return next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'title salary location',
        populate: { path: 'companyId', select: 'name logo' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    return next(error);
  }
};

const getApplicationStats = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user._id });
    const byMonth = {};
    applications.forEach((app) => {
      const key = `${app.createdAt.getFullYear()}-${String(app.createdAt.getMonth() + 1).padStart(2, '0')}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      data: {
        total: applications.length,
        byMonth: Object.entries(byMonth).map(([month, count]) => ({ month, count })),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const analyzeCv = async (req, res, next) => {
  let filePath = null;

  try {
    let cvText = (req.body.cvText || '').trim();
    let truncated = false;
    let originalLength = cvText.length;

    if (req.file) {
      filePath = req.file.path;
      const parsed = await extractTextFromFile(filePath, req.file.originalname);
      cvText = parsed.text;
      truncated = parsed.truncated;
      originalLength = parsed.originalLength;
    }

    if (!cvText) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng upload file CV (PDF/DOCX, tối đa 2MB) hoặc dán nội dung text',
      });
    }

    if (cvText.length > MAX_CV_TEXT_LENGTH) {
      cvText = cvText.slice(0, MAX_CV_TEXT_LENGTH);
      truncated = true;
    }

    const jobs = await Job.find(buildActiveJobFilter()).populate('companyId', 'name logo');
    const ranked = rankJobsByCv(cvText, jobs, 10);
    const suggestedJobs = ranked.map((r) => r.job);
    const detectedSkills = extractSkills(cvText);

    const history = await AiSuggestion.create({
      userId: req.user._id,
      cvFileName: req.file?.originalname || 'pasted-text',
      cvText: cvText.slice(0, 5000),
      suggestedJobs: suggestedJobs.map((j) => j._id),
    });

    return res.status(200).json({
      success: true,
      message: suggestedJobs.length
        ? 'Phân tích CV hoàn tất'
        : 'Không tìm thấy việc phù hợp — hãy bổ sung kỹ năng/kinh nghiệm trong CV',
      data: {
        suggestions: suggestedJobs,
        scores: ranked.map((r) => ({ jobId: r.job._id, score: r.score, skills: r.matchedSkills })),
        detectedSkills,
        truncated,
        originalLength,
        historyId: history._id,
      },
    });
  } catch (error) {
    return next(error);
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

const getAiHistory = async (req, res, next) => {
  try {
    const history = await AiSuggestion.find({ userId: req.user._id })
      .populate('suggestedJobs', 'title salary location')
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSavedJobs,
  toggleSaveJob,
  checkSavedJob,
  getMyApplications,
  getApplicationStats,
  analyzeCv,
  getAiHistory,
};
