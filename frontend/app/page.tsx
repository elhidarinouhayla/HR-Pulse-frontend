"use client";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>HR-Pulse</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className={styles.navActions}>
          <button className={styles.btnOutline} onClick={() => router.push("/login")}>
            Se connecter
          </button>
          <button className={styles.btnCoral} onClick={() => router.push("/signup")}>
            Commencer
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.badge}>✦ Powered by Azure AI</div>
          <h1 className={styles.heroTitle}>
            Recrutez plus<br />
            <span className={styles.heroAccent}>intelligemment</span>
          </h1>
          <p className={styles.heroSubtitle}>
            HR-Pulse analyse vos offres d'emploi, extrait les compétences clés
            et prédit les fourchettes salariales grâce à l'IA.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.btnCoralLarge} onClick={() => router.push("/signup")}>
              Démarrer gratuitement →
            </button>
            <button className={styles.btnGhost} onClick={() => router.push("/login")}>
              Voir la démo
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>1,247</span>
              <span className={styles.statLabel}>Jobs analysés</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statNum}>348</span>
              <span className={styles.statLabel}>Compétences</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statNum}>94%</span>
              <span className={styles.statLabel}>Précision NER</span>
            </div>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.floatCard1}>
            <div className={styles.cardIcon}>💼</div>
            <div>
              <p className={styles.cardTitle}>Data Engineer</p>
              <p className={styles.cardSub}>Python · Azure · SQL</p>
            </div>
            <span className={styles.salaryBadge}>$112K</span>
          </div>

          <div className={styles.floatCard2}>
            <p className={styles.predictLabel}>Prédiction Salariale</p>
            <p className={styles.predictVal}>$94K — $127K</p>
            <div className={styles.predictBar}>
              <div className={styles.predictFill} />
            </div>
            <p className={styles.predictConf}>87% de confiance</p>
          </div>

          <div className={styles.floatCard3}>
            <div className={styles.skillsTitle}>Top Skills</div>
            {["Python", "Azure", "SQL", "Docker"].map((s, i) => (
              <span key={i} className={styles.skillPill}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <h2 className={styles.sectionTitle}>Tout ce dont vous avez besoin</h2>
        <div className={styles.featureGrid}>
          {[
            { icon: "🤖", title: "Extraction NER", desc: "Azure AI Language détecte automatiquement les compétences dans vos offres." },
            { icon: "💰", title: "Prédiction Salariale", desc: "Modèle ML entraîné pour estimer les fourchettes de salaires du marché." },
            { icon: "🔍", title: "Recherche par Skills", desc: "Filtrez et trouvez les offres selon les compétences en un clic." },
            { icon: "☁️", title: "Cloud Azure", desc: "Infrastructure sécurisée avec Azure SQL et stockage centralisé." },
          ].map((f, i) => (
            <div key={i} className={styles.featureCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>HR-Pulse</span>
        </div>
        <p className={styles.footerText}>© 2026 HR-Pulse · Powered by Azure AI · Built with ❤️</p>
      </footer>
    </div>
  );
}