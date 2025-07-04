import type { DirTree } from "@/stores/article";

/**
 * 获取当前文件夹
 * @param path 文件路径
 * @param fileTree 文件树
 * @returns
 */
export function getCurrentFolder(path: string, fileTree: DirTree[]) {
	if (path === "") {
		return undefined;
	}
	let currentFolder: DirTree | undefined;
	const levels = path.split("/");

	for (let index = 0; index < levels.length; index++) {
		const level = levels[index];
		let currentIndex = -1;
		if (index === 0) {
			currentIndex = fileTree.findIndex((item) => item.name === level);
		} else {
			const _index = currentFolder?.children?.findIndex(
				(item) => item.name === level
			);
			currentIndex = _index === undefined ? -1 : _index;
		}
		if (index === 0) {
			currentFolder = fileTree[currentIndex];
		} else {
			currentFolder = currentFolder?.children?.[currentIndex];
		}
	}

	return currentFolder;
}

/**
 * 计算父目录路径
 * @param item 文件夹
 * @returns
 */
export function computedParentPath(item: DirTree) {
	let path = item.name;
	function readParentPath(item: DirTree) {
		if (item.parent) {
			path = item.parent.name + "/" + path;
			if (item.parent.parent) {
				readParentPath(item.parent);
			}
		}
	}
	readParentPath(item);
	return path;
}
