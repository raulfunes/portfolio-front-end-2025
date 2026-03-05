import React, { useState, useCallback } from "react";
import "./AboutMe.css";
import IconsComponent from "../components/IconsComponent";
import { useTranslation } from "react-i18next";
import RetroParticles from "../components/RetroParticles";
import TypewriterText from "../components/TypewriterText";

interface AboutMeProps {
	aboutWidth: number;
	aboutWidthStr: string;
	thresholdReached: boolean;
	isDark: boolean;
}

const AboutMe: React.FC<AboutMeProps> = ({ aboutWidth, aboutWidthStr, thresholdReached, isDark }) => {
	const { t } = useTranslation();
	const [titleDone, setTitleDone] = useState(false);
	const [subtitleDone, setSubtitleDone] = useState(false);

	const handleTitleComplete = useCallback(() => setTitleDone(true), []);
	const handleSubtitleComplete = useCallback(() => setSubtitleDone(true), []);

	return (
		<div style={{ width: aboutWidthStr }} className={thresholdReached ? "about-me-container" : "about-me-container threshold"}>
			<RetroParticles isDark={isDark} />
			<div className={thresholdReached ? "about-content" : "about-content threshold"}>
				<div style={{ width: aboutWidth * 2.5 }} className="photo-wrapper">
					<div className="about-photo">
						<img src="./src/assets/myself.JPG" alt="" />
					</div>
				</div>
				<TypewriterText
					text={t("about-me.title")}
					as="h1"
					speed={50}
					delay={300}
					onComplete={handleTitleComplete}
				/>
				<TypewriterText
					text={t("about-me.sub-title")}
					as="h2"
					speed={40}
					delay={titleDone ? 200 : 99999}
					onComplete={handleSubtitleComplete}
				/>
				<p className={subtitleDone ? "hero-fade-in visible" : "hero-fade-in"}>{t("about-me.paragraph")}</p>
				<IconsComponent className={`${thresholdReached ? "icons-container" : "icons-container threshold"} ${subtitleDone ? "hero-fade-in visible delay-1" : "hero-fade-in"}`} showName={thresholdReached} />
			</div>
		</div>
	);
};

export default AboutMe;
