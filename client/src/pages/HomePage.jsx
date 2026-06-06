import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../api/jobs';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs({ limit: 6 })
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner hero-search">
          <div>
            <p className="hero-eyebrow">Nền tảng tuyển dụng cho sinh viên & doanh nghiệp</p>
            <h1>Tìm việc làm phù hợp — Tuyển dụng hiệu quả</h1>
            <p className="hero-desc">
              Tìm kiếm theo từ khóa, tỉnh thành và ngành nghề. Ứng tuyển nhanh hoặc dùng AI gợi ý việc làm từ CV.
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Tin tuyển dụng mới nhất</h2>
            <Link to="/jobs">Xem tất cả →</Link>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="job-grid">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
