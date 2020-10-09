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

  //START VALIDATE USER
  const validateUser = (success, token, email, msg) => {
    if (success === 1) {
      setValidUser((isValidUser) => true);
      setToken((token) => token);
      sessionStorage.setItem("token", token);
      setTokenCk((checkedToken) => true);
      setEmail((userEmail) => email);
      sessionStorage.setItem("email", email);
      console.log("This was a success 'isValidUser is: " + isValidUser);
    } else {
      setValidUser((isValidUser) => false);
      setToken((token) => token);
      setEmail((userEmail) => null);
      setMessage((message) => "That didn't work: " + msg);
      setTimeout(() => {
        setMessage((message) => "default");
      }, 5000);
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
          setMessageType((messageType) => "success");
          setUserType((newUser) => false);
          setMessage((message) => "User created succussfully!");
          document.querySelector("button.ckValidate").classList.remove("hide");
          setTimeout(() => {
            setMessage((message) => "default");
            setMessageType((messageType) => "danger");
          }, 5000);
        },
        (error) => {
          setMessage((message) => "That didn't work: " + error);
          setTimeout(() => {
            setMessage((message) => "default");
          }, 5000);
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
          setMessage((message) => "That didn't work: " + error);
          setTimeout(() => {
            setMessage((message) => "default");
          }, 5000);
        }
      );
  };
  //END LOGIN

  //START LOG OUT
  const logout = () => {
    setValidUser((isValidUser) => false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");

axios
.put(
  "/logout-uuid/",
  {
    email: userEmail,
    uuid: "logged-out: "+ uuid(),
  }
)
.then(
  (res) => {
  console.log("res from logout: "+ res);

  },
  (error) => {
    setMessage(
      (message) => "Something happened while logging out: : " + error
    );
    setTimeout(() => {
      setMessage((message) => "default");
    }, 5000);
  }
);



  };
  //END LOG OUT

  //START REFRESH
  useEffect(() => {
    if (sessionStorage.getItem("token") && checkedToken === false) {
      console.log("there was a token: " + sessionStorage.getItem("token"));
      axios.get("/check-token/" + sessionStorage.getItem("email")).then(
        (res) => {
          if (sessionStorage.getItem("token") === res.data[0].token) {
            console.log(res);
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
          setMessage((message) => "That didn't work: " + error);
          setTimeout(() => {
            setMessage((message) => "default");
          }, 5000);
        }
      );
    } else {
      console.log("NO token BOSS. submitted new token token?: " + checkedToken);
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
              <Theme userEmail={userEmail} setMessage={setMessage} />
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
              setMessageType={setMessageType}
              setMessage={setMessage}
            />
            <ChangePassword setMessage={setMessage} />
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
