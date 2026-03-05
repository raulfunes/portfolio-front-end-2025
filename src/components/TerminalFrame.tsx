import React from "react";
import "./TerminalFrame.css";

interface TerminalFrameProps {
  children: React.ReactNode;
  className?: string;
}

const TerminalFrame: React.FC<TerminalFrameProps> = ({ children, className = "" }) => {
  return (
    <div className={`terminal-frame ${className}`}>
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="terminal-dot dot-red" />
          <span className="terminal-dot dot-yellow" />
          <span className="terminal-dot dot-green" />
        </div>
        <span className="terminal-title">raul@portfolio:~</span>
      </div>
      <div className="terminal-body">
        {children}
      </div>
    </div>
  );
};

export default TerminalFrame;
