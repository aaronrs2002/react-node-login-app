import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import DeleteUser from "./components/DeleteUser";
import Theme from "./components/Theme";
import ChangePassword from "./components/ChangePassword";
import uuid from "./components/uuid"

function App() {
  let [userEmail, setEmail] = useState(null);
  let [newUser, setUserType] = useState(false);
  let [isValidUser, setValidUser] = useState(false);
  let [token, setToken] = useState("");
  let [message, setMessage] = useState("default");
  let [messageType, setMessageType] = useState("danger");
  let [checkedToken, setTokenCk] = useState(false);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  const showMessage = (theMessage, theType) => {
    setMessageType((messageType) => theType)
    setMessage((message) => theMessage);
    setTimeout(() => {
      setMessage((message) => "default");
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
    } else {
      setValidUser((isValidUser) => false);
      setToken((token) => token);
      setEmail((userEmail) => null);
      showMessage( "That didn't work: " + msg, "danger");
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
          showMessage( "User created succussfully!", "success");
          setUserType((newUser) => false);
          document.querySelector("button.ckValidate").classList.remove("hide");
        },
        (error) => {
          showMessage( "That didn't work: " + error, "danger");
        }
      );
  };
  //END CREATE USER

  //START LOGIN
  const login = (event) => {
    event.preventDefault();
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;

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
          showMessage( "That didn't work: " + error, "danger");
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
        showMessage( "Something happened while logging out: : " + error, "danger");
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
          showMessage( "That didn't work: " + error, "danger");
        }
      );
    } 
  });
  //END REFRESH

  return (
    <React.Fragment>
      {isValidUser === true ? (
        <nav className="navbar-expand-md navbar-dark bg-dark fixed-top">
          <div className="d-flex bd-highlight mb-3">
            <div className="p-2 bd-highlight">
              {" "}
              <img
                src="https://www.mechanized-aesthetics.net/MA-2015/img/MA_Logo.png"
                className="img-fluid logo"
              />
            </div>
            <div className="ml-auto p-2 bd-highlight">
              <Theme userEmail={userEmail} showMessage={showMessage} />
            </div>
          </div>
        </nav>
      ) : null}
      <div className="container">
        {isValidUser === false ? (
          <Login
            login={login}
            createUser={createUser}
            setUserType={setUserType}
            newUser={newUser}
          />
        ) : (
          <div className="row">
            <div className="col-md-12">
              <h1>Logged in as: {userEmail}</h1>
            </div>
            <div className="col-md-3">
              <button className="btn btn-block btn-danger" onClick={logout}>
                Logout
              </button>
            </div>
            <DeleteUser
              userEmail={userEmail}
              logout={logout}
              showMessage={showMessage}
            />
            <ChangePassword showMessage={showMessage} />
          </div>
        )}{" "}
        {message !== "default" ? (
          <div
            className={"alert alert-" + messageType + " animated fadeIn"}
            role="alert"
          >
            {message}
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}

export default App;
