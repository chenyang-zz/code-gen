import Database from "@tauri-apps/plugin-sql";

// 导出数据库实例
export const db = await Database.load("sqlite:note.db");

// 获取数据库实例(兼容旧代码)
export async function getDb() {
	return db;
}

// 初始化所有数据库
export async function initAllDatabases() {
	// 引入各数据库初始化函数
	const { initChatsDb } = await import("./chats");
	const { initMarksDb } = await import("./marks");
	const { initTagsDb } = await import("./tags");

	// 执行初始化
	await initChatsDb();
	await initMarksDb();
	await initTagsDb();
}
