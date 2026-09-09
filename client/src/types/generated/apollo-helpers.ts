import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type access_requestsKeySpecifier = ('created_at' | 'document' | 'document_id' | 'id' | 'message' | 'owner' | 'owner_id' | 'permission_type' | 'requester' | 'requester_id' | 'status' | 'updated_at' | access_requestsKeySpecifier)[];
export type access_requestsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	document?: FieldPolicy<any> | FieldReadFunction<any>,
	document_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	permission_type?: FieldPolicy<any> | FieldReadFunction<any>,
	requester?: FieldPolicy<any> | FieldReadFunction<any>,
	requester_id?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type access_requests_aggregateKeySpecifier = ('aggregate' | 'nodes' | access_requests_aggregateKeySpecifier)[];
export type access_requests_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type access_requests_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | access_requests_aggregate_fieldsKeySpecifier)[];
export type access_requests_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type access_requests_max_fieldsKeySpecifier = ('created_at' | 'document_id' | 'id' | 'message' | 'owner_id' | 'permission_type' | 'requester_id' | 'status' | 'updated_at' | access_requests_max_fieldsKeySpecifier)[];
export type access_requests_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	document_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	permission_type?: FieldPolicy<any> | FieldReadFunction<any>,
	requester_id?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type access_requests_min_fieldsKeySpecifier = ('created_at' | 'document_id' | 'id' | 'message' | 'owner_id' | 'permission_type' | 'requester_id' | 'status' | 'updated_at' | access_requests_min_fieldsKeySpecifier)[];
export type access_requests_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	document_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	permission_type?: FieldPolicy<any> | FieldReadFunction<any>,
	requester_id?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type access_requests_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | access_requests_mutation_responseKeySpecifier)[];
