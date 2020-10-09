import React, { useState, useEffect } from "react";
import themesList from "./ThemesList";
import axios from "axios";

const Theme = (props) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  function saveTheme(whichTheme) {
    localStorage.setItem("theme", whichTheme);
    document
      .querySelector("link[data-bootswatch='true']")
      .setAttribute("href", whichTheme);
  }

  function changeTheme(whichTheme) {
    if (whichTheme === "themeSelect") {
      whichTheme = document.querySelector("#theme").value;
    }

    axios
      .put(
        "/edit-theme",
        {
          email: sessionStorage.getItem("email"),
          theme: whichTheme,
        },
        config
      )
      .then(
        (res) => {
          saveTheme(whichTheme);
          props.showMessage( "Theme changed!", "success");
        },
        (error) => {
          props.showMessage( "That theme change didn't work: " + error, "danger");
        }
      );
  }

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      saveTheme(localStorage.getItem("theme"));
    }
    console.log(
      "within useEffect in Themes.js props.userEmail: " + props.userEmail
    );
    if (localStorage.getItem("email")) {
      axios.get("/theme/" + props.userEmail).then(
        (res) => {
          if (res.data[0].theme) {
            saveTheme(res.data[0].theme);
          } else {
            saveTheme("css/bootstrap.min.css");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  });

  return (
    <div className="themeMenuContainer">
      <select
        className="form-control"
        id="theme"
        onChange={changeTheme.bind(this, "themeSelect")}
      >
        <option value="css/bootstrap.min.css">Select Theme</option>
        {themesList
          ? themesList.map((theme, i) => {
              return (
                <option value={themesList[i]} key={i}>
                  {"Theme: " +
                    themesList[i].substring(25, themesList[i].lastIndexOf("/"))}
                </option>
              );
            })
          : null}
      </select>
    </div>
  );
};

export default Theme;
