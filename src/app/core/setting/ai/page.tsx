"use client";
import React from "react";
import SettingAI from "./SettingAI";
import { BotMessageSquare } from "lucide-react";

const AIPage = () => {
	return <SettingAI id="ai" icon={<BotMessageSquare />} />;
};

export default AIPage;
