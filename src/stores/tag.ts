import { delTag, getTags, insertTag, updateTag, type Tag } from "@/db/tags";
import { Store } from "@tauri-apps/plugin-store";
import { create } from "zustand";

interface TagState {
	currentTagId: number;
	setCurrentTagId: (id: number) => Promise<void>;
	initTags: () => Promise<void>;

	currentTag?: Tag;
	getCurrentTag: () => void;

	tags: Tag[];
	fetchTags: () => Promise<void>;

	createTag: (name: string) => Promise<void>;
	deleteTag: (id: number) => Promise<void>;
	saveTag: (tag: Tag) => Promise<void>;
}

const useTagStore = create<TagState>((set, get) => ({
	currentTagId: 1,
	setCurrentTagId: async (currentTagId) => {
		set({ currentTagId });
		const store = await Store.load("store.json");
		await store.set("currentTagId", currentTagId);
		get().getCurrentTag();
	},
	initTags: async () => {
		const store = await Store.load("store.json");
		const currentTagId = await store.get<number>("currentTagId");
		if (currentTagId) set({ currentTagId });
		get().getCurrentTag();
	},

	currentTag: undefined,
	getCurrentTag: () => {
		const tags = get().tags;
		const getCurrentTagId = get().currentTagId;
		const currentTag = tags.find((tag) => tag.id === getCurrentTagId);
		if (currentTag) {
			set({ currentTag });
		}
	},

	tags: [],
	fetchTags: async () => {
		const tags = await getTags();
		set({ tags });
	},

	createTag: async (name) => {
		const res = await insertTag({ name });
		await get().setCurrentTagId(res.lastInsertId as number);
		await get().fetchTags();
		get().getCurrentTag();
	},
	deleteTag: async (id) => {
		await delTag(id);
		await get().fetchTags();
		if (get().currentTag?.id === id) {
			await get().setCurrentTagId(get().tags[0].id);
			get().getCurrentTag();
		}
	},
	saveTag: async (tag) => {
		await updateTag(tag);
		await get().fetchTags();
		if (tag.id === get().currentTagId) {
			get().getCurrentTag();
		}
	},
}));

export default useTagStore;
