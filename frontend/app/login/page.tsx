"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Identifiants incorrects.");
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("username", form.username);
        router.push("/dashboard");
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <button className={styles.backBtn} onClick={() => router.push("/")}>
        ← Accueil
      </button>

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>HR-Pulse</span>
        </div>

        <h1 className={styles.title}>Bon retour 👋</h1>
        <p className={styles.subtitle}>Connectez-vous à votre espace recruteur</p>

        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#5B8DEF" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#5B8DEF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nom d'utilisateur</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>👤</span>
            <input
              className={styles.input}
              type="text"
              name="username"
              placeholder="Votre username"
              value={form.username}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Mot de passe</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={`${styles.btnSubmit} ${loading ? styles.loading : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className={styles.spinner} /> : "Se connecter"}
        </button>

        <div className={styles.toggleWrap}>
          <span className={styles.toggleLabel}>Pas encore de compte ?</span>
          <button className={styles.toggleBtn} onClick={() => router.push("/signup")}>
            S'inscrire
          </button>
        </div>

        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          Azure Connected
        </div>
      </div>
    </div>
  );
}