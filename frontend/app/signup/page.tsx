"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";

interface FormState {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Erreur lors de l'inscription.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.successTitle}>Compte créé !</h2>
          <p className={styles.successSub}>Redirection vers la connexion...</p>
          <div className={styles.successBar} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <button className={styles.backBtn} onClick={() => router.push("/")}>← Accueil</button>

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>HR-Pulse</span>
        </div>

        <h1 className={styles.title}>Créer un compte 🚀</h1>
        <p className={styles.subtitle}>Rejoignez HR-Pulse et recrutez intelligemment</p>

        <div className={styles.stepsWrap}>
          <div className={styles.stepActive}>1</div>
          <div className={styles.stepLine} />
          <div className={styles.stepInactive}>2</div>
          <div className={styles.stepLine} />
          <div className={styles.stepInactive}>✓</div>
        </div>

        {[
          { key: "username", label: "Nom d'utilisateur", placeholder: "ex: recruteur_rh", type: "text", icon: "👤" },
          { key: "email", label: "Adresse email", placeholder: "votre@email.com", type: "email", icon: "📧" },
          { key: "password", label: "Mot de passe", placeholder: "Min. 6 caractères", type: "password", icon: "🔒" },
          { key: "confirm", label: "Confirmer le mot de passe", placeholder: "Répétez le mot de passe", type: "password", icon: "🔑" },
        ].map((field) => (
          <div key={field.key} className={styles.formGroup}>
            <label className={styles.label}>{field.label}</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>{field.icon}</span>
              <input
                className={styles.input}
                type={field.type}
                name={field.key}
                placeholder={field.placeholder}
                value={form[field.key as keyof FormState]}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>
        ))}

        {form.password && (
          <div className={styles.strengthWrap}>
            <div className={styles.strengthBar}>
              <div
                className={styles.strengthFill}
                style={{
                  width: form.password.length >= 10 ? "100%" : form.password.length >= 6 ? "60%" : "30%",
                  background: form.password.length >= 10 ? "#4CAF88" : form.password.length >= 6 ? "#FFB347" : "#F06E6E",
                }}
              />
            </div>
            <span className={styles.strengthLabel}>
              {form.password.length >= 10 ? "Fort" : form.password.length >= 6 ? "Moyen" : "Faible"}
            </span>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={`${styles.btnSubmit} ${loading ? styles.loading : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className={styles.spinner} /> : "Créer mon compte →"}
        </button>

        <div className={styles.toggleWrap}>
          <span className={styles.toggleLabel}>Déjà un compte ?</span>
          <button className={styles.toggleBtn} onClick={() => router.push("/login")}>Se connecter</button>
        </div>

        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          Azure Connected
        </div>
      </div>
    </div>
  );
}