import React, { useState, useEffect } from "react";
import axios from "axios";

const DeleteUser = (props) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  let [alertMessage, toggleAlert] = useState("");

  const deleteUser = () => {
    axios.delete("/delete-user/" + props.userEmail, config).then(
      (res) => {
        if (res.data.email === sessionStorage.getItem("email")) {
          props.setMessageType((messageType) => "success");
          props.setMessage(
            (message) =>
              JSON.stringify(res.data.email) + " was deleted succesfully!"
          );
          setTimeout(() => {
            props.setMessage((message) => "default");
          }, 5000);

          props.logout();
        }
      },
      (error) => {
        console.log(error);
        props.setMessage((message) => "That did not work: " + error);
        setTimeout(() => {
          props.setMessage((message) => "default");
        }, 5000);
      }
    );
  };

  return (
    <div className="col-md-3">
      <div>
        <button
          className="btn btn-danger btn-block"
          onClick={() => toggleAlert((alertMessage) => "Delete User")}
        >
          Delete User
        </button>
        {alertMessage === "Delete User" ? (
          <div className="alert alert-danger" role="alert">
            Are you sure you want to delete {props.userEmail}?
            <button className="btn btn-block btn-danger" onClick={deleteUser}>
              Yes
            </button>
            <button
              className="btn btn-block btn-secondary"
              onClick={() => toggleAlert((alertMessage) => "")}
            >
              No
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DeleteUser;
