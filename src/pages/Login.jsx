import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/databaseService";
import "./../styles/login.css";
import logo from "../assets/logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setIsLoading(true);

    // Validar campos vacíos
    if (!username.trim() || !password.trim()) {
      setError("Por favor, complete todos los campos");
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginUser(username.trim(), password);

      if (result.success) {
        // Login exitoso - guardar datos de usuario en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        sessionStorage.setItem('userPermissions', JSON.stringify(result.user.permisos));
        sessionStorage.setItem('userRole', result.user.rol);
        
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Error de conexión. Intente nuevamente.");
      console.error("Error de login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Logo independiente arriba */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="login-logo" />
      </div>

      {/* Contenedor del login */}
      <div className="login-container">
        <div className="login-card">
          <h2>LOGIN</h2>

          <p className="user-text">Usuario</p>
          <input
            type="text"
            placeholder="Ingrese su Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength="10"
            disabled={isLoading}
          />

          <p className="password-text1">Contraseña</p>
          <input
            type="password"
            placeholder="Ingrese su Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            className="btn-login" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </div>
      <footer className="footer">
        Copyright © MiClaroHogar_a2b 2025 | v1.0.0 | prod
      </footer>
    </div>
  );
}

export default Login;