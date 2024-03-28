import React from "react";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
export default function ActionButton({
  isLoading = false,
  className = "",
  text = "",
  onclick,
  icon,
  iClassName = "",
  iSize = 22,
  type = "",
  disabled = false,
  children,
}) {
  return (
    <Button
      className={`${className}  ${isLoading ? " disabled" : " "}`}
      onClick={onclick}
      type={type}
      disabled={isLoading || disabled}
    >
      {icon &&
        React.createElement(icon, { className: iClassName, size: iSize })}
      {children}
      {isLoading && <Loader2 size={20} className="animate-spin mx-2" />}
    </Button>
  );
}
