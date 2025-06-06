// Gitee 仓库信息类型
export interface GiteeRepoInfo {
	id: number;
	full_name: string;
	human_name: string;
	url: string;
	namespace: {
		id: number;
		name: string;
		path: string;
	};
	path: string;
	name: string;
	owner: {
		id: number;
		login: string;
		name: string;
		avatar_url: string;
		url: string;
		html_url: string;
		remark: string;
		followers_url: string;
		following_url: string;
		gists_url: string;
		starred_url: string;
		subscriptions_url: string;
		organizations_url: string;
		repos_url: string;
		events_url: string;
		received_events_url: string;
		type: string;
	};
	private: boolean;
	html_url: string;
	description: string;
	fork: boolean;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	homepage: string;
	stargazers_count: number;
	watchers_count: number;
	forks_count: number;
	language: string;
	default_branch: string;
	open_issues_count: number;
	license: {
		key: string;
		name: string;
		spdx_id: string;
		url: string;
	} | null;
	topics: string[];
	has_issues: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	issue_comment: boolean;
	can_comment: boolean;
	repository_type: string;
	permissions: {
		admin: boolean;
		push: boolean;
		pull: boolean;
	};
}

export interface GiteeUserInfo {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	user_view_type: string;
	site_admin: boolean;
	name: string;
	company: null;
	blog: string;
	location: string;
	email: string;
	hireable: boolean;
	bio: null;
	twitter_username: null;
	notification_email: string;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
}

interface Links {
	self: string;
	html: string;
}

export interface GiteeFile {
	name: string;
	path: string;
	sha: string;
	size: number;
	url: string;
	html_url: string;
	download_url: string;
	type: string;
	_links: Links;
	isNew?: boolean;
}

// Gitee Error 类型，与 GitHub 保持一致
export interface GiteeError {
	status: number;
	message: string;
}
