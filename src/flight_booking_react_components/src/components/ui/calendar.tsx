import React from "react";

export const Calendar = ({ onSelect }: any) => (
  <input type="date" onChange={(e) => onSelect(new Date(e.target.value))} />
);