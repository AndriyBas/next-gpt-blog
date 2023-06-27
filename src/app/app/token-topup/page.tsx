"use client";
import * as React from "react";

const TokenTopupPage: React.FC = () => {
  const onAddTokens = async () => {
    const response = await fetch("/api/addTokens", {
      method: "POST",
    });
    const data = await response.json();
    console.log("data: ", data);
    window.location.href = data.session.url;
  };
  return (
    <div>
      Token topup page
      <button className="btn" onClick={onAddTokens}>
        Add tokens
      </button>
    </div>
  );
};

export default TokenTopupPage;
