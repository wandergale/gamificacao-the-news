import style from "./Home.module.css";
import Navbar from "../../components/Navbar";
import mailIcon from "../../assets/images/mail.svg";

const Home = () => {
  const handleSubmit = () => {
    console.log("teste");
  };

  return (
    <div>
      <Navbar />
      <div className={style.container}>
        <img
          className={style.logo}
          src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/ce78b549-5923-439b-be24-3f24c454bc12/ICONE_the_news_com_AMARELO.png"
          alt="logothenews"
        />
        <h1 className={style.title}>the news</h1>
        <p>tudo que você precisa saber para começar o dia bem e informado.</p>
        <div>
          <form onSubmit={handleSubmit}>
            <div className={style.mail_container}>
              <img src={mailIcon} alt="mail" />
              <input
                className={style.mail_input}
                type="text"
                name="email"
                placeholder="coloque seu melhor e-mail"
              />
              <input className={style.btn} type="submit" value="inscreva-se" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
