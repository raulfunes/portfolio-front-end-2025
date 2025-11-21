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
				<TechnologiesSection technologies={[
  { area: "Frontend", nombre: "React", img: "https://w7.pngwing.com/pngs/235/872/png-transparent-react-computer-icons-redux-javascript-others-logo-symmetry-nodejs-thumbnail.png" },
  { area: "Frontend", nombre: "Vue", img: "/logos/vue.png" },
  { area: "Backend", nombre: "Node.js", img: "/logos/node.png" },
  { area: "Backend", nombre: "Java", img: "/logos/java.png" },
  { area: "DevOps", nombre: "Docker", img: "/logos/docker.png" },
]}/>
			</div>
		</div>
	);
};

export default RightPanel;
