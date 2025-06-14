import React from "react";
interface ChatPreviewProps {
	text: string;
}

const ChatPreview = ({ text }: ChatPreviewProps) => {
	return <div>{text}</div>;
};

export default ChatPreview;
