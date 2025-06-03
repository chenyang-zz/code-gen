import { getAllMarks, getMarks, Mark } from "@/db/marks";
import { Store } from "@tauri-apps/plugin-store";
import { create } from "zustand";

export interface MarkQueue {
	queueId: string;
	type: Mark["type"];
	progress: string;
	startTime: number;
}

interface MarkState {
	trashState: boolean;
	setTrashState: (flag: boolean) => void;

	marks: Mark[];
	setMarks: (marks: Mark[]) => void;

	fetchMarks: () => Promise<void>;
	fetchAllTrashMarks: () => Promise<void>;

	queues: MarkQueue[];
	addQueue: (mark: MarkQueue) => void;
	setQueue: (queueId: string, mark: Partial<MarkQueue>) => void;
	removeQueue: (queneId: string) => void;
}

const useMarkStore = create<MarkState>((set) => ({
	trashState: false,
	setTrashState: (flag) => {
		set({ trashState: flag });
	},

	marks: [],
	setMarks: (marks: Mark[]) => {
		set({ marks });
	},

	fetchMarks: async () => {
		const store = await Store.load("store.json");
		const currentTagId = await store.get<number>("currentTagId");
		if (!currentTagId) {
			return;
		}
		const res = await getMarks(currentTagId);
		const decodeRes = res
			.map((item) => {
				return {
					...item,
					content: decodeURIComponent(item.content || ""),
				};
			})
			.filter((item) => item.deleted === 0);
		set({ marks: decodeRes });
	},
	fetchAllTrashMarks: async () => {
		const res = await getAllMarks();
		const decodeRes = res
			.map((item) => {
				return {
					...item,
					content: decodeURIComponent(item.content || ""),
				};
			})
			.filter((item) => item.deleted === 1);
		set({ marks: decodeRes });
	},

	queues: [],
	addQueue: (mark) => {
		set((state) => {
			return {
				queues: [mark, ...state.queues],
			};
		});
	},
	setQueue: (queueId, mark) => {
		set((state) => {
			return {
				queues: state.queues.map((item) => {
					if (item.queueId === queueId) {
						return {
							...item,
							...mark,
						};
					}
					return item;
				}),
			};
		});
	},
	removeQueue: (queneId) => {
		set((state) => {
			return {
				queues: state.queues.filter((item) => item.queueId !== queneId),
			};
		});
	},
}));

export default useMarkStore;
