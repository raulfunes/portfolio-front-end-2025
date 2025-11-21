import React from "react";
import "./AboutMe.css";
import IconsComponent from "../components/IconsComponent";
import { useTranslation } from "react-i18next";

interface AboutMeProps {
	aboutWidth: number;
    aboutWidthStr: string;
	thresholdReached: boolean;
}

const AboutMe: React.FC<AboutMeProps> = ({ aboutWidth, aboutWidthStr, thresholdReached }) => {
	const { t } = useTranslation();
    
	return (
		<div style={{ width: aboutWidthStr }} className={thresholdReached? "about-me-container" : "about-me-container threshold"}>
			<div className={thresholdReached? "about-content" : "about-content threshold"}>
				<div style={{ width: aboutWidth * 2.5 }} className="photo-wrapper">
					<div className="about-photo">
						<img src="./src/assets/myself.JPG" alt="" />
					</div>
				</div>
				<h1>{t("about-me.title")}</h1>
				<h2>{t("about-me.sub-title")}</h2>
				<p>{t("about-me.paragraph")}</p>
				<IconsComponent className={thresholdReached? "icons-container" : "icons-container threshold"} showName={thresholdReached}></IconsComponent>	
			</div>
		</div>
	);
};

export default AboutMe;
