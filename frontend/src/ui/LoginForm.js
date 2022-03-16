import React, { Component } from "react";

class LoginForm extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
    this.handleCpfChange = this.handleCpfChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.handleOpenRegisterForm = this.handleOpenRegisterForm.bind(this);

    this.state = {
      name: undefined,
      cpf: undefined,
      date: undefined,
      password: undefined,
      signUp: {
        success: undefined,
        message: undefined,
      },
      logged: false,
      users: undefined,
      error: undefined,
    };
  }

  static displayName = "ui-LoginForm";

  componentDidMount() {
    this.verifytoken();
  }

  verifytoken() {
    let url = "http://localhost:3001/auth/verifytoken";
    let token = localStorage.getItem("DD101_TOKEN");

    if (!token) {
      this.setState({
        error: "No token defined. Please Login.",
      });
      return;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          this.setState({
            logged: responseJson.success,
            error: undefined,
          });
          this.loadUsers();
        } else {
          this.setState({
            error: responseJson.error.message,
          });
        }
      })
      .catch((err) => this.setState({ error: err }));
  }

  loadUsers() {
    let url = "http://localhost:3001/users/listusers";
    let token = localStorage.getItem("DD101_TOKEN");
    if (!token) {
      this.setState({
        error: "No token defined. Please Login.",
      });
      return;
    }

    fetch(url, {
      method: "POST",
      body: undefined,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          users: responseJson.data,
          error: undefined,
        });
      })
      .catch((err) => this.setState({ error: err }));
  }

  showAuthorizedArea() {
    if (this.state.logged) {
      return (
        <div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            data-toggle="modal"
            data-target="#authenticatedModal"
            data-whatever="@mdo"
          >
            Usuário logado com sucesso!
          </button>
          <small id="cpfHelp" className="form-text text-muted">
            Somente usuários logados conseguem ver a mensagem!
          </small>
        </div>
      );
    }
  }

  /*
    Register Form area
    */

  handleSubmit(e) {
    e.preventDefault();
    let dataToSend = {
      userData: {
        cpf: this.state.cpf,
        password: this.state.password,
      },
    };
    let url = "http://localhost:3001/auth/authenticate";

    fetch(url, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success) {
          localStorage.setItem("DD101_TOKEN", responseJson.token);
          this.setState({
            name: responseJson.user.name,
            cpf: responseJson.user.cpf,
            date: responseJson.user.date,
            signUp: {
              success: true,
              message: "",
            },
            logged: true,
          });
        } else {
          this.setState({
            signUp: {
              success: false,
              message: responseJson.message,
            },
            logged: false,
          });
          localStorage.removeItem("DD101_TOKEN");
        }
      })
      .catch((err) => console.log("Error ", err));

    this.setState({
      cpf: "",
      password: "",
    });
  }

  /*
    Login Form area
    */

  handleSignUpSubmit(e) {
    e.preventDefault();
    let dataToSend = {
      userData: {
        cpf: this.state.cpf,
        date: this.state.date,
        name: this.state.name,
        password: this.state.password,
      },
    };
    console.log(JSON.stringify(dataToSend));
    let url = "http://localhost:3001/auth/register";

    fetch(url, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          localStorage.setItem("DD101_TOKEN", responseJson.token);
          this.setState({
            signUp: {
              success: true,
              message: "Cadastrado com sucesso!",
            },
            logged: true,
          });
          this.loadUsers();
        } else {
          this.setState({
            signUp: {
              success: false,
              message: responseJson.message,
            },
          });
        }
      })
      .catch((err) => {
        this.setState({
          error: err,
        });
      });

    e.target.reset();
  }

  handleCpfChange(e) {
    this.setState({
      cpf: e.target.value,
    });
  }

  handleDateChange(e) {
    this.setState({
      date: e.target.value,
    });
  }

  handleOpenRegisterForm() {
    this.setState({
      signUp: {
        success: undefined,
        message: undefined,
      },
    });
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  render() {
    return (
      <div className="container">
        {/* Begin Modal Register Form */}
        <div
          className="modal fade"
          id="signupModel"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="signupModelLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="signupModelLabel">
                  Formulario de Registro
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.state.signUp.success !== undefined ? (
                  this.state.signUp.success === true ? (
                    <div className="alert alert-success" role="alert">
                      {this.state.signUp.message}
                    </div>
                  ) : (
                    <div className="alert alert-danger" role="alert">
                      {this.state.signUp.message}
                    </div>
                  )
                ) : (
                  ""
                )}

                <form onSubmit={this.handleSignUpSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-control-label">
                      Nome Completo
                    </label>
                    <input
                      ref="name"
                      className="form-control"
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Digite seu nome"
                      onChange={this.handleNameChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cpf" className="form-control-label">
                      CPF
                    </label>
                    <input
                      ref="cpf"
                      className="form-control"
                      id="cpf"
                      type="text"
                      name="cpf"
                      placeholder="Digite  seu cpf"
                      pattern="(\d{3}\.?\d{3}\.?\d{3}-?\d{2})|(\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2})"
                      title="Digite um CPF valido!"
                      onChange={this.handleCpfChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="date" className="form-control-label">
                      Data Nascimento
                    </label>
                    <input
                      type="date"
                      ref="date"
                      className="form-control"
                      id="date"
                      onChange={this.handleDateChange}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="message-text"
                      className="form-control-label"
                    >
                      Senha
                    </label>
                    <input
                      type="password"
                      ref="password"
                      className="form-control"
                      id="password"
                      placeholder="Digite uma senha"
                      onChange={this.handlePasswordChange}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Fechar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Registrar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Begin Modal Register Form */}

        {/* Begin Modal List Authenticad List  */}

        <div
          className="modal fade"
          id="authenticatedModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="authenticatedModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="authenticatedModalLabel">
                  Apenas Usuarios registrados podem ver isso!
                </h5>
              </div>
              <div className="modal-body">
                <div className="list-group">
                  {
                    /**
                     * List the users when authenticated
                     */
                    this.state.users !== undefined && this.error === undefined
                      ? this.state.users.map((user) => (
                          <a
                            key={user.cpf}
                            href="#"
                            className="list-group-item list-group-item-action flex-column align-items-start"
                          >
                            <div className="d-flex w-100 justify-content-between"></div>
                            <p className="mb-1">cpf: {user.cpf}</p>
                          </a>
                        ))
                      : this.state.error
                  }
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  data-dismiss="modal"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* End Modal List Authenticad List */}

        {/* Begin Login Form */}
        <div className="row" style={{ paddingTop: "50px" }}>
          <div className="col"></div>
          <div className="col">
            <div
              className="card"
              style={{
                width: "20rem",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}
            >
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="exampleInputCPf1">CPF</label>
                    <input
                      type="text"
                      onChange={this.handleCpfChange}
                      className="form-control"
                      id="exampleInputCpf1"
                      aria-describedby="CpfHelp"
                      placeholder="Digite seu cpf"
                      pattern="(\d{3}\.?\d{3}\.?\d{3}-?\d{2})|(\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2})"
                      title="Digite um CPF valido!"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Senha</label>
                    <input
                      type="password"
                      onChange={this.handlePasswordChange}
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Digite sua senha"
                    />
                  </div>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input type="checkbox" className="form-check-input" />
                      <span>Manter conectado</span>
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Login
                  </button>
                  <small id="cpfHelp" className="form-text text-muted">
                    Não possui uma conta?{" "}
                    <a
                      href="#"
                      data-toggle="modal"
                      data-target="#signupModel"
                      data-whatever="@mdo"
                      onClick={this.handleOpenRegisterForm}
                    >
                      Crie sua conta
                    </a>
                  </small>
                  <br />
                  {this.showAuthorizedArea()}
                </form>
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>
        {/* End Login Form */}
      </div>
    );
  }
}
export default LoginForm;
