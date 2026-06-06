import { useEffect, useState } from 'react';
import { getSavedJobs } from '../../api/students';
import JobCard from '../../components/JobCard';
import Loading from '../../components/Loading';

export default function StudentSaved() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedJobs().then((res) => setJobs(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Vị trí việc làm đã lưu</h2>
      {loading ? <Loading /> : jobs.length === 0 ? (
        <p className="empty-state">Chưa lưu tin nào.</p>
      ) : (
        <div className="job-grid">{jobs.map((job) => <JobCard key={job._id} job={job} />)}</div>
      )}
    </div>
  );
}
