import React, { Ref } from "react";
import "./RightPanel.css";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { TechnologiesSection } from "./Technologies";

interface RightPanelProps {
	rightPanelRef: Ref<HTMLDivElement>;
	aboutWidthStr: string;
	rightPanelWidthStr: string;
	rightPanelOpacity: number;
	overflowY: any;
	thresholdReached: boolean;
}

const RightPanel: React.FC<RightPanelProps> = ({
	rightPanelRef,
	aboutWidthStr,
	rightPanelWidthStr,
	rightPanelOpacity,
	overflowY,
	thresholdReached,
}) => {
	return (
		<div
			ref={rightPanelRef}
			className="right-panel-container"
			style={{
				left: aboutWidthStr,
				width: rightPanelWidthStr,
				opacity: rightPanelOpacity,
				overflowY: overflowY,
			}}
		>
			<div style={{ minHeight: "150vh" }}>
				<Experience />
				<Projects />
				<TechnologiesSection />
			</div>
		</div>
	);
};

export default RightPanel;
