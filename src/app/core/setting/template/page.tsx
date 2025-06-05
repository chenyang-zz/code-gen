"use client";

import { LayoutTemplate } from "lucide-react";
import React from "react";
import SettingTemplate from "./SettingTemplate";

const TemplatePage = () => {
	return <SettingTemplate id="template" icon={<LayoutTemplate />} />;
};

export default TemplatePage;
