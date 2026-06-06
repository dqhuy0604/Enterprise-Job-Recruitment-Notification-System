const SKILL_KEYWORDS = [
  'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'nodejs', 'express',
  'python', 'java', 'spring', 'django', 'flask', 'mongodb', 'mysql', 'postgresql',
  'sql', 'redis', 'docker', 'kubernetes', 'aws', 'azure', 'git', 'html', 'css',
  'tailwind', 'figma', 'photoshop', 'marketing', 'seo', 'content', 'sales', 'excel',
  'accounting', 'kế toán', 'nhân sự', 'hr', 'thiết kế', 'ui', 'ux', 'android', 'ios',
  'flutter', 'kotlin', 'swift', 'c++', 'c#', '.net', 'php', 'laravel', 'graphql',
  'rest', 'api', 'agile', 'scrum', 'communication', 'leadership', 'english',
];

const tokenize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[\s,.;:/()\-+]+/)
    .filter((w) => w.length > 2);

const extractSkills = (cvText) => {
  const lower = cvText.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) => lower.includes(skill));
};

const scoreJobMatch = (cvText, job) => {
  const cvSkills = extractSkills(cvText);
  const jobText = `${job.title} ${job.requirements} ${job.description} ${job.industry || ''}`.toLowerCase();
  const jobTokens = new Set(tokenize(jobText));

  let skillScore = 0;
  cvSkills.forEach((skill) => {
    if (jobText.includes(skill)) skillScore += 3;
  });

  const cvTokens = tokenize(cvText);
  let overlap = 0;
  cvTokens.forEach((token) => {
    if (jobTokens.has(token)) overlap += 1;
  });

  const titleTokens = tokenize(job.title);
  let titleBonus = 0;
  titleTokens.forEach((t) => {
    if (cvText.toLowerCase().includes(t)) titleBonus += 2;
  });

  return skillScore + overlap + titleBonus;
};

const rankJobsByCv = (cvText, jobs, limit = 10) => {
  return jobs
    .map((job) => ({
      job,
      score: scoreJobMatch(cvText, job),
      matchedSkills: extractSkills(cvText).filter((s) =>
        `${job.title} ${job.requirements}`.toLowerCase().includes(s)
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

module.exports = { rankJobsByCv, extractSkills, scoreJobMatch };
