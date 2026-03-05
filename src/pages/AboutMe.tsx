import React, { useState, useCallback } from "react";
import "./AboutMe.css";
import IconsComponent from "../components/IconsComponent";
import { useTranslation } from "react-i18next";
import TypewriterText from "../components/TypewriterText";
import TerminalFrame from "../components/TerminalFrame";
import TechBadges from "../components/TechBadges";
import RotatingRole from "../components/RotatingRole";

interface AboutMeProps {
	aboutWidth: number;
	aboutWidthStr: string;
	thresholdReached: boolean;
}

const AboutMe: React.FC<AboutMeProps> = ({ aboutWidth, aboutWidthStr, thresholdReached }) => {
	const { t } = useTranslation();
	const [titleDone, setTitleDone] = useState(false);
	const [roleDone, setRoleDone] = useState(false);

	const handleTitleComplete = useCallback(() => setTitleDone(true), []);
	const handleFirstRoleComplete = useCallback(() => setRoleDone(true), []);

	const roles = t("about-me.roles", { returnObjects: true }) as string[];
	const isCompact = !thresholdReached;

	return (
		<div style={{ width: aboutWidthStr }} className={thresholdReached ? "about-me-container" : "about-me-container threshold"}>
			<div className={thresholdReached ? "about-content" : "about-content threshold"}>
				<div style={{ width: aboutWidth * 2.5 }} className="photo-wrapper">
					<div className="photo-glow" />
					<div className="about-photo">
						<img src="./src/assets/myself.JPG" alt="Raul Funes" />
					</div>
				</div>

				<TerminalFrame className={isCompact ? "terminal-area terminal-compact" : "terminal-area"}>
					<TypewriterText
						text={t("about-me.title")}
						as="h1"
						speed={50}
						delay={300}
						onComplete={handleTitleComplete}
					/>
					<RotatingRole
						roles={roles}
						as="h2"
						speed={45}
						pauseDuration={2200}
						initialDelay={titleDone ? 200 : 99999}
						onFirstComplete={handleFirstRoleComplete}
					/>
					<p className={roleDone ? "hero-fade-in visible" : "hero-fade-in"}>{t("about-me.paragraph")}</p>
					<TechBadges
						className={roleDone ? "hero-fade-in visible" : "hero-fade-in"}
						compact={isCompact}
					/>
					<div className={roleDone ? "terminal-contact-line hero-fade-in visible delay-1" : "terminal-contact-line hero-fade-in"}>
						<span className="terminal-prompt">$</span>
						<span className="terminal-cmd">contact</span>
						<span className="terminal-flag">--via</span>
						<IconsComponent
							className="icons-container-terminal"
							showName={thresholdReached}
						/>
					</div>
				</TerminalFrame>
			</div>
		</div>
	);
};

export default AboutMe;
