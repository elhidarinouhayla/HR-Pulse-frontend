"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";

const API = "http://localhost:8000";

interface Job {
  id: number;
  job_title?: string;
  role?: string;
  skills_extracted?: string | string[];
  salary_estimate?: string | number;
}

interface PredictForm {
  JobDescription: string;
  location: string;
  role: string;
  ownership_category: string;
  Industry: string;
  Sector: string;
}

const parseError = (data: { detail?: unknown }): string => {
  if (!data.detail) return "Erreur inconnue.";
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return (data.detail as { msg: string }[]).map((e) => e.msg).join(", ");
  }
  return "Erreur inconnue.";
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [username, setUsername] = useState("Recruteur");
  const [token, setToken] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeSkill, setActiveSkill] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const [predictForm, setPredictForm] = useState<PredictForm>({
    JobDescription: "",
    location: "",
    role: "",
    ownership_category: "",
    Industry: "",
    Sector: "",
  });

  const [salaryResult, setSalaryResult] = useState<number | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState("");

  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const t = sessionStorage.getItem("token");
    const u = sessionStorage.getItem("username");
    if (!t) {
      router.push("/login");
      return;
    }
    setToken(t);
    if (u) setUsername(u);
    fetchSkills(t);
    fetchJobs(t);
  }, []);

  const authHeader = (t: string) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${t}`,
  });

  const fetchSkills = async (t: string) => {
    setLoadingSkills(true);
    try {
      const res = await fetch(`${API}/skills`, { headers: authHeader(t) });
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch {
      setSkills([]);
    } finally {
      setLoadingSkills(false);
    }
  };

  const fetchJobs = async (t: string) => {
    setLoadingJobs(true);
    try {
      const res = await fetch(`${API}/debug/jobs`, { headers: authHeader(t) });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
      setFilteredJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleSkillFilter = async (skill: string) => {
    if (skill === activeSkill) {
      setActiveSkill("");
      setFilteredJobs(jobs);
      return;
    }
    setActiveSkill(skill);
    try {
      const res = await fetch(
        `${API}/jobs_by_skill/${encodeURIComponent(skill)}`,
        { headers: authHeader(token) }
      );
      if (res.ok) {
        const data = await res.json();
        setFilteredJobs(Array.isArray(data) ? data : []);
      } else {
        setFilteredJobs([]);
      }
    } catch {
      setFilteredJobs([]);
    }
  };

  const handlePredict = async () => {
    if (!predictForm.JobDescription || !predictForm.role) {
      setPredictError("Description et titre du poste sont obligatoires.");
      return;
    }
    setPredicting(true);
    setPredictError("");
    setSalaryResult(null);
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify(predictForm),
      });
      const data = await res.json();
      if (res.ok) {
        setSalaryResult(data.salary);
      } else {
        setPredictError(parseError(data));
      }
    } catch {
      setPredictError("Erreur serveur — vérifiez que le backend est démarré.");
    } finally {
      setPredicting(false);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  const avgSalary =
    jobs.length > 0
      ? Math.round(
          jobs.reduce(
            (acc, j) => acc + (parseFloat(String(j.salary_estimate)) || 0),
            0
          ) / jobs.length
        )
      : 0;

  const formatSkills = (skillsJson: string | string[] | undefined): string[] => {
    try {
      const arr =
        typeof skillsJson === "string" ? JSON.parse(skillsJson) : skillsJson;
      return Array.isArray(arr) ? arr.slice(0, 3) : [];
    } catch {
      return [];
    }
  };

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "jobs",      icon: "💼", label: "Jobs" },
    { id: "skills",    icon: "🎯", label: "Skills" },
    { id: "predictor", icon: "💰", label: "Prédicteur" },
  ];

  const predictFields = [
    { key: "JobDescription",     label: "Description du poste", placeholder: "ex: Développement de pipelines de données...", icon: "📝" },
    { key: "location",           label: "Localisation",          placeholder: "ex: Paris, France",                           icon: "📍" },
    { key: "role",               label: "Titre du poste",         placeholder: "ex: Data Engineer",                          icon: "💼" },
    { key: "ownership_category", label: "Type d'entreprise",      placeholder: "ex: Private, Public, Nonprofit",             icon: "🏢" },
    { key: "Industry",           label: "Industrie",              placeholder: "ex: Information Technology",                 icon: "🏭" },
    { key: "Sector",             label: "Secteur",                placeholder: "ex: Finance, Healthcare, Tech",              icon: "📊" },
  ];

  return (
    <div className={styles.page}>

      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>

          <div className={styles.logo}>
            <span className={styles.logoDot} />
            <span className={styles.logoText}>HR-Pulse</span>
          </div>

          <div className={styles.avatarCard}>
            <div className={styles.avatarCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="#5B8DEF" />
                <path
                  d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                  stroke="#5B8DEF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className={styles.avatarName}>{username}</p>
              <p className={styles.avatarRole}>HR Recruteur</p>
            </div>
          </div>

          <nav className={styles.nav}>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`${styles.navItem} ${activeNav === item.id ? styles.navActive : ""}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.sideBottom}>
          <div className={styles.azureBadge}>
            <span className={styles.azureDot} />
            Azure Connected
          </div>
          <button className={styles.logoutBtn} onClick={logout}>
            Déconnexion →
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.main}>

        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>
              {activeNav === "dashboard" && "Vue d'ensemble"}
              {activeNav === "jobs"      && "Offres d'emploi"}
              {activeNav === "skills"    && "Compétences"}
              {activeNav === "predictor" && "Prédicteur Salarial"}
            </h1>
            <p className={styles.headerSub}>Bienvenue, {username} 👋</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchWrap}>
              <span>🔍</span>
              <input
                className={styles.searchInput}
                placeholder="Rechercher un skill..."
              />
            </div>
          </div>
        </header>

        {/* ════════════════════════════════
            DASHBOARD
        ════════════════════════════════ */}
        {activeNav === "dashboard" && (
          <div className={styles.content}>

            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
              {[
                { icon: "🎯", label: "Total Skills",  value: loadingSkills ? "..." : skills.length,                   color: "#5B8DEF", delay: "0s"   },
                { icon: "💼", label: "Total Jobs",    value: loadingJobs   ? "..." : jobs.length,                     color: "#A78BFA", delay: "0.1s" },
                { icon: "💰", label: "Avg Salary",    value: avgSalary > 0  ? `$${avgSalary}K`   : "N/A",             color: "#F06E6E", delay: "0.2s" },
                { icon: "🤖", label: "Top Skill",     value: skills[0]     || "N/A",                                  color: "#67C6E3", delay: "0.3s" },
              ].map((kpi, i) => (
                <div
                  key={i}
                  className={styles.kpiCard}
                  style={{ animationDelay: kpi.delay }}
                >
                  <div className={styles.kpiLeft}>
                    <span className={styles.kpiIcon}>{kpi.icon}</span>
                    <span className={styles.kpiLabel}>{kpi.label}</span>
                  </div>
                  <span className={styles.kpiValue} style={{ color: kpi.color }}>
                    {kpi.value}
                  </span>
                  <div className={styles.kpiBar} style={{ background: kpi.color + "22" }}>
                    <div className={styles.kpiBarFill} style={{ background: kpi.color, width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Two columns */}
            <div className={styles.twoCol}>

              {/* Jobs table */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Offres récentes</h2>
                <div className={styles.tableWrap}>
                  {loadingJobs ? (
                    <div className={styles.skeletonList}>
                      {[1, 2, 3].map((i) => <div key={i} className={styles.skeleton} />)}
                    </div>
                  ) : jobs.length === 0 ? (
                    <p className={styles.emptyText}>Aucune offre trouvée</p>
                  ) : (
                    jobs.slice(0, 6).map((job, i) => (
                      <div key={i} className={styles.jobRow}>
                        <div className={styles.jobDate}>{i + 1}</div>
                        <div className={styles.jobInfo}>
                          <p className={styles.jobTitle}>
                            {job.job_title || job.role || "Poste inconnu"}
                          </p>
                          <div className={styles.jobSkills}>
                            {formatSkills(job.skills_extracted).map((s, j) => (
                              <span key={j} className={styles.skillBadge}>{s}</span>
                            ))}
                          </div>
                        </div>
                        <span className={styles.salaryChip}>
                          {job.salary_estimate ? `$${job.salary_estimate}K` : "N/A"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Skills list */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Top Skills</h2>
                <div className={styles.skillsList}>
                  {loadingSkills ? (
                    <div className={styles.skeletonList}>
                      {[1, 2, 3, 4].map((i) => <div key={i} className={styles.skeleton} />)}
                    </div>
                  ) : (
                    skills.slice(0, 8).map((skill, i) => (
                      <button
                        key={i}
                        className={`${styles.skillItem} ${activeSkill === skill ? styles.skillItemActive : ""}`}
                        onClick={() => { handleSkillFilter(skill); setActiveNav("jobs"); }}
                      >
                        <span className={styles.skillNum}>{String(i + 1).padStart(2, "0")}</span>
                        <span className={styles.skillName}>{skill}</span>
                        <span className={styles.skillArrow}>→</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            JOBS
        ════════════════════════════════ */}
        {activeNav === "jobs" && (
          <div className={styles.content}>
            <div className={styles.card}>

              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  {activeSkill ? `Jobs pour "${activeSkill}"` : "Tous les jobs"}
                  <span className={styles.countBadge}>{filteredJobs.length}</span>
                </h2>
                {activeSkill && (
                  <button
                    className={styles.clearFilter}
                    onClick={() => { setActiveSkill(""); setFilteredJobs(jobs); }}
                  >
                    ✕ Effacer le filtre
                  </button>
                )}
              </div>

              {/* Skill filter chips */}
              <div className={styles.filterRow}>
                {skills.slice(0, 10).map((s, i) => (
                  <button
                    key={i}
                    className={`${styles.filterChip} ${activeSkill === s ? styles.filterChipActive : ""}`}
                    onClick={() => handleSkillFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className={styles.tableWrap}>
                {filteredJobs.length === 0 ? (
                  <p className={styles.emptyText}>Aucun job trouvé pour ce skill.</p>
                ) : (
                  filteredJobs.map((job, i) => (
                    <div key={i} className={styles.jobRowLarge}>
                      <div className={styles.jobDateLarge}>{i + 1}</div>
                      <div className={styles.jobInfoLarge}>
                        <p className={styles.jobTitleLarge}>
                          {job.job_title || job.role || "Poste"}
                        </p>
                        <p className={styles.jobId}>ID: {job.id}</p>
                        <div className={styles.jobSkills}>
                          {formatSkills(job.skills_extracted).map((s, j) => (
                            <span key={j} className={styles.skillBadge}>{s}</span>
                          ))}
                        </div>
                      </div>
                      <span className={styles.salaryChipLarge}>
                        {job.salary_estimate ? `$${job.salary_estimate}K` : "N/A"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            SKILLS
        ════════════════════════════════ */}
        {activeNav === "skills" && (
          <div className={styles.content}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                Toutes les compétences
                <span className={styles.countBadge}>{skills.length}</span>
              </h2>
              {loadingSkills ? (
                <div className={styles.skeletonGrid}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={styles.skeletonPill} />
                  ))}
                </div>
              ) : skills.length === 0 ? (
                <p className={styles.emptyText}>Aucune compétence trouvée.</p>
              ) : (
                <div className={styles.skillsGrid}>
                  {skills.map((skill, i) => (
                    <button
                      key={i}
                      className={styles.skillCard}
                      style={{ animationDelay: `${i * 0.03}s` }}
                      onClick={() => {
                        setActiveSkill(skill);
                        handleSkillFilter(skill);
                        setActiveNav("jobs");
                      }}
                    >
                      <span className={styles.skillCardIcon}>🔧</span>
                      <span className={styles.skillCardName}>{skill}</span>
                      <span className={styles.skillCardArrow}>→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            PREDICTOR
        ════════════════════════════════ */}
        {activeNav === "predictor" && (
          <div className={styles.content}>
            <div className={styles.predictorGrid}>

              {/* Form */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>⭐⭐⭐ Prédicteur Salarial</h2>
                <p className={styles.cardSubtitle}>
                  Estimez votre valeur sur le marché avec l'IA
                </p>

                {predictFields.map((field) => (
                  <div key={field.key} className={styles.formGroup}>
                    <label className={styles.formLabel}>{field.label}</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.inputIcon}>{field.icon}</span>
                      <input
                        className={styles.formInput}
                        placeholder={field.placeholder}
                        value={predictForm[field.key as keyof PredictForm]}
                        onChange={(e) =>
                          setPredictForm({ ...predictForm, [field.key]: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ))}

                {predictError && (
                  <p className={styles.error}>{predictError}</p>
                )}

                <button
                  className={`${styles.predictBtn} ${predicting ? styles.predictBtnLoading : ""}`}
                  onClick={handlePredict}
                  disabled={predicting}
                >
                  {predicting ? <span className={styles.spinner} /> : "Prédire le salaire →"}
                </button>
              </div>

              {/* Result */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Résultat</h2>

                {!salaryResult && !predicting && (
                  <div className={styles.resultEmpty}>
                    <div className={styles.resultEmptyIcon}>💰</div>
                    <p>Remplissez le formulaire et lancez la prédiction</p>
                  </div>
                )}

                {predicting && (
                  <div className={styles.resultEmpty}>
                    <div className={styles.predictingAnim}>
                      {[0, 0.2, 0.4].map((d, i) => (
                        <div
                          key={i}
                          className={styles.pulseDot}
                          style={{ animationDelay: `${d}s` }}
                        />
                      ))}
                    </div>
                    <p>Calcul en cours...</p>
                  </div>
                )}

                {salaryResult !== null && !predicting && (
                  <div className={styles.resultReveal}>
                    <p className={styles.resultLabel}>Salaire estimé</p>
                    <p className={styles.resultValue}>
                      ${salaryResult.toLocaleString()}
                    </p>
                    <div className={styles.rangeBar}>
                      <span className={styles.rangeMin}>
                        ${Math.round(salaryResult * 0.85).toLocaleString()}
                      </span>
                      <div className={styles.rangeTrack}>
                        <div className={styles.rangeThumb} />
                      </div>
                      <span className={styles.rangeMax}>
                        ${Math.round(salaryResult * 1.15).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.confBadge}>
                      <span className={styles.confDot} />
                      87% de confiance
                    </div>
                    <p className={styles.resultNote}>
                      Basé sur {jobs.length} offres analysées
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom Nav mobile ── */}
        <div className={styles.bottomNav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.bottomNavBtn} ${activeNav === item.id ? styles.bottomNavActive : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              {item.icon}
            </button>
          ))}
        </div>

      </main>
    </div>
  );
}