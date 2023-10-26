import React from "react";

export const Header = () => {
  const headerStyle = {
    width: "100%",
    padding: "2%",
    // backgroundColor: "black",
    color: "black",
    textAlign: "center",
  };

  return (
    <div style={headerStyle}>
      <h1>Create Your Own Token</h1>
    </div>
  );
};
