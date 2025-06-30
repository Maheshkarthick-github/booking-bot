import React from "react";

export const Button = ({ children, ...props }: any) => (
  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" {...props}>
    {children}
  </button>
);