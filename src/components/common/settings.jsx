import { Button } from "@mui/material";
import React, { useState } from "react";
const Settings = () => {
  const [themeColor, setThemeColor] = useState("black");

  const makeDark = () => {
    setThemeColor("dark");
    document.getElementById("body").className = "dark";
  };
  const makeRed = () => {
    setThemeColor("red");
    document.getElementById("body").className = "red";
  };
  const makeYellow = () => {
    setThemeColor("yellow");
    document.getElementById("body").className = "yellow";
  };
  const makeBlue = () => {
    setThemeColor("blue");
    document.getElementById("body").className = "blue";
  };
  const makeDefalut = () => {
    setThemeColor("");
    document.getElementById("body").className = "";
  };
  

  return (
    <React.Fragment>
      {themeColor}
      
      <Button variant="contained" color="success" onClick={makeDefalut}>
        make Defalut
      </Button>
      <Button variant="contained" color="success" onClick={makeRed}>
        makeRed
      </Button>
      <Button variant="contained" color="success" onClick={makeYellow}>
        makeYellow
      </Button>
      <Button variant="contained" color="success" onClick={makeBlue}>
        makeBlue
      </Button>
      <Button variant="contained" color="success" onClick={makeDark}>
        makeDark
      </Button>
    </React.Fragment>
  );
};

export default Settings;
