import React, { Ref } from "react";
import "./RightPanel.css";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { TechnologiesSection } from "./Technologies";
import { Footer } from "./Footer";

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
			<div>
				<Experience />
				<Projects />
				<TechnologiesSection />
				<Footer />
			</div>
		</div>
	);
};

export default RightPanel;
