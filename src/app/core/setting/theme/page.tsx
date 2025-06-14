"use client";

import { Palette } from "lucide-react";
import React from "react";
import SettingTheme from "./SettingTheme";

const ThemePage = () => {
	return <SettingTheme id="theme" icon={<Palette />} />;
};

export default ThemePage;
