import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto: tempc2g@gmail.com">
        <Button>Contact tempc2g@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
