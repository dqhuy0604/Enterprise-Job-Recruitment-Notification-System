import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobs } from '../api/jobs';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const industry = searchParams.get('industry') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    setLoading(true);
    setError('');
    getJobs({ search, location, industry, page, limit: 9 })
      .then((res) => {
        setJobs(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => setError(err.response?.data?.message || 'Không thể tải danh sách'))
      .finally(() => setLoading(false));
  }, [search, location, industry, page]);

  return (
    <div className="container section">
      <h1 className="page-title">Kết quả tìm kiếm việc làm</h1>
      <SearchBar initial={{ search, location, industry }} compact />

      <Alert message={error} />

      {loading ? (
        <Loading />
      ) : jobs.length === 0 ? (
        <p className="empty-state">Không tìm thấy việc làm phù hợp.</p>
      ) : (
        <>
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
          <Pagination
            pagination={pagination}
            onPageChange={(p) => {
              const params = Object.fromEntries(searchParams);
              params.page = String(p);
              setSearchParams(params);
            }}
          />
        </>
      )}
    </div>
  );
}
