import type { Chat } from "@/db/chats";

interface NoteOutputProps {
	chat: Chat;
}

const NoteOutput = ({}: NoteOutputProps) => {
	return <div>NoteOutput</div>;
};

export default NoteOutput;
