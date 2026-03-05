import { ChevronRight } from "lucide-react";

interface ScrollIndicatorProps {
  showArrow?: boolean;
}

export function ScrollIndicator({ showArrow = true }: ScrollIndicatorProps) {
  return (
    <div className="scroll-indicator">
      <span className="scroll-line" />
      <div className="scroll-label">
        <span>Desliza para</span>
        <span>explorar</span>
      </div>
      <span className="scroll-line" />
      {showArrow && (
        <span className="scroll-icon">
          <ChevronRight size={20} />
        </span>
      )}
    </div>
  );
}
