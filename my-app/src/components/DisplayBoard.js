import React from "react";

export const DisplayBoard = ({ createNft }) => {
  return (
    <div className="display-board">
      <button type="button" onClick={(e) => createNft()} className="btn">
        Create Token
      </button>
    </div>
  );
};
