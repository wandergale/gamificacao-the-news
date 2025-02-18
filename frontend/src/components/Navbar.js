import style from "./Navbar.module.css";
import menu from "../assets/images/menu.svg";

const Navbar = () => {
  return (
    <nav>
      <ul className={style.desktop}>
        <div className={style.start}>
          <li className={style.logo}>
            <a href="/">
              <img
                className={style.logo_img}
                src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/ce78b549-5923-439b-be24-3f24c454bc12/ICONE_the_news_com_AMARELO.png"
                alt="thenews logo"
              />
              the news
            </a>
          </li>
          <li className={style.anuncie}>
            <a href="#">anuncie no the news</a>
          </li>
        </div>

        <div className={style.end}>
          <li className={style.login}>
            <button>Fazer login</button>
          </li>
          <li className={style.sub}>
            <button>Subscribe</button>
          </li>
          <li className={style.hamb_menu}>
            <img src={menu} alt="menu" />
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
