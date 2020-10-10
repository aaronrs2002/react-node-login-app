import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import DeleteUser from "./components/DeleteUser";
import Theme from "./components/Theme";
import ChangePassword from "./components/ChangePassword";
import uuid from "./components/uuid";
import SaveTheme from "./components/SaveTheme"
import MainContent from "./components/MainContent";
import Nav from "./components/Nav"

function App() {
  let [userEmail, setEmail] = useState(null);
  let [newUser, setUserType] = useState(false);
  let [isValidUser, setValidUser] = useState(false);
  let [token, setToken] = useState("");
  let [alert, setAlert] = useState("default");
  let [alertType, setAlertType] = useState("danger");
  let [checkedToken, setTokenCk] = useState(false);
  let [infoMessage, toggleInfo] = useState("");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  const showAlert = (theMessage, theType) => {
    setAlertType((alertType) => theType)
    setAlert((alert) => theMessage);
    setTimeout(() => {
      setAlert((alert) => "default");
    }, 5000);
  }

  //START VALIDATE USER
  const validateUser = (success, token, email, msg) => {
    if (success === 1) {
      setValidUser((isValidUser) => true);
      setToken((token) => token);
      sessionStorage.setItem("token", token);
      setTokenCk((checkedToken) => true);
      setEmail((userEmail) => email);
      sessionStorage.setItem("email", email);
        axios.get("/theme/" + email).then(
          (res) => {
            if (res.data[0].theme) {
              SaveTheme(res.data[0].theme);
            } else {
              SaveTheme("css/bootstrap.min.css");
            }
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      setValidUser((isValidUser) => false);
      setToken((token) => token);
      setEmail((userEmail) => null);
      showAlert( "That didn't work: " + msg, "danger");
    }
  };
  ///END VALIDATE USER

  //START CREATE USER
  const createUser = (event) => {
    event.preventDefault();
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password1']").value;

    axios
      .post(
        "/newUser",
        { theme: "css/bootstrap.min.css", email: email, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(
        (res) => {
          showAlert( "User created succussfully!", "success");
          setUserType((newUser) => false);
          document.querySelector("button.ckValidate").classList.remove("hide");
        },
        (error) => {
          showAlert( "That didn't work: " + error, "danger");
        }
      );
  };
  //END CREATE USER

  //START LOGIN
  const login = (event) => {
    event.preventDefault();
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;

    if(!email || !password){
      showAlert( 'Not one character?', "danger");
      return false;
    }

    axios
      .post(
        "/login",
        { email: email, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(
        (res) => {
          validateUser(res.data.success, res.data.token, email, res.data.data);
        },
        (error) => {
          showAlert( "That didn't work: " + error, "danger");
        }
      );
  };
  //END LOGIN

  //START LOG OUT
  const logout = () => {
    setValidUser((isValidUser) => false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");

    axios.put(
      "/logout-uuid/",
      {
        email: userEmail,
        uuid: "logged-out: "+ uuid(),
      }
    ).then(
      (res) => {
      console.log("res from logout: "+ res);
      },
      (error) => {
        showAlert( "Something happened while logging out: : " + error, "danger");
      }
    );
  };
  //END LOG OUT

  //START REFRESH
  useEffect(() => {
    if (sessionStorage.getItem("token") && checkedToken === false) {
      axios.get("/check-token/" + sessionStorage.getItem("email"),
      config).then(
        (res) => {
          if (sessionStorage.getItem("token") === res.data[0].token) {
            validateUser(
              1,
              res.data[0].token,
              sessionStorage.getItem("email"),
              "token success"
            );
          } else {
            console.log(
              "The tokens did not match - sessionStorage.getItem('token') " +
                sessionStorage.getItem("token") +
                " res.data[0].token: " +
                res.data[0].token
            );
          }
        },
        (error) => {
          showAlert( "That didn't work: " + error, "danger");
        }
      );
    } 
  });
  //END REFRESH

  return (
    <React.Fragment>
      {isValidUser === true ? (
<Nav />
      ) : 
      <Login
            login={login}
            createUser={createUser}
            setUserType={setUserType}
            newUser={newUser}
          />
      }
      <main>
      <div className={isValidUser !== false ? "container py-5": "container"} >

      {isValidUser === true ? (
        <MainContent />
        ):null
      }
        {alert !== "default" ? (
          <div
            className={"alert alert-" + alertType + " animated fadeIn"}
            role="alert"
          >
            {alert}
          </div>
        ) : null}
      </div>
      </main>
  {isValidUser === true ? (<footer className="footer mt-auto py-3 px-3 bg-dark text-muted">
          <div className="row">
            <div className="col-md-3">
{infoMessage === "account-settings" ? 
<a href="#settingsPanel"  className="btn btn-secondary" onClick={() => toggleInfo((infoMessage) => "")}>{userEmail} <i className="fas fa-cog"></i></a>:
<a href="#settingsPanel" className="btn btn-secondary" onClick={() => toggleInfo((infoMessage) => "account-settings")}>{userEmail} <i className="fas fa-cog"></i></a>
}
{infoMessage === "account-settings" ? 
              <div id="settingsPanel" className="py-2">
              <label>Settings:</label>
              <ul className="noStyle">
                <li> <Theme userEmail={userEmail} showAlert={showAlert} /></li>
                <li><ChangePassword showAlert={showAlert} /></li>
                <li>
                  <DeleteUser
                            userEmail={userEmail}
                            logout={logout}
                            showAlert={showAlert}
                            infoMessage={infoMessage}
                          />
                  </li>
              </ul>
              </div>
              :null}
            </div>
            <div className="col-md-7"></div>
            <div className="col-md-2">
              <button className="btn btn-block btn-danger" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
          </footer>
        ):null}{" "}
    </React.Fragment>
  );
}

export default App;