export type access_requests_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_commentsKeySpecifier = ('block' | 'block_id' | 'content' | 'created_at' | 'id' | 'user' | 'user_id' | block_commentsKeySpecifier)[];
export type block_commentsFieldPolicy = {
	block?: FieldPolicy<any> | FieldReadFunction<any>,
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_comments_aggregateKeySpecifier = ('aggregate' | 'nodes' | block_comments_aggregateKeySpecifier)[];
export type block_comments_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_comments_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | block_comments_aggregate_fieldsKeySpecifier)[];
export type block_comments_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_comments_max_fieldsKeySpecifier = ('block_id' | 'content' | 'created_at' | 'id' | 'user_id' | block_comments_max_fieldsKeySpecifier)[];
export type block_comments_max_fieldsFieldPolicy = {
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_comments_min_fieldsKeySpecifier = ('block_id' | 'content' | 'created_at' | 'id' | 'user_id' | block_comments_min_fieldsKeySpecifier)[];
export type block_comments_min_fieldsFieldPolicy = {
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_comments_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | block_comments_mutation_responseKeySpecifier)[];
export type block_comments_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_linksKeySpecifier = ('from_block' | 'from_block_id' | 'to_block' | 'to_block_id' | block_linksKeySpecifier)[];
export type block_linksFieldPolicy = {
	from_block?: FieldPolicy<any> | FieldReadFunction<any>,
	from_block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	to_block?: FieldPolicy<any> | FieldReadFunction<any>,
	to_block_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_links_aggregateKeySpecifier = ('aggregate' | 'nodes' | block_links_aggregateKeySpecifier)[];
export type block_links_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_links_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | block_links_aggregate_fieldsKeySpecifier)[];
export type block_links_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_links_max_fieldsKeySpecifier = ('from_block_id' | 'to_block_id' | block_links_max_fieldsKeySpecifier)[];
export type block_links_max_fieldsFieldPolicy = {
	from_block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	to_block_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_links_min_fieldsKeySpecifier = ('from_block_id' | 'to_block_id' | block_links_min_fieldsKeySpecifier)[];
export type block_links_min_fieldsFieldPolicy = {
	from_block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	to_block_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_links_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | block_links_mutation_responseKeySpecifier)[];
export type block_links_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_reactionsKeySpecifier = ('block' | 'block_id' | 'created_at' | 'emoji' | 'id' | 'user' | 'user_id' | block_reactionsKeySpecifier)[];
export type block_reactionsFieldPolicy = {
	block?: FieldPolicy<any> | FieldReadFunction<any>,
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	emoji?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_reactions_aggregateKeySpecifier = ('aggregate' | 'nodes' | block_reactions_aggregateKeySpecifier)[];
export type block_reactions_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_reactions_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | block_reactions_aggregate_fieldsKeySpecifier)[];
export type block_reactions_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_reactions_max_fieldsKeySpecifier = ('block_id' | 'created_at' | 'emoji' | 'id' | 'user_id' | block_reactions_max_fieldsKeySpecifier)[];
export type block_reactions_max_fieldsFieldPolicy = {
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	emoji?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_reactions_min_fieldsKeySpecifier = ('block_id' | 'created_at' | 'emoji' | 'id' | 'user_id' | block_reactions_min_fieldsKeySpecifier)[];
export type block_reactions_min_fieldsFieldPolicy = {
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	emoji?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_reactions_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | block_reactions_mutation_responseKeySpecifier)[];
export type block_reactions_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_tagsKeySpecifier = ('block' | 'block_id' | 'tag' | 'tag_id' | block_tagsKeySpecifier)[];
export type block_tagsFieldPolicy = {
	block?: FieldPolicy<any> | FieldReadFunction<any>,
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	tag?: FieldPolicy<any> | FieldReadFunction<any>,
	tag_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_tags_aggregateKeySpecifier = ('aggregate' | 'nodes' | block_tags_aggregateKeySpecifier)[];
export type block_tags_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_tags_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | block_tags_aggregate_fieldsKeySpecifier)[];
export type block_tags_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_tags_max_fieldsKeySpecifier = ('block_id' | 'tag_id' | block_tags_max_fieldsKeySpecifier)[];
export type block_tags_max_fieldsFieldPolicy = {
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	tag_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_tags_min_fieldsKeySpecifier = ('block_id' | 'tag_id' | block_tags_min_fieldsKeySpecifier)[];
export type block_tags_min_fieldsFieldPolicy = {
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	tag_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type block_tags_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | block_tags_mutation_responseKeySpecifier)[];
export type block_tags_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocksKeySpecifier = ('access_requests' | 'access_requests_aggregate' | 'block_links_from' | 'block_links_from_aggregate' | 'block_links_to' | 'block_links_to_aggregate' | 'block_tags' | 'block_tags_aggregate' | 'children' | 'children_aggregate' | 'comments' | 'comments_aggregate' | 'content' | 'cover_image' | 'created_at' | 'deleted_at' | 'folder' | 'folder_id' | 'id' | 'page' | 'page_id' | 'parent_block' | 'parent_id' | 'position' | 'reactions' | 'reactions_aggregate' | 'search_text' | 'sub_blocks' | 'sub_blocks_aggregate' | 'tasks' | 'tasks_aggregate' | 'type' | 'updated_at' | 'user' | 'user_id' | 'workspace' | 'workspace_id' | blocksKeySpecifier)[];
export type blocksFieldPolicy = {
	access_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	access_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links_from?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links_from_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links_to?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links_to_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	children?: FieldPolicy<any> | FieldReadFunction<any>,
	children_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	comments?: FieldPolicy<any> | FieldReadFunction<any>,
	comments_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	cover_image?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	deleted_at?: FieldPolicy<any> | FieldReadFunction<any>,
	folder?: FieldPolicy<any> | FieldReadFunction<any>,
	folder_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	page_id?: FieldPolicy<any> | FieldReadFunction<any>,
	parent_block?: FieldPolicy<any> | FieldReadFunction<any>,
	parent_id?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	reactions?: FieldPolicy<any> | FieldReadFunction<any>,
	reactions_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	search_text?: FieldPolicy<any> | FieldReadFunction<any>,
	sub_blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	sub_blocks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	workspace?: FieldPolicy<any> | FieldReadFunction<any>,
	workspace_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_aggregateKeySpecifier = ('aggregate' | 'nodes' | blocks_aggregateKeySpecifier)[];
export type blocks_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | blocks_aggregate_fieldsKeySpecifier)[];
export type blocks_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_avg_fieldsKeySpecifier = ('position' | blocks_avg_fieldsKeySpecifier)[];
export type blocks_avg_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_max_fieldsKeySpecifier = ('cover_image' | 'created_at' | 'deleted_at' | 'folder_id' | 'id' | 'page_id' | 'parent_id' | 'position' | 'search_text' | 'type' | 'updated_at' | 'user_id' | 'workspace_id' | blocks_max_fieldsKeySpecifier)[];
export type blocks_max_fieldsFieldPolicy = {
	cover_image?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	deleted_at?: FieldPolicy<any> | FieldReadFunction<any>,
	folder_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	page_id?: FieldPolicy<any> | FieldReadFunction<any>,
	parent_id?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	search_text?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	workspace_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_min_fieldsKeySpecifier = ('cover_image' | 'created_at' | 'deleted_at' | 'folder_id' | 'id' | 'page_id' | 'parent_id' | 'position' | 'search_text' | 'type' | 'updated_at' | 'user_id' | 'workspace_id' | blocks_min_fieldsKeySpecifier)[];
export type blocks_min_fieldsFieldPolicy = {
	cover_image?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	deleted_at?: FieldPolicy<any> | FieldReadFunction<any>,
	folder_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	page_id?: FieldPolicy<any> | FieldReadFunction<any>,
	parent_id?: FieldPolicy<any> | FieldReadFunction<any>,
	position?: FieldPolicy<any> | FieldReadFunction<any>,
	search_text?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	workspace_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | blocks_mutation_responseKeySpecifier)[];
export type blocks_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_stddev_fieldsKeySpecifier = ('position' | blocks_stddev_fieldsKeySpecifier)[];
export type blocks_stddev_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_stddev_pop_fieldsKeySpecifier = ('position' | blocks_stddev_pop_fieldsKeySpecifier)[];
export type blocks_stddev_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_stddev_samp_fieldsKeySpecifier = ('position' | blocks_stddev_samp_fieldsKeySpecifier)[];
export type blocks_stddev_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_sum_fieldsKeySpecifier = ('position' | blocks_sum_fieldsKeySpecifier)[];
export type blocks_sum_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_var_pop_fieldsKeySpecifier = ('position' | blocks_var_pop_fieldsKeySpecifier)[];
export type blocks_var_pop_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_var_samp_fieldsKeySpecifier = ('position' | blocks_var_samp_fieldsKeySpecifier)[];
export type blocks_var_samp_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type blocks_variance_fieldsKeySpecifier = ('position' | blocks_variance_fieldsKeySpecifier)[];
export type blocks_variance_fieldsFieldPolicy = {
	position?: FieldPolicy<any> | FieldReadFunction<any>
};
export type filesKeySpecifier = ('id' | 'mime_type' | 'uploaded_at' | 'uploaded_by' | 'url' | 'user' | filesKeySpecifier)[];
export type filesFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	mime_type?: FieldPolicy<any> | FieldReadFunction<any>,
	uploaded_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uploaded_by?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type files_aggregateKeySpecifier = ('aggregate' | 'nodes' | files_aggregateKeySpecifier)[];
export type files_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type files_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | files_aggregate_fieldsKeySpecifier)[];
export type files_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type files_max_fieldsKeySpecifier = ('id' | 'mime_type' | 'uploaded_at' | 'uploaded_by' | 'url' | files_max_fieldsKeySpecifier)[];
export type files_max_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	mime_type?: FieldPolicy<any> | FieldReadFunction<any>,
	uploaded_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uploaded_by?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type files_min_fieldsKeySpecifier = ('id' | 'mime_type' | 'uploaded_at' | 'uploaded_by' | 'url' | files_min_fieldsKeySpecifier)[];
export type files_min_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	mime_type?: FieldPolicy<any> | FieldReadFunction<any>,
	uploaded_at?: FieldPolicy<any> | FieldReadFunction<any>,
	uploaded_by?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type files_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | files_mutation_responseKeySpecifier)[];
export type files_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type foldersKeySpecifier = ('blocks' | 'blocks_aggregate' | 'children' | 'children_aggregate' | 'color' | 'created_at' | 'description' | 'folder' | 'icon' | 'id' | 'name' | 'parent_id' | 'user' | 'user_id' | 'workspace' | 'workspace_id' | foldersKeySpecifier)[];
export type foldersFieldPolicy = {
	blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	children?: FieldPolicy<any> | FieldReadFunction<any>,
	children_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	folder?: FieldPolicy<any> | FieldReadFunction<any>,
	icon?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	parent_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	workspace?: FieldPolicy<any> | FieldReadFunction<any>,
	workspace_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type folders_aggregateKeySpecifier = ('aggregate' | 'nodes' | folders_aggregateKeySpecifier)[];
export type folders_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type folders_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | folders_aggregate_fieldsKeySpecifier)[];
export type folders_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type folders_max_fieldsKeySpecifier = ('color' | 'created_at' | 'description' | 'icon' | 'id' | 'name' | 'parent_id' | 'user_id' | 'workspace_id' | folders_max_fieldsKeySpecifier)[];
export type folders_max_fieldsFieldPolicy = {
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	icon?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	parent_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	workspace_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type folders_min_fieldsKeySpecifier = ('color' | 'created_at' | 'description' | 'icon' | 'id' | 'name' | 'parent_id' | 'user_id' | 'workspace_id' | folders_min_fieldsKeySpecifier)[];
export type folders_min_fieldsFieldPolicy = {
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	icon?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	parent_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	workspace_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type folders_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | folders_mutation_responseKeySpecifier)[];
export type folders_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type mutation_rootKeySpecifier = ('delete_access_requests' | 'delete_access_requests_by_pk' | 'delete_block_comments' | 'delete_block_comments_by_pk' | 'delete_block_links' | 'delete_block_links_by_pk' | 'delete_block_reactions' | 'delete_block_reactions_by_pk' | 'delete_block_tags' | 'delete_block_tags_by_pk' | 'delete_blocks' | 'delete_blocks_by_pk' | 'delete_files' | 'delete_files_by_pk' | 'delete_folders' | 'delete_folders_by_pk' | 'delete_notifications' | 'delete_notifications_by_pk' | 'delete_tags' | 'delete_tags_by_pk' | 'delete_tasks' | 'delete_tasks_by_pk' | 'delete_users' | 'delete_users_by_pk' | 'delete_workspaces' | 'delete_workspaces_by_pk' | 'insert_access_requests' | 'insert_access_requests_one' | 'insert_block_comments' | 'insert_block_comments_one' | 'insert_block_links' | 'insert_block_links_one' | 'insert_block_reactions' | 'insert_block_reactions_one' | 'insert_block_tags' | 'insert_block_tags_one' | 'insert_blocks' | 'insert_blocks_one' | 'insert_files' | 'insert_files_one' | 'insert_folders' | 'insert_folders_one' | 'insert_notifications' | 'insert_notifications_one' | 'insert_tags' | 'insert_tags_one' | 'insert_tasks' | 'insert_tasks_one' | 'insert_users' | 'insert_users_one' | 'insert_workspaces' | 'insert_workspaces_one' | 'update_access_requests' | 'update_access_requests_by_pk' | 'update_access_requests_many' | 'update_block_comments' | 'update_block_comments_by_pk' | 'update_block_comments_many' | 'update_block_links' | 'update_block_links_by_pk' | 'update_block_links_many' | 'update_block_reactions' | 'update_block_reactions_by_pk' | 'update_block_reactions_many' | 'update_block_tags' | 'update_block_tags_by_pk' | 'update_block_tags_many' | 'update_blocks' | 'update_blocks_by_pk' | 'update_blocks_many' | 'update_files' | 'update_files_by_pk' | 'update_files_many' | 'update_folders' | 'update_folders_by_pk' | 'update_folders_many' | 'update_notifications' | 'update_notifications_by_pk' | 'update_notifications_many' | 'update_tags' | 'update_tags_by_pk' | 'update_tags_many' | 'update_tasks' | 'update_tasks_by_pk' | 'update_tasks_many' | 'update_users' | 'update_users_by_pk' | 'update_users_many' | 'update_workspaces' | 'update_workspaces_by_pk' | 'update_workspaces_many' | mutation_rootKeySpecifier)[];
export type mutation_rootFieldPolicy = {
	delete_access_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_access_requests_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_block_comments?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_block_comments_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_block_links?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_block_links_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_block_reactions?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_block_reactions_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_block_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_block_tags_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_blocks_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_files?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_files_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_folders?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_folders_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_notifications?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_notifications_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_tags_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_tasks_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_users?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_workspaces?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_workspaces_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_access_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_access_requests_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_block_comments?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_block_comments_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_block_links?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_block_links_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_block_reactions?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_block_reactions_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_block_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_block_tags_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_blocks_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_files?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_files_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_folders?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_folders_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_notifications?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_notifications_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_tags_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_tasks_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_users?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_users_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_workspaces?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_workspaces_one?: FieldPolicy<any> | FieldReadFunction<any>,
	update_access_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	update_access_requests_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_access_requests_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_comments?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_comments_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_comments_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_links?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_links_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_links_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_reactions?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_reactions_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_reactions_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_tags_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_block_tags_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	update_blocks_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_blocks_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_files?: FieldPolicy<any> | FieldReadFunction<any>,
	update_files_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_files_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_folders?: FieldPolicy<any> | FieldReadFunction<any>,
	update_folders_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_folders_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_notifications?: FieldPolicy<any> | FieldReadFunction<any>,
	update_notifications_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_notifications_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	update_tags_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_tags_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	update_tasks_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_tasks_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_users?: FieldPolicy<any> | FieldReadFunction<any>,
	update_users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_users_many?: FieldPolicy<any> | FieldReadFunction<any>,
	update_workspaces?: FieldPolicy<any> | FieldReadFunction<any>,
	update_workspaces_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_workspaces_many?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notificationsKeySpecifier = ('created_at' | 'data' | 'event_key' | 'id' | 'is_read' | 'message' | 'status' | 'title' | 'type' | 'user' | 'user_id' | notificationsKeySpecifier)[];
export type notificationsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	event_key?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	is_read?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notifications_aggregateKeySpecifier = ('aggregate' | 'nodes' | notifications_aggregateKeySpecifier)[];
export type notifications_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notifications_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | notifications_aggregate_fieldsKeySpecifier)[];
export type notifications_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notifications_max_fieldsKeySpecifier = ('created_at' | 'event_key' | 'id' | 'message' | 'status' | 'title' | 'type' | 'user_id' | notifications_max_fieldsKeySpecifier)[];
export type notifications_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	event_key?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notifications_min_fieldsKeySpecifier = ('created_at' | 'event_key' | 'id' | 'message' | 'status' | 'title' | 'type' | 'user_id' | notifications_min_fieldsKeySpecifier)[];
export type notifications_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	event_key?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notifications_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | notifications_mutation_responseKeySpecifier)[];
export type notifications_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type query_rootKeySpecifier = ('access_requests' | 'access_requests_aggregate' | 'access_requests_by_pk' | 'block_comments' | 'block_comments_aggregate' | 'block_comments_by_pk' | 'block_links' | 'block_links_aggregate' | 'block_links_by_pk' | 'block_reactions' | 'block_reactions_aggregate' | 'block_reactions_by_pk' | 'block_tags' | 'block_tags_aggregate' | 'block_tags_by_pk' | 'blocks' | 'blocks_aggregate' | 'blocks_by_pk' | 'files' | 'files_aggregate' | 'files_by_pk' | 'folders' | 'folders_aggregate' | 'folders_by_pk' | 'notifications' | 'notifications_aggregate' | 'notifications_by_pk' | 'tags' | 'tags_aggregate' | 'tags_by_pk' | 'tasks' | 'tasks_aggregate' | 'tasks_by_pk' | 'users' | 'users_aggregate' | 'users_by_pk' | 'workspaces' | 'workspaces_aggregate' | 'workspaces_by_pk' | query_rootKeySpecifier)[];
export type query_rootFieldPolicy = {
	access_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	access_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	access_requests_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	block_comments?: FieldPolicy<any> | FieldReadFunction<any>,
	block_comments_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_comments_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	block_reactions?: FieldPolicy<any> | FieldReadFunction<any>,
	block_reactions_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_reactions_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	files?: FieldPolicy<any> | FieldReadFunction<any>,
	files_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	files_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	folders?: FieldPolicy<any> | FieldReadFunction<any>,
	folders_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	folders_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	notifications?: FieldPolicy<any> | FieldReadFunction<any>,
	notifications_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	notifications_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	tags_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	tags_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	users_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	workspaces?: FieldPolicy<any> | FieldReadFunction<any>,
	workspaces_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	workspaces_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type subscription_rootKeySpecifier = ('access_requests' | 'access_requests_aggregate' | 'access_requests_by_pk' | 'access_requests_stream' | 'block_comments' | 'block_comments_aggregate' | 'block_comments_by_pk' | 'block_comments_stream' | 'block_links' | 'block_links_aggregate' | 'block_links_by_pk' | 'block_links_stream' | 'block_reactions' | 'block_reactions_aggregate' | 'block_reactions_by_pk' | 'block_reactions_stream' | 'block_tags' | 'block_tags_aggregate' | 'block_tags_by_pk' | 'block_tags_stream' | 'blocks' | 'blocks_aggregate' | 'blocks_by_pk' | 'blocks_stream' | 'files' | 'files_aggregate' | 'files_by_pk' | 'files_stream' | 'folders' | 'folders_aggregate' | 'folders_by_pk' | 'folders_stream' | 'notifications' | 'notifications_aggregate' | 'notifications_by_pk' | 'notifications_stream' | 'tags' | 'tags_aggregate' | 'tags_by_pk' | 'tags_stream' | 'tasks' | 'tasks_aggregate' | 'tasks_by_pk' | 'tasks_stream' | 'users' | 'users_aggregate' | 'users_by_pk' | 'users_stream' | 'workspaces' | 'workspaces_aggregate' | 'workspaces_by_pk' | 'workspaces_stream' | subscription_rootKeySpecifier)[];
export type subscription_rootFieldPolicy = {
	access_requests?: FieldPolicy<any> | FieldReadFunction<any>,
	access_requests_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	access_requests_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	access_requests_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	block_comments?: FieldPolicy<any> | FieldReadFunction<any>,
	block_comments_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_comments_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	block_comments_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	block_links_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	block_reactions?: FieldPolicy<any> | FieldReadFunction<any>,
	block_reactions_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_reactions_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	block_reactions_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	files?: FieldPolicy<any> | FieldReadFunction<any>,
	files_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	files_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	files_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	folders?: FieldPolicy<any> | FieldReadFunction<any>,
	folders_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	folders_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	folders_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	notifications?: FieldPolicy<any> | FieldReadFunction<any>,
	notifications_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	notifications_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	notifications_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	tags_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	tags_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	tags_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	users_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	users_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	users_stream?: FieldPolicy<any> | FieldReadFunction<any>,
	workspaces?: FieldPolicy<any> | FieldReadFunction<any>,
	workspaces_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	workspaces_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	workspaces_stream?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tagsKeySpecifier = ('block_tags' | 'block_tags_aggregate' | 'color' | 'id' | 'name' | tagsKeySpecifier)[];
export type tagsFieldPolicy = {
	block_tags?: FieldPolicy<any> | FieldReadFunction<any>,
	block_tags_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tags_aggregateKeySpecifier = ('aggregate' | 'nodes' | tags_aggregateKeySpecifier)[];
export type tags_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tags_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | tags_aggregate_fieldsKeySpecifier)[];
export type tags_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tags_max_fieldsKeySpecifier = ('color' | 'id' | 'name' | tags_max_fieldsKeySpecifier)[];
export type tags_max_fieldsFieldPolicy = {
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tags_min_fieldsKeySpecifier = ('color' | 'id' | 'name' | tags_min_fieldsKeySpecifier)[];
export type tags_min_fieldsFieldPolicy = {
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tags_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | tags_mutation_responseKeySpecifier)[];
export type tags_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tasksKeySpecifier = ('block' | 'block_id' | 'created_at' | 'deadline_date' | 'id' | 'priority' | 'schedule_date' | 'status' | 'updated_at' | 'user' | 'user_id' | tasksKeySpecifier)[];
export type tasksFieldPolicy = {
	block?: FieldPolicy<any> | FieldReadFunction<any>,
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline_date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	priority?: FieldPolicy<any> | FieldReadFunction<any>,
	schedule_date?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tasks_aggregateKeySpecifier = ('aggregate' | 'nodes' | tasks_aggregateKeySpecifier)[];
export type tasks_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tasks_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | tasks_aggregate_fieldsKeySpecifier)[];
export type tasks_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tasks_max_fieldsKeySpecifier = ('block_id' | 'created_at' | 'deadline_date' | 'id' | 'priority' | 'schedule_date' | 'status' | 'updated_at' | 'user_id' | tasks_max_fieldsKeySpecifier)[];
export type tasks_max_fieldsFieldPolicy = {
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline_date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	priority?: FieldPolicy<any> | FieldReadFunction<any>,
	schedule_date?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tasks_min_fieldsKeySpecifier = ('block_id' | 'created_at' | 'deadline_date' | 'id' | 'priority' | 'schedule_date' | 'status' | 'updated_at' | 'user_id' | tasks_min_fieldsKeySpecifier)[];
export type tasks_min_fieldsFieldPolicy = {
	block_id?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline_date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	priority?: FieldPolicy<any> | FieldReadFunction<any>,
	schedule_date?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type tasks_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | tasks_mutation_responseKeySpecifier)[];
export type tasks_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type usersKeySpecifier = ('avatar_url' | 'block_comments' | 'block_comments_aggregate' | 'block_reactions' | 'block_reactions_aggregate' | 'blocks' | 'blocks_aggregate' | 'created_at' | 'email' | 'files' | 'files_aggregate' | 'folders' | 'folders_aggregate' | 'id' | 'name' | 'role' | 'tasks' | 'tasks_aggregate' | 'workspaces' | 'workspaces_aggregate' | usersKeySpecifier)[];
export type usersFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	block_comments?: FieldPolicy<any> | FieldReadFunction<any>,
	block_comments_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	block_reactions?: FieldPolicy<any> | FieldReadFunction<any>,
	block_reactions_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	files?: FieldPolicy<any> | FieldReadFunction<any>,
	files_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	folders?: FieldPolicy<any> | FieldReadFunction<any>,
	folders_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	role?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	workspaces?: FieldPolicy<any> | FieldReadFunction<any>,
	workspaces_aggregate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_aggregateKeySpecifier = ('aggregate' | 'nodes' | users_aggregateKeySpecifier)[];
export type users_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | users_aggregate_fieldsKeySpecifier)[];
export type users_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_max_fieldsKeySpecifier = ('avatar_url' | 'created_at' | 'email' | 'id' | 'name' | 'role' | users_max_fieldsKeySpecifier)[];
export type users_max_fieldsFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	role?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_min_fieldsKeySpecifier = ('avatar_url' | 'created_at' | 'email' | 'id' | 'name' | 'role' | users_min_fieldsKeySpecifier)[];
export type users_min_fieldsFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	role?: FieldPolicy<any> | FieldReadFunction<any>
};
export type users_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | users_mutation_responseKeySpecifier)[];
export type users_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type workspacesKeySpecifier = ('blocks' | 'blocks_aggregate' | 'created_at' | 'created_by' | 'folders' | 'folders_aggregate' | 'id' | 'image_url' | 'name' | 'user' | workspacesKeySpecifier)[];
export type workspacesFieldPolicy = {
	blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	created_by?: FieldPolicy<any> | FieldReadFunction<any>,
	folders?: FieldPolicy<any> | FieldReadFunction<any>,
	folders_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	image_url?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type workspaces_aggregateKeySpecifier = ('aggregate' | 'nodes' | workspaces_aggregateKeySpecifier)[];
export type workspaces_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type workspaces_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | workspaces_aggregate_fieldsKeySpecifier)[];
export type workspaces_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type workspaces_max_fieldsKeySpecifier = ('created_at' | 'created_by' | 'id' | 'image_url' | 'name' | workspaces_max_fieldsKeySpecifier)[];
export type workspaces_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	created_by?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	image_url?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type workspaces_min_fieldsKeySpecifier = ('created_at' | 'created_by' | 'id' | 'image_url' | 'name' | workspaces_min_fieldsKeySpecifier)[];
export type workspaces_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	created_by?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	image_url?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type workspaces_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | workspaces_mutation_responseKeySpecifier)[];
export type workspaces_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	access_requests?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | access_requestsKeySpecifier | (() => undefined | access_requestsKeySpecifier),
		fields?: access_requestsFieldPolicy,
	},
	access_requests_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | access_requests_aggregateKeySpecifier | (() => undefined | access_requests_aggregateKeySpecifier),
		fields?: access_requests_aggregateFieldPolicy,
	},
	access_requests_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | access_requests_aggregate_fieldsKeySpecifier | (() => undefined | access_requests_aggregate_fieldsKeySpecifier),
		fields?: access_requests_aggregate_fieldsFieldPolicy,
	},
	access_requests_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | access_requests_max_fieldsKeySpecifier | (() => undefined | access_requests_max_fieldsKeySpecifier),
		fields?: access_requests_max_fieldsFieldPolicy,
	},
	access_requests_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | access_requests_min_fieldsKeySpecifier | (() => undefined | access_requests_min_fieldsKeySpecifier),
		fields?: access_requests_min_fieldsFieldPolicy,
	},
	access_requests_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | access_requests_mutation_responseKeySpecifier | (() => undefined | access_requests_mutation_responseKeySpecifier),
		fields?: access_requests_mutation_responseFieldPolicy,
	},
	block_comments?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_commentsKeySpecifier | (() => undefined | block_commentsKeySpecifier),
		fields?: block_commentsFieldPolicy,
	},
	block_comments_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_comments_aggregateKeySpecifier | (() => undefined | block_comments_aggregateKeySpecifier),
		fields?: block_comments_aggregateFieldPolicy,
	},
	block_comments_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_comments_aggregate_fieldsKeySpecifier | (() => undefined | block_comments_aggregate_fieldsKeySpecifier),
		fields?: block_comments_aggregate_fieldsFieldPolicy,
	},
	block_comments_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_comments_max_fieldsKeySpecifier | (() => undefined | block_comments_max_fieldsKeySpecifier),
		fields?: block_comments_max_fieldsFieldPolicy,
	},
	block_comments_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_comments_min_fieldsKeySpecifier | (() => undefined | block_comments_min_fieldsKeySpecifier),
		fields?: block_comments_min_fieldsFieldPolicy,
	},
	block_comments_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_comments_mutation_responseKeySpecifier | (() => undefined | block_comments_mutation_responseKeySpecifier),
		fields?: block_comments_mutation_responseFieldPolicy,
	},
	block_links?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_linksKeySpecifier | (() => undefined | block_linksKeySpecifier),
		fields?: block_linksFieldPolicy,
	},
	block_links_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_links_aggregateKeySpecifier | (() => undefined | block_links_aggregateKeySpecifier),
		fields?: block_links_aggregateFieldPolicy,
	},
	block_links_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_links_aggregate_fieldsKeySpecifier | (() => undefined | block_links_aggregate_fieldsKeySpecifier),
		fields?: block_links_aggregate_fieldsFieldPolicy,
	},
	block_links_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_links_max_fieldsKeySpecifier | (() => undefined | block_links_max_fieldsKeySpecifier),
		fields?: block_links_max_fieldsFieldPolicy,
	},
	block_links_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_links_min_fieldsKeySpecifier | (() => undefined | block_links_min_fieldsKeySpecifier),
		fields?: block_links_min_fieldsFieldPolicy,
	},
	block_links_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_links_mutation_responseKeySpecifier | (() => undefined | block_links_mutation_responseKeySpecifier),
		fields?: block_links_mutation_responseFieldPolicy,
	},
	block_reactions?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_reactionsKeySpecifier | (() => undefined | block_reactionsKeySpecifier),
		fields?: block_reactionsFieldPolicy,
	},
	block_reactions_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_reactions_aggregateKeySpecifier | (() => undefined | block_reactions_aggregateKeySpecifier),
		fields?: block_reactions_aggregateFieldPolicy,
	},
	block_reactions_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_reactions_aggregate_fieldsKeySpecifier | (() => undefined | block_reactions_aggregate_fieldsKeySpecifier),
		fields?: block_reactions_aggregate_fieldsFieldPolicy,
	},
	block_reactions_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_reactions_max_fieldsKeySpecifier | (() => undefined | block_reactions_max_fieldsKeySpecifier),
		fields?: block_reactions_max_fieldsFieldPolicy,
	},
	block_reactions_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_reactions_min_fieldsKeySpecifier | (() => undefined | block_reactions_min_fieldsKeySpecifier),
		fields?: block_reactions_min_fieldsFieldPolicy,
	},
	block_reactions_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_reactions_mutation_responseKeySpecifier | (() => undefined | block_reactions_mutation_responseKeySpecifier),
		fields?: block_reactions_mutation_responseFieldPolicy,
	},
	block_tags?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_tagsKeySpecifier | (() => undefined | block_tagsKeySpecifier),
		fields?: block_tagsFieldPolicy,
	},
	block_tags_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_tags_aggregateKeySpecifier | (() => undefined | block_tags_aggregateKeySpecifier),
		fields?: block_tags_aggregateFieldPolicy,
	},
	block_tags_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_tags_aggregate_fieldsKeySpecifier | (() => undefined | block_tags_aggregate_fieldsKeySpecifier),
		fields?: block_tags_aggregate_fieldsFieldPolicy,
	},
	block_tags_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_tags_max_fieldsKeySpecifier | (() => undefined | block_tags_max_fieldsKeySpecifier),
		fields?: block_tags_max_fieldsFieldPolicy,
	},
	block_tags_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_tags_min_fieldsKeySpecifier | (() => undefined | block_tags_min_fieldsKeySpecifier),
		fields?: block_tags_min_fieldsFieldPolicy,
	},
	block_tags_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | block_tags_mutation_responseKeySpecifier | (() => undefined | block_tags_mutation_responseKeySpecifier),
		fields?: block_tags_mutation_responseFieldPolicy,
	},
	blocks?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocksKeySpecifier | (() => undefined | blocksKeySpecifier),
		fields?: blocksFieldPolicy,
	},
	blocks_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_aggregateKeySpecifier | (() => undefined | blocks_aggregateKeySpecifier),
		fields?: blocks_aggregateFieldPolicy,
	},
	blocks_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_aggregate_fieldsKeySpecifier | (() => undefined | blocks_aggregate_fieldsKeySpecifier),
		fields?: blocks_aggregate_fieldsFieldPolicy,
	},
	blocks_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_avg_fieldsKeySpecifier | (() => undefined | blocks_avg_fieldsKeySpecifier),
		fields?: blocks_avg_fieldsFieldPolicy,
	},
	blocks_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_max_fieldsKeySpecifier | (() => undefined | blocks_max_fieldsKeySpecifier),
		fields?: blocks_max_fieldsFieldPolicy,
	},
	blocks_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_min_fieldsKeySpecifier | (() => undefined | blocks_min_fieldsKeySpecifier),
		fields?: blocks_min_fieldsFieldPolicy,
	},
	blocks_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_mutation_responseKeySpecifier | (() => undefined | blocks_mutation_responseKeySpecifier),
		fields?: blocks_mutation_responseFieldPolicy,
	},
	blocks_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_stddev_fieldsKeySpecifier | (() => undefined | blocks_stddev_fieldsKeySpecifier),
		fields?: blocks_stddev_fieldsFieldPolicy,
	},
	blocks_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_stddev_pop_fieldsKeySpecifier | (() => undefined | blocks_stddev_pop_fieldsKeySpecifier),
		fields?: blocks_stddev_pop_fieldsFieldPolicy,
	},
	blocks_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_stddev_samp_fieldsKeySpecifier | (() => undefined | blocks_stddev_samp_fieldsKeySpecifier),
		fields?: blocks_stddev_samp_fieldsFieldPolicy,
	},
	blocks_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_sum_fieldsKeySpecifier | (() => undefined | blocks_sum_fieldsKeySpecifier),
		fields?: blocks_sum_fieldsFieldPolicy,
	},
	blocks_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_var_pop_fieldsKeySpecifier | (() => undefined | blocks_var_pop_fieldsKeySpecifier),
		fields?: blocks_var_pop_fieldsFieldPolicy,
	},
	blocks_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_var_samp_fieldsKeySpecifier | (() => undefined | blocks_var_samp_fieldsKeySpecifier),
		fields?: blocks_var_samp_fieldsFieldPolicy,
	},
	blocks_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | blocks_variance_fieldsKeySpecifier | (() => undefined | blocks_variance_fieldsKeySpecifier),
		fields?: blocks_variance_fieldsFieldPolicy,
	},
	files?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | filesKeySpecifier | (() => undefined | filesKeySpecifier),
		fields?: filesFieldPolicy,
	},
	files_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | files_aggregateKeySpecifier | (() => undefined | files_aggregateKeySpecifier),
		fields?: files_aggregateFieldPolicy,
	},
	files_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | files_aggregate_fieldsKeySpecifier | (() => undefined | files_aggregate_fieldsKeySpecifier),
		fields?: files_aggregate_fieldsFieldPolicy,
	},
	files_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | files_max_fieldsKeySpecifier | (() => undefined | files_max_fieldsKeySpecifier),
		fields?: files_max_fieldsFieldPolicy,
	},
	files_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | files_min_fieldsKeySpecifier | (() => undefined | files_min_fieldsKeySpecifier),
		fields?: files_min_fieldsFieldPolicy,
	},
	files_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | files_mutation_responseKeySpecifier | (() => undefined | files_mutation_responseKeySpecifier),
		fields?: files_mutation_responseFieldPolicy,
	},
	folders?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | foldersKeySpecifier | (() => undefined | foldersKeySpecifier),
		fields?: foldersFieldPolicy,
	},
	folders_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | folders_aggregateKeySpecifier | (() => undefined | folders_aggregateKeySpecifier),
		fields?: folders_aggregateFieldPolicy,
	},
	folders_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | folders_aggregate_fieldsKeySpecifier | (() => undefined | folders_aggregate_fieldsKeySpecifier),
		fields?: folders_aggregate_fieldsFieldPolicy,
	},
	folders_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | folders_max_fieldsKeySpecifier | (() => undefined | folders_max_fieldsKeySpecifier),
		fields?: folders_max_fieldsFieldPolicy,
	},
	folders_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | folders_min_fieldsKeySpecifier | (() => undefined | folders_min_fieldsKeySpecifier),
		fields?: folders_min_fieldsFieldPolicy,
	},
	folders_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | folders_mutation_responseKeySpecifier | (() => undefined | folders_mutation_responseKeySpecifier),
		fields?: folders_mutation_responseFieldPolicy,
	},
	mutation_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | mutation_rootKeySpecifier | (() => undefined | mutation_rootKeySpecifier),
		fields?: mutation_rootFieldPolicy,
	},
	notifications?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notificationsKeySpecifier | (() => undefined | notificationsKeySpecifier),
		fields?: notificationsFieldPolicy,
	},
	notifications_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notifications_aggregateKeySpecifier | (() => undefined | notifications_aggregateKeySpecifier),
		fields?: notifications_aggregateFieldPolicy,
	},
	notifications_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notifications_aggregate_fieldsKeySpecifier | (() => undefined | notifications_aggregate_fieldsKeySpecifier),
		fields?: notifications_aggregate_fieldsFieldPolicy,
	},
	notifications_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notifications_max_fieldsKeySpecifier | (() => undefined | notifications_max_fieldsKeySpecifier),
		fields?: notifications_max_fieldsFieldPolicy,
	},
	notifications_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notifications_min_fieldsKeySpecifier | (() => undefined | notifications_min_fieldsKeySpecifier),
		fields?: notifications_min_fieldsFieldPolicy,
	},
	notifications_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notifications_mutation_responseKeySpecifier | (() => undefined | notifications_mutation_responseKeySpecifier),
		fields?: notifications_mutation_responseFieldPolicy,
	},
	query_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | query_rootKeySpecifier | (() => undefined | query_rootKeySpecifier),
		fields?: query_rootFieldPolicy,
	},
	subscription_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | subscription_rootKeySpecifier | (() => undefined | subscription_rootKeySpecifier),
		fields?: subscription_rootFieldPolicy,
	},
	tags?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tagsKeySpecifier | (() => undefined | tagsKeySpecifier),
		fields?: tagsFieldPolicy,
	},
	tags_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tags_aggregateKeySpecifier | (() => undefined | tags_aggregateKeySpecifier),
		fields?: tags_aggregateFieldPolicy,
	},
	tags_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tags_aggregate_fieldsKeySpecifier | (() => undefined | tags_aggregate_fieldsKeySpecifier),
		fields?: tags_aggregate_fieldsFieldPolicy,
	},
	tags_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tags_max_fieldsKeySpecifier | (() => undefined | tags_max_fieldsKeySpecifier),
		fields?: tags_max_fieldsFieldPolicy,
	},
	tags_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tags_min_fieldsKeySpecifier | (() => undefined | tags_min_fieldsKeySpecifier),
		fields?: tags_min_fieldsFieldPolicy,
	},
	tags_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tags_mutation_responseKeySpecifier | (() => undefined | tags_mutation_responseKeySpecifier),
		fields?: tags_mutation_responseFieldPolicy,
	},
	tasks?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tasksKeySpecifier | (() => undefined | tasksKeySpecifier),
		fields?: tasksFieldPolicy,
	},
	tasks_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tasks_aggregateKeySpecifier | (() => undefined | tasks_aggregateKeySpecifier),
		fields?: tasks_aggregateFieldPolicy,
	},
	tasks_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tasks_aggregate_fieldsKeySpecifier | (() => undefined | tasks_aggregate_fieldsKeySpecifier),
		fields?: tasks_aggregate_fieldsFieldPolicy,
	},
	tasks_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tasks_max_fieldsKeySpecifier | (() => undefined | tasks_max_fieldsKeySpecifier),
		fields?: tasks_max_fieldsFieldPolicy,
	},
	tasks_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tasks_min_fieldsKeySpecifier | (() => undefined | tasks_min_fieldsKeySpecifier),
		fields?: tasks_min_fieldsFieldPolicy,
	},
	tasks_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | tasks_mutation_responseKeySpecifier | (() => undefined | tasks_mutation_responseKeySpecifier),
		fields?: tasks_mutation_responseFieldPolicy,
	},
	users?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | usersKeySpecifier | (() => undefined | usersKeySpecifier),
		fields?: usersFieldPolicy,
	},
	users_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_aggregateKeySpecifier | (() => undefined | users_aggregateKeySpecifier),
		fields?: users_aggregateFieldPolicy,
	},
	users_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_aggregate_fieldsKeySpecifier | (() => undefined | users_aggregate_fieldsKeySpecifier),
		fields?: users_aggregate_fieldsFieldPolicy,
	},
	users_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_max_fieldsKeySpecifier | (() => undefined | users_max_fieldsKeySpecifier),
		fields?: users_max_fieldsFieldPolicy,
	},
	users_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_min_fieldsKeySpecifier | (() => undefined | users_min_fieldsKeySpecifier),
		fields?: users_min_fieldsFieldPolicy,
	},
	users_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | users_mutation_responseKeySpecifier | (() => undefined | users_mutation_responseKeySpecifier),
		fields?: users_mutation_responseFieldPolicy,
	},
	workspaces?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | workspacesKeySpecifier | (() => undefined | workspacesKeySpecifier),
		fields?: workspacesFieldPolicy,
	},
	workspaces_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | workspaces_aggregateKeySpecifier | (() => undefined | workspaces_aggregateKeySpecifier),
		fields?: workspaces_aggregateFieldPolicy,
	},
	workspaces_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | workspaces_aggregate_fieldsKeySpecifier | (() => undefined | workspaces_aggregate_fieldsKeySpecifier),
		fields?: workspaces_aggregate_fieldsFieldPolicy,
	},
	workspaces_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | workspaces_max_fieldsKeySpecifier | (() => undefined | workspaces_max_fieldsKeySpecifier),
		fields?: workspaces_max_fieldsFieldPolicy,
	},
	workspaces_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | workspaces_min_fieldsKeySpecifier | (() => undefined | workspaces_min_fieldsKeySpecifier),
		fields?: workspaces_min_fieldsFieldPolicy,
	},
	workspaces_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | workspaces_mutation_responseKeySpecifier | (() => undefined | workspaces_mutation_responseKeySpecifier),
		fields?: workspaces_mutation_responseFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;