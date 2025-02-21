import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const UserDashboard = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    if (token) {
      fetch(`https://the-news-2a20.onrender.com/auth?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            fetch(
              `https://the-news-2a20.onrender.com/streak?userId=${data.user.id}`
            )
              .then((res) => res.json())
              .then(setStreak);
          }
        })
        .catch(console.error);
    }
  }, [token]);

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>Olá, {user.email}!</h2>
      {streak ? (
        <>
          <p>Streak Atual: {streak.current_streak} dias</p>
          <p>Maior Streak: {streak.longest_streak}</p>
        </>
      ) : (
        <p>Carregando streak...</p>
      )}
    </div>
  );
};

export default UserDashboard;
