"use client";
import { ScanText } from "lucide-react";
import React from "react";
import SettingOcr from "./SettingOcr";

const OcrPage = () => {
	return <SettingOcr id="ocr" icon={<ScanText />} />;
};

export default OcrPage;
