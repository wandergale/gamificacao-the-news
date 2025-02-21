import styles from "./Modal.module.css";
import close from "../assets/images/close.svg";

import { useState } from "react";
import { VerifyLogin } from "../pages/Dashboard/User/VerifyLogin";

const Modal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `https://the-news-2a20.onrender.com/send-login-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        }
      );
      console.log("enviado");
      const data = await res.json();
      setMessage(data.message);
      // setEmail("");
      handleLogin();
    } catch (error) {
      console.error("Error on send email: ", error);
    }
  };

  const handleLogin = async () => {
    const res = await fetch(`https://the-news-2a20.onrender.com/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    });

    const data = await res.json();
    console.log(data.token);

    if (data.token) {
      window.location.href = `/verify-login?token=${data.token}`;
    } else {
      alert("Erro ao fazer login");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          <img src={close} alt="btn-close" />
        </button>
        <div className={styles.logo}>
          <img
            src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/ce78b549-5923-439b-be24-3f24c454bc12/ICONE_the_news_com_AMARELO.png"
            alt="logothenews"
          />
          <p>Fazer login em the news</p>
        </div>
        <div className={styles.form}>
          <label>E-mail</label>
          <input
            type="email"
            placeholder="Insira seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <a href="#">Entrar com senha</a>
          <button className={styles.btn} onClick={handleSubmit}>
            Enviar link de login para e-mail
          </button>
          {message && <p className={styles.msg}>{message}!</p>}
        </div>
        <hr />
        <div className={styles.signUp}>
          <p>
            Não tem uma conta? <a href="/">Cadastrar</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
