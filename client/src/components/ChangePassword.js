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
            props.showMessage("Password changed successfully", "success");
            document.querySelector("input[name='new-password']").value = "";
          },
          (error) => {
            props.showMessage("Password change didn't work: " + error, "danger");
          }
        );
    } else {
      newPasswordElem.classList.add("error");
      props.showMessage('Please input something into the "New Password" field.', "danger");
    }
  };

  return (
    <div className="col-md-3">
    
        <div className="form-group">
          <input
            type="password"
            name="new-password"
            className="form-control"
            placeholder="New Password"
          />
          <button
            type="submit"
            className="btn btn-block btn-danger ckValidate "
            onClick={changePassword}
          >
            Change Password
          </button>
        </div>
 
    </div>
  );
};

export default ChangePassword;
