import Database from "@tauri-apps/plugin-sql";

// 声明数据库实例
export let db: Awaited<ReturnType<typeof Database.load>>;

// 初始化数据库实例
export async function initDb() {
	db = await Database.load("sqlite:note.db");
	return db;
}

// 获取数据库实例(兼容旧代码)
export async function getDb() {
	if (!db) {
		await initDb();
	}
	return db;
}

// 初始化所有数据库
export async function initAllDatabases() {
	// 先初始化主数据库
	await initDb();

	// 引入各数据库初始化函数
	await Promise.all([
		import("./chats").then((module) => module.initChatsDb()),
		import("./marks").then((module) => module.initMarksDb()),
		import("./tags").then((module) => module.initTagsDb()),
		import("./vector").then((module) => module.initVectorDb()),
	]);
}
