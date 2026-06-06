import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES, INDUSTRIES } from '../constants/filters';

export default function SearchBar({ compact = false, initial = {} }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(initial.search || '');
  const [location, setLocation] = useState(initial.location || '');
  const [industry, setIndustry] = useState(initial.industry || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    if (industry) params.set('industry', industry);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <form className={`search-bar ${compact ? 'search-bar-compact' : ''}`} onSubmit={handleSubmit}>
      <input
        placeholder="Từ khóa công việc..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">Tỉnh/Thành phố</option>
        {CITIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
        <option value="">Ngành nghề</option>
        {INDUSTRIES.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">Tìm kiếm</button>
    </form>
  );
}
