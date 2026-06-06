/** Bộ lọc tin tuyển dụng còn hiệu lực (active + chưa quá hạn nộp) */
const buildActiveJobFilter = (extra = {}) => {
  const now = new Date();
  return {
    ...extra,
    status: 'active',
    $or: [
      { deadline: null },
      { deadline: { $exists: false } },
      { deadline: { $gte: now } },
    ],
  };
};

const isJobExpired = (job) => {
  if (!job?.deadline) return false;
  return new Date(job.deadline) < new Date();
};

module.exports = { buildActiveJobFilter, isJobExpired };
