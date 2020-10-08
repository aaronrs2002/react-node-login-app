import React, { useState, useEffect } from "react";
import axios from "axios";

const ChangePassword = (props) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  const changePassword = () => {
    const newPasswordElem = document.querySelector(
      "input[name='new-password']"
    );
    let newPassword = "";
    if (newPasswordElem) {
      newPassword = newPasswordElem.value;
    }

    if (newPassword !== "") {
      axios
        .put(
          "/change-password",
          {
            email: sessionStorage.getItem("email"),
            password: document.querySelector("input[name='new-password']")
              .value,
          },
          config
        )
        .then(
          (res) => {
            //saveTheme(whichTheme);
          },
          (error) => {
            props.setMessage(
              (message) => "That theme change didn't work: " + error
            );
            setTimeout(() => {
              props.setMessage((message) => "default");
            }, 5000);
          }
        );
    } else {
      newPasswordElem.classList.add("error");
      props.setMessage(
        (message) => 'Please input something into the "New Password" field.'
      );
      setTimeout(() => {
        props.setMessage((message) => "default");
      }, 5000);
    }
  };

  return (
    <div className="col-md-3">
      <form onSubmit={changePassword}>
        <div className="form-group">
          <input
            type="text"
            name="new-password"
            className="form-control"
            placeholder="New Password"
          />
          <button
            type="submit"
            className="btn btn-block btn-danger ckValidate "
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
