import Database from "@tauri-apps/plugin-sql";

export const getDb = async () => {
	return await Database.load("sqlite:note.db");
};
