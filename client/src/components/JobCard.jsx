import { Link } from 'react-router-dom';

const TYPE_LABELS = {
  'full-time': 'Toàn thời gian',
  'part-time': 'Bán thời gian',
  remote: 'Remote',
  hybrid: 'Hybrid',
};

export default function JobCard({ job }) {
  const company = job.companyId;

  return (
    <article className="job-card">
      <div className="job-card-top">
        {company?.logo ? (
          <img src={company.logo} alt="" className="company-logo-sm" />
        ) : (
          <div className="company-logo-sm placeholder">{company?.name?.[0] || 'C'}</div>
        )}
        <div>
          <h3>
            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
          </h3>
          <p className="company-name">{company?.name || 'Doanh nghiệp'}</p>
        </div>
        {job.status === 'closed' && <span className="badge badge-closed">Đã đóng</span>}
      </div>
      <div className="job-meta">
        <span>{job.location}</span>
        <span>{job.industry}</span>
        <span>{TYPE_LABELS[job.type] || job.type}</span>
        <span>{job.salary}</span>
      </div>
      <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
        Xem chi tiết
      </Link>
    </article>
  );
}
