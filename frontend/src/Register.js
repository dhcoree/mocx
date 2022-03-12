import { useState } from "react";
import "./App.css";

function Register() {
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log(data);
  };
  console.log(formValues);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Digite seu nome</label>
      <input
        id="name"
        type="text"
        name="name"
        placeholder="Nome completo"
        onChange={handleInputChange}
        value={formValues.name || ""}
      />

      <label htmlFor="cpf">Digite seu cpf</label>
      <input
        id="cpf"
        type="text"
        name="cpf"
        placeholder="Informe seu cpf"
        pattern="(\d{3}\.?\d{3}\.?\d{3}-?\d{2})|(\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2})"
        title="Digite um CPF valido!"
        onChange={handleInputChange}
        value={formValues.cpf || ""}
      />

      <label htmlFor="date">Data de Nascimento</label>
      <input
        id="date"
        type="date"
        name="date"
        onChange={handleInputChange}
        value={formValues.date || ""}
      />

      <label htmlFor="password">Digite sua senha</label>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Informe sua senha"
        onChange={handleInputChange}
        value={formValues.password || ""}
      />

      <label htmlFor="confirmPassword">Confirme sua senha</label>
      <input
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        placeholder="Informe novamente"
        onChange={handleInputChange}
        value={formValues.confirmPassword || ""}
      />

      <button typeof="submit">Entrar</button>
    </form>
  );
}

export default Register;
