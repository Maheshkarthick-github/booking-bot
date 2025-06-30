import React from "react";

export const Card = ({ children, className = "", ...props }: any) => (
  <div className={\`bg-white shadow-md rounded \${className}\`} {...props}>
    {children}
  </div>
);