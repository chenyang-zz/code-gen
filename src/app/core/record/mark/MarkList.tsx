import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
} from "@/components/ui/sidebar";
import useMarkStore from "@/stores/mark";
import React from "react";
import MarkEmpty from "./MarkEmpty";
import MarkLoading from "./MarkLoading";
import MarkItem from "./MarkItem";

const MarkList = () => {
	const { marks, queues } = useMarkStore();
	return (
		<SidebarContent>
			<SidebarGroup className="px-0">
				<SidebarGroupContent>
					{queues.map((mark) => (
						<MarkLoading key={mark.queueId} mark={mark} />
					))}
					{marks.length ? (
						marks.map((mark) => <MarkItem key={mark.id} />)
					) : (
						<MarkEmpty />
					)}
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	);
};

export default MarkList;
