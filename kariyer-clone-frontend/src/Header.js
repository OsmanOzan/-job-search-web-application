import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ background: '#eee', padding: 10, marginBottom: 20 }}>
      <Link to="/">Ana Sayfa</Link> |
      <Link to="/jobs">İş Ara</Link> |
      {token ? (
        <>
          <Link to="/profile">Profilim</Link> |
          <button onClick={handleLogout}>Çıkış</button>
        </>
      ) : (
        <>
          <Link to="/login">Giriş Yap</Link> |
          <Link to="/register">Kayıt Ol</Link>
        </>
      )}
    </div>
  );
}

export default Header; 