export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  date: { input: string; output: string; }
  jsonb: { input: any; output: any; }
  timestamptz: { input: string; output: string; }
  timetz: { input: string; output: string; }
  uuid: { input: string; output: string; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "access_requests" */
export type AccessRequests = {
  __typename?: 'access_requests';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  document: Blocks;
  document_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  message?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  owner: Users;
  owner_id: Scalars['uuid']['output'];
  permission_type?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  requester: Users;
  requester_id: Scalars['uuid']['output'];
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "access_requests" */
export type AccessRequestsAggregate = {
  __typename?: 'access_requests_aggregate';
  aggregate?: Maybe<AccessRequestsAggregateFields>;
  nodes: Array<AccessRequests>;
};

export type AccessRequestsAggregateBoolExp = {
  count?: InputMaybe<AccessRequestsAggregateBoolExpCount>;
};

export type AccessRequestsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<AccessRequestsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<AccessRequestsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "access_requests" */
export type AccessRequestsAggregateFields = {
  __typename?: 'access_requests_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<AccessRequestsMaxFields>;
  min?: Maybe<AccessRequestsMinFields>;
};


/** aggregate fields of "access_requests" */
export type AccessRequestsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AccessRequestsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "access_requests" */
export type AccessRequestsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<AccessRequestsMaxOrderBy>;
  min?: InputMaybe<AccessRequestsMinOrderBy>;
};

/** input type for inserting array relation for remote table "access_requests" */
export type AccessRequestsArrRelInsertInput = {
  data: Array<AccessRequestsInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<AccessRequestsOnConflict>;
};

/** Boolean expression to filter rows from the table "access_requests". All fields are combined with a logical 'AND'. */
export type AccessRequestsBoolExp = {
  _and?: InputMaybe<Array<AccessRequestsBoolExp>>;
  _not?: InputMaybe<AccessRequestsBoolExp>;
  _or?: InputMaybe<Array<AccessRequestsBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  document?: InputMaybe<BlocksBoolExp>;
  document_id?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
  owner?: InputMaybe<UsersBoolExp>;
  owner_id?: InputMaybe<UuidComparisonExp>;
  permission_type?: InputMaybe<StringComparisonExp>;
  requester?: InputMaybe<UsersBoolExp>;
  requester_id?: InputMaybe<UuidComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "access_requests" */
export enum AccessRequestsConstraint {
  /** unique or primary key constraint on columns "requester_id", "document_id" */
  AccessRequestsDocumentIdRequesterIdKey = 'access_requests_document_id_requester_id_key',
  /** unique or primary key constraint on columns "id" */
  AccessRequestsPkey = 'access_requests_pkey'
}

/** input type for inserting data into table "access_requests" */
export type AccessRequestsInsertInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  document?: InputMaybe<BlocksObjRelInsertInput>;
  document_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<UsersObjRelInsertInput>;
  owner_id?: InputMaybe<Scalars['uuid']['input']>;
  permission_type?: InputMaybe<Scalars['String']['input']>;
  requester?: InputMaybe<UsersObjRelInsertInput>;
  requester_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type AccessRequestsMaxFields = {
  __typename?: 'access_requests_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  document_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  owner_id?: Maybe<Scalars['uuid']['output']>;
  permission_type?: Maybe<Scalars['String']['output']>;
  requester_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "access_requests" */
export type AccessRequestsMaxOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  document_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  owner_id?: InputMaybe<OrderBy>;
  permission_type?: InputMaybe<OrderBy>;
  requester_id?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type AccessRequestsMinFields = {
  __typename?: 'access_requests_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  document_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  owner_id?: Maybe<Scalars['uuid']['output']>;
  permission_type?: Maybe<Scalars['String']['output']>;
  requester_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "access_requests" */
export type AccessRequestsMinOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  document_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  owner_id?: InputMaybe<OrderBy>;
  permission_type?: InputMaybe<OrderBy>;
  requester_id?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "access_requests" */
export type AccessRequestsMutationResponse = {
  __typename?: 'access_requests_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<AccessRequests>;
};

/** on_conflict condition type for table "access_requests" */
export type AccessRequestsOnConflict = {
  constraint: AccessRequestsConstraint;
  update_columns?: Array<AccessRequestsUpdateColumn>;
  where?: InputMaybe<AccessRequestsBoolExp>;
};

/** Ordering options when selecting data from "access_requests". */
export type AccessRequestsOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  document?: InputMaybe<BlocksOrderBy>;
  document_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  owner?: InputMaybe<UsersOrderBy>;
  owner_id?: InputMaybe<OrderBy>;
  permission_type?: InputMaybe<OrderBy>;
  requester?: InputMaybe<UsersOrderBy>;
  requester_id?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: access_requests */
export type AccessRequestsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "access_requests" */
export enum AccessRequestsSelectColumn {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DocumentId = 'document_id',
  /** column name */
  Id = 'id',
  /** column name */
  Message = 'message',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PermissionType = 'permission_type',
  /** column name */
  RequesterId = 'requester_id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "access_requests" */
export type AccessRequestsSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  document_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['uuid']['input']>;
  permission_type?: InputMaybe<Scalars['String']['input']>;
  requester_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "access_requests" */
export type AccessRequestsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: AccessRequestsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type AccessRequestsStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  document_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['uuid']['input']>;
  permission_type?: InputMaybe<Scalars['String']['input']>;
  requester_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "access_requests" */
export enum AccessRequestsUpdateColumn {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DocumentId = 'document_id',
  /** column name */
  Id = 'id',
  /** column name */
  Message = 'message',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PermissionType = 'permission_type',
  /** column name */
  RequesterId = 'requester_id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type AccessRequestsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AccessRequestsSetInput>;
  /** filter the rows which have to be updated */
  where: AccessRequestsBoolExp;
};

/** columns and relationships of "block_comments" */
export type BlockComments = {
  __typename?: 'block_comments';
  /** An object relationship */
  block: Blocks;
  block_id: Scalars['uuid']['output'];
  content: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  user: Users;
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "block_comments" */
export type BlockCommentsAggregate = {
  __typename?: 'block_comments_aggregate';
  aggregate?: Maybe<BlockCommentsAggregateFields>;
  nodes: Array<BlockComments>;
};

export type BlockCommentsAggregateBoolExp = {
  count?: InputMaybe<BlockCommentsAggregateBoolExpCount>;
};

export type BlockCommentsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BlockCommentsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "block_comments" */
export type BlockCommentsAggregateFields = {
  __typename?: 'block_comments_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<BlockCommentsMaxFields>;
  min?: Maybe<BlockCommentsMinFields>;
};


/** aggregate fields of "block_comments" */
export type BlockCommentsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "block_comments" */
export type BlockCommentsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BlockCommentsMaxOrderBy>;
  min?: InputMaybe<BlockCommentsMinOrderBy>;
};

/** input type for inserting array relation for remote table "block_comments" */
export type BlockCommentsArrRelInsertInput = {
  data: Array<BlockCommentsInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BlockCommentsOnConflict>;
};

/** Boolean expression to filter rows from the table "block_comments". All fields are combined with a logical 'AND'. */
export type BlockCommentsBoolExp = {
  _and?: InputMaybe<Array<BlockCommentsBoolExp>>;
  _not?: InputMaybe<BlockCommentsBoolExp>;
  _or?: InputMaybe<Array<BlockCommentsBoolExp>>;
  block?: InputMaybe<BlocksBoolExp>;
  block_id?: InputMaybe<UuidComparisonExp>;
  content?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "block_comments" */
export enum BlockCommentsConstraint {
  /** unique or primary key constraint on columns "id" */
  BlockCommentsPkey = 'block_comments_pkey'
}

/** input type for inserting data into table "block_comments" */
export type BlockCommentsInsertInput = {
  block?: InputMaybe<BlocksObjRelInsertInput>;
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type BlockCommentsMaxFields = {
  __typename?: 'block_comments_max_fields';
  block_id?: Maybe<Scalars['uuid']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "block_comments" */
export type BlockCommentsMaxOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  content?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BlockCommentsMinFields = {
  __typename?: 'block_comments_min_fields';
  block_id?: Maybe<Scalars['uuid']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "block_comments" */
export type BlockCommentsMinOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  content?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "block_comments" */
export type BlockCommentsMutationResponse = {
  __typename?: 'block_comments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BlockComments>;
};

/** on_conflict condition type for table "block_comments" */
export type BlockCommentsOnConflict = {
  constraint: BlockCommentsConstraint;
  update_columns?: Array<BlockCommentsUpdateColumn>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};

/** Ordering options when selecting data from "block_comments". */
export type BlockCommentsOrderBy = {
  block?: InputMaybe<BlocksOrderBy>;
  block_id?: InputMaybe<OrderBy>;
  content?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: block_comments */
export type BlockCommentsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "block_comments" */
export enum BlockCommentsSelectColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "block_comments" */
export type BlockCommentsSetInput = {
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "block_comments" */
export type BlockCommentsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BlockCommentsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BlockCommentsStreamCursorValueInput = {
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "block_comments" */
export enum BlockCommentsUpdateColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UserId = 'user_id'
}

export type BlockCommentsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BlockCommentsSetInput>;
  /** filter the rows which have to be updated */
  where: BlockCommentsBoolExp;
};

/** columns and relationships of "block_links" */
export type BlockLinks = {
  __typename?: 'block_links';
  /** An object relationship */
  from_block: Blocks;
  from_block_id: Scalars['uuid']['output'];
  /** An object relationship */
  to_block: Blocks;
  to_block_id: Scalars['uuid']['output'];
};

/** aggregated selection of "block_links" */
export type BlockLinksAggregate = {
  __typename?: 'block_links_aggregate';
  aggregate?: Maybe<BlockLinksAggregateFields>;
  nodes: Array<BlockLinks>;
};

export type BlockLinksAggregateBoolExp = {
  count?: InputMaybe<BlockLinksAggregateBoolExpCount>;
};

export type BlockLinksAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BlockLinksSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BlockLinksBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "block_links" */
export type BlockLinksAggregateFields = {
  __typename?: 'block_links_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<BlockLinksMaxFields>;
  min?: Maybe<BlockLinksMinFields>;
};


/** aggregate fields of "block_links" */
export type BlockLinksAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BlockLinksSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "block_links" */
export type BlockLinksAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BlockLinksMaxOrderBy>;
  min?: InputMaybe<BlockLinksMinOrderBy>;
};

/** input type for inserting array relation for remote table "block_links" */
export type BlockLinksArrRelInsertInput = {
  data: Array<BlockLinksInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BlockLinksOnConflict>;
};

/** Boolean expression to filter rows from the table "block_links". All fields are combined with a logical 'AND'. */
export type BlockLinksBoolExp = {
  _and?: InputMaybe<Array<BlockLinksBoolExp>>;
  _not?: InputMaybe<BlockLinksBoolExp>;
  _or?: InputMaybe<Array<BlockLinksBoolExp>>;
  from_block?: InputMaybe<BlocksBoolExp>;
  from_block_id?: InputMaybe<UuidComparisonExp>;
  to_block?: InputMaybe<BlocksBoolExp>;
  to_block_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "block_links" */
export enum BlockLinksConstraint {
  /** unique or primary key constraint on columns "from_block_id", "to_block_id" */
  BlockLinksPkey = 'block_links_pkey'
}

/** input type for inserting data into table "block_links" */
export type BlockLinksInsertInput = {
  from_block?: InputMaybe<BlocksObjRelInsertInput>;
  from_block_id?: InputMaybe<Scalars['uuid']['input']>;
  to_block?: InputMaybe<BlocksObjRelInsertInput>;
  to_block_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type BlockLinksMaxFields = {
  __typename?: 'block_links_max_fields';
  from_block_id?: Maybe<Scalars['uuid']['output']>;
  to_block_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "block_links" */
export type BlockLinksMaxOrderBy = {
  from_block_id?: InputMaybe<OrderBy>;
  to_block_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BlockLinksMinFields = {
  __typename?: 'block_links_min_fields';
  from_block_id?: Maybe<Scalars['uuid']['output']>;
  to_block_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "block_links" */
export type BlockLinksMinOrderBy = {
  from_block_id?: InputMaybe<OrderBy>;
  to_block_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "block_links" */
export type BlockLinksMutationResponse = {
  __typename?: 'block_links_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BlockLinks>;
};

/** on_conflict condition type for table "block_links" */
export type BlockLinksOnConflict = {
  constraint: BlockLinksConstraint;
  update_columns?: Array<BlockLinksUpdateColumn>;
  where?: InputMaybe<BlockLinksBoolExp>;
};

/** Ordering options when selecting data from "block_links". */
export type BlockLinksOrderBy = {
  from_block?: InputMaybe<BlocksOrderBy>;
  from_block_id?: InputMaybe<OrderBy>;
  to_block?: InputMaybe<BlocksOrderBy>;
  to_block_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: block_links */
export type BlockLinksPkColumnsInput = {
  from_block_id: Scalars['uuid']['input'];
  to_block_id: Scalars['uuid']['input'];
};

/** select columns of table "block_links" */
export enum BlockLinksSelectColumn {
  /** column name */
  FromBlockId = 'from_block_id',
  /** column name */
  ToBlockId = 'to_block_id'
}

/** input type for updating data in table "block_links" */
export type BlockLinksSetInput = {
  from_block_id?: InputMaybe<Scalars['uuid']['input']>;
  to_block_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "block_links" */
export type BlockLinksStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BlockLinksStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BlockLinksStreamCursorValueInput = {
  from_block_id?: InputMaybe<Scalars['uuid']['input']>;
  to_block_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "block_links" */
export enum BlockLinksUpdateColumn {
  /** column name */
  FromBlockId = 'from_block_id',
  /** column name */
  ToBlockId = 'to_block_id'
}

export type BlockLinksUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BlockLinksSetInput>;
  /** filter the rows which have to be updated */
  where: BlockLinksBoolExp;
};

/** columns and relationships of "block_reactions" */
export type BlockReactions = {
  __typename?: 'block_reactions';
  /** An object relationship */
  block: Blocks;
  block_id: Scalars['uuid']['output'];
  created_at: Scalars['timestamptz']['output'];
  emoji: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  user: Users;
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "block_reactions" */
export type BlockReactionsAggregate = {
  __typename?: 'block_reactions_aggregate';
  aggregate?: Maybe<BlockReactionsAggregateFields>;
  nodes: Array<BlockReactions>;
};

export type BlockReactionsAggregateBoolExp = {
  count?: InputMaybe<BlockReactionsAggregateBoolExpCount>;
};

export type BlockReactionsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BlockReactionsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "block_reactions" */
export type BlockReactionsAggregateFields = {
  __typename?: 'block_reactions_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<BlockReactionsMaxFields>;
  min?: Maybe<BlockReactionsMinFields>;
};


/** aggregate fields of "block_reactions" */
export type BlockReactionsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "block_reactions" */
export type BlockReactionsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BlockReactionsMaxOrderBy>;
  min?: InputMaybe<BlockReactionsMinOrderBy>;
};

/** input type for inserting array relation for remote table "block_reactions" */
export type BlockReactionsArrRelInsertInput = {
  data: Array<BlockReactionsInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BlockReactionsOnConflict>;
};

/** Boolean expression to filter rows from the table "block_reactions". All fields are combined with a logical 'AND'. */
export type BlockReactionsBoolExp = {
  _and?: InputMaybe<Array<BlockReactionsBoolExp>>;
  _not?: InputMaybe<BlockReactionsBoolExp>;
  _or?: InputMaybe<Array<BlockReactionsBoolExp>>;
  block?: InputMaybe<BlocksBoolExp>;
  block_id?: InputMaybe<UuidComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  emoji?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "block_reactions" */
export enum BlockReactionsConstraint {
  /** unique or primary key constraint on columns "user_id", "emoji", "block_id" */
  BlockReactionsBlockIdUserIdEmojiKey = 'block_reactions_block_id_user_id_emoji_key',
  /** unique or primary key constraint on columns "id" */
  BlockReactionsPkey = 'block_reactions_pkey'
}

/** input type for inserting data into table "block_reactions" */
export type BlockReactionsInsertInput = {
  block?: InputMaybe<BlocksObjRelInsertInput>;
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type BlockReactionsMaxFields = {
  __typename?: 'block_reactions_max_fields';
  block_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  emoji?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "block_reactions" */
export type BlockReactionsMaxOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  emoji?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BlockReactionsMinFields = {
  __typename?: 'block_reactions_min_fields';
  block_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  emoji?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "block_reactions" */
export type BlockReactionsMinOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  emoji?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "block_reactions" */
export type BlockReactionsMutationResponse = {
  __typename?: 'block_reactions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BlockReactions>;
};

/** on_conflict condition type for table "block_reactions" */
export type BlockReactionsOnConflict = {
  constraint: BlockReactionsConstraint;
  update_columns?: Array<BlockReactionsUpdateColumn>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};

/** Ordering options when selecting data from "block_reactions". */
export type BlockReactionsOrderBy = {
  block?: InputMaybe<BlocksOrderBy>;
  block_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  emoji?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: block_reactions */
export type BlockReactionsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "block_reactions" */
export enum BlockReactionsSelectColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Emoji = 'emoji',
  /** column name */
  Id = 'id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "block_reactions" */
export type BlockReactionsSetInput = {
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "block_reactions" */
export type BlockReactionsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BlockReactionsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BlockReactionsStreamCursorValueInput = {
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "block_reactions" */
export enum BlockReactionsUpdateColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Emoji = 'emoji',
  /** column name */
  Id = 'id',
  /** column name */
  UserId = 'user_id'
}

export type BlockReactionsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BlockReactionsSetInput>;
  /** filter the rows which have to be updated */
  where: BlockReactionsBoolExp;
};

/** columns and relationships of "block_tags" */
export type BlockTags = {
  __typename?: 'block_tags';
  /** An object relationship */
  block: Blocks;
  block_id: Scalars['uuid']['output'];
  /** An object relationship */
  tag: Tags;
  tag_id: Scalars['uuid']['output'];
};

/** aggregated selection of "block_tags" */
export type BlockTagsAggregate = {
  __typename?: 'block_tags_aggregate';
  aggregate?: Maybe<BlockTagsAggregateFields>;
  nodes: Array<BlockTags>;
};

export type BlockTagsAggregateBoolExp = {
  count?: InputMaybe<BlockTagsAggregateBoolExpCount>;
};

export type BlockTagsAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BlockTagsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BlockTagsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "block_tags" */
export type BlockTagsAggregateFields = {
  __typename?: 'block_tags_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<BlockTagsMaxFields>;
  min?: Maybe<BlockTagsMinFields>;
};


/** aggregate fields of "block_tags" */
export type BlockTagsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BlockTagsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "block_tags" */
export type BlockTagsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BlockTagsMaxOrderBy>;
  min?: InputMaybe<BlockTagsMinOrderBy>;
};

/** input type for inserting array relation for remote table "block_tags" */
export type BlockTagsArrRelInsertInput = {
  data: Array<BlockTagsInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BlockTagsOnConflict>;
};

/** Boolean expression to filter rows from the table "block_tags". All fields are combined with a logical 'AND'. */
export type BlockTagsBoolExp = {
  _and?: InputMaybe<Array<BlockTagsBoolExp>>;
  _not?: InputMaybe<BlockTagsBoolExp>;
  _or?: InputMaybe<Array<BlockTagsBoolExp>>;
  block?: InputMaybe<BlocksBoolExp>;
  block_id?: InputMaybe<UuidComparisonExp>;
  tag?: InputMaybe<TagsBoolExp>;
  tag_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "block_tags" */
export enum BlockTagsConstraint {
  /** unique or primary key constraint on columns "tag_id", "block_id" */
  BlockTagsPkey = 'block_tags_pkey'
}

/** input type for inserting data into table "block_tags" */
export type BlockTagsInsertInput = {
  block?: InputMaybe<BlocksObjRelInsertInput>;
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  tag?: InputMaybe<TagsObjRelInsertInput>;
  tag_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type BlockTagsMaxFields = {
  __typename?: 'block_tags_max_fields';
  block_id?: Maybe<Scalars['uuid']['output']>;
  tag_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "block_tags" */
export type BlockTagsMaxOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  tag_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BlockTagsMinFields = {
  __typename?: 'block_tags_min_fields';
  block_id?: Maybe<Scalars['uuid']['output']>;
  tag_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "block_tags" */
export type BlockTagsMinOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  tag_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "block_tags" */
export type BlockTagsMutationResponse = {
  __typename?: 'block_tags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BlockTags>;
};

/** on_conflict condition type for table "block_tags" */
export type BlockTagsOnConflict = {
  constraint: BlockTagsConstraint;
  update_columns?: Array<BlockTagsUpdateColumn>;
  where?: InputMaybe<BlockTagsBoolExp>;
};

/** Ordering options when selecting data from "block_tags". */
export type BlockTagsOrderBy = {
  block?: InputMaybe<BlocksOrderBy>;
  block_id?: InputMaybe<OrderBy>;
  tag?: InputMaybe<TagsOrderBy>;
  tag_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: block_tags */
export type BlockTagsPkColumnsInput = {
  block_id: Scalars['uuid']['input'];
  tag_id: Scalars['uuid']['input'];
};

/** select columns of table "block_tags" */
export enum BlockTagsSelectColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  TagId = 'tag_id'
}

/** input type for updating data in table "block_tags" */
export type BlockTagsSetInput = {
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  tag_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "block_tags" */
export type BlockTagsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BlockTagsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BlockTagsStreamCursorValueInput = {
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  tag_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "block_tags" */
export enum BlockTagsUpdateColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  TagId = 'tag_id'
}

export type BlockTagsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BlockTagsSetInput>;
  /** filter the rows which have to be updated */
  where: BlockTagsBoolExp;
};

/** columns and relationships of "blocks" */
export type Blocks = {
  __typename?: 'blocks';
  /** An array relationship */
  access_requests: Array<AccessRequests>;
  /** An aggregate relationship */
  access_requests_aggregate: AccessRequestsAggregate;
  /** An array relationship */
  block_links_from: Array<BlockLinks>;
  /** An aggregate relationship */
  block_links_from_aggregate: BlockLinksAggregate;
  /** An array relationship */
  block_links_to: Array<BlockLinks>;
  /** An aggregate relationship */
  block_links_to_aggregate: BlockLinksAggregate;
  /** An array relationship */
  block_tags: Array<BlockTags>;
  /** An aggregate relationship */
  block_tags_aggregate: BlockTagsAggregate;
  /** An array relationship */
  children: Array<Blocks>;
  /** An aggregate relationship */
  children_aggregate: BlocksAggregate;
  /** An array relationship */
  comments: Array<BlockComments>;
  /** An aggregate relationship */
  comments_aggregate: BlockCommentsAggregate;
  content?: Maybe<Scalars['jsonb']['output']>;
  cover_image?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timetz']['output']>;
  /** An object relationship */
  folder?: Maybe<Folders>;
  folder_id?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  /** An object relationship */
  link_access?: Maybe<DocumentLinkAccess>;
  /** An object relationship */
  page?: Maybe<Blocks>;
  page_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  parent_block?: Maybe<Blocks>;
  parent_id?: Maybe<Scalars['uuid']['output']>;
  position?: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  reactions: Array<BlockReactions>;
  /** An aggregate relationship */
  reactions_aggregate: BlockReactionsAggregate;
  search_text?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  sub_blocks: Array<Blocks>;
  /** An aggregate relationship */
  sub_blocks_aggregate: BlocksAggregate;
  /** An array relationship */
  tasks: Array<Tasks>;
  /** An aggregate relationship */
  tasks_aggregate: TasksAggregate;
  type: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  workspace?: Maybe<Workspaces>;
  workspace_id?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "blocks" */
export type BlocksAccessRequestsArgs = {
  distinct_on?: InputMaybe<Array<AccessRequestsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccessRequestsOrderBy>>;
  where?: InputMaybe<AccessRequestsBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksAccessRequestsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccessRequestsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccessRequestsOrderBy>>;
  where?: InputMaybe<AccessRequestsBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksBlockLinksFromArgs = {
  distinct_on?: InputMaybe<Array<BlockLinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockLinksOrderBy>>;
  where?: InputMaybe<BlockLinksBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksBlockLinksFromAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockLinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockLinksOrderBy>>;
  where?: InputMaybe<BlockLinksBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksBlockLinksToArgs = {
  distinct_on?: InputMaybe<Array<BlockLinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockLinksOrderBy>>;
  where?: InputMaybe<BlockLinksBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksBlockLinksToAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockLinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockLinksOrderBy>>;
  where?: InputMaybe<BlockLinksBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksBlockTagsArgs = {
  distinct_on?: InputMaybe<Array<BlockTagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockTagsOrderBy>>;
  where?: InputMaybe<BlockTagsBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksBlockTagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockTagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockTagsOrderBy>>;
  where?: InputMaybe<BlockTagsBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksChildrenArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksChildrenAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksCommentsArgs = {
  distinct_on?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockCommentsOrderBy>>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksCommentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockCommentsOrderBy>>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksContentArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "blocks" */
export type BlocksReactionsArgs = {
  distinct_on?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockReactionsOrderBy>>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksReactionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockReactionsOrderBy>>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksSubBlocksArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksSubBlocksAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksTasksArgs = {
  distinct_on?: InputMaybe<Array<TasksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TasksOrderBy>>;
  where?: InputMaybe<TasksBoolExp>;
};


/** columns and relationships of "blocks" */
export type BlocksTasksAggregateArgs = {
  distinct_on?: InputMaybe<Array<TasksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TasksOrderBy>>;
  where?: InputMaybe<TasksBoolExp>;
};

/** aggregated selection of "blocks" */
export type BlocksAggregate = {
  __typename?: 'blocks_aggregate';
  aggregate?: Maybe<BlocksAggregateFields>;
  nodes: Array<Blocks>;
};

export type BlocksAggregateBoolExp = {
  count?: InputMaybe<BlocksAggregateBoolExpCount>;
};

export type BlocksAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BlocksSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BlocksBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "blocks" */
export type BlocksAggregateFields = {
  __typename?: 'blocks_aggregate_fields';
  avg?: Maybe<BlocksAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<BlocksMaxFields>;
  min?: Maybe<BlocksMinFields>;
  stddev?: Maybe<BlocksStddevFields>;
  stddev_pop?: Maybe<BlocksStddevPopFields>;
  stddev_samp?: Maybe<BlocksStddevSampFields>;
  sum?: Maybe<BlocksSumFields>;
  var_pop?: Maybe<BlocksVarPopFields>;
  var_samp?: Maybe<BlocksVarSampFields>;
  variance?: Maybe<BlocksVarianceFields>;
};


/** aggregate fields of "blocks" */
export type BlocksAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BlocksSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "blocks" */
export type BlocksAggregateOrderBy = {
  avg?: InputMaybe<BlocksAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BlocksMaxOrderBy>;
  min?: InputMaybe<BlocksMinOrderBy>;
  stddev?: InputMaybe<BlocksStddevOrderBy>;
  stddev_pop?: InputMaybe<BlocksStddevPopOrderBy>;
  stddev_samp?: InputMaybe<BlocksStddevSampOrderBy>;
  sum?: InputMaybe<BlocksSumOrderBy>;
  var_pop?: InputMaybe<BlocksVarPopOrderBy>;
  var_samp?: InputMaybe<BlocksVarSampOrderBy>;
  variance?: InputMaybe<BlocksVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type BlocksAppendInput = {
  content?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "blocks" */
export type BlocksArrRelInsertInput = {
  data: Array<BlocksInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<BlocksOnConflict>;
};

/** aggregate avg on columns */
export type BlocksAvgFields = {
  __typename?: 'blocks_avg_fields';
  position?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "blocks" */
export type BlocksAvgOrderBy = {
  position?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "blocks". All fields are combined with a logical 'AND'. */
export type BlocksBoolExp = {
  _and?: InputMaybe<Array<BlocksBoolExp>>;
  _not?: InputMaybe<BlocksBoolExp>;
  _or?: InputMaybe<Array<BlocksBoolExp>>;
  access_requests?: InputMaybe<AccessRequestsBoolExp>;
  access_requests_aggregate?: InputMaybe<AccessRequestsAggregateBoolExp>;
  block_links_from?: InputMaybe<BlockLinksBoolExp>;
  block_links_from_aggregate?: InputMaybe<BlockLinksAggregateBoolExp>;
  block_links_to?: InputMaybe<BlockLinksBoolExp>;
  block_links_to_aggregate?: InputMaybe<BlockLinksAggregateBoolExp>;
  block_tags?: InputMaybe<BlockTagsBoolExp>;
  block_tags_aggregate?: InputMaybe<BlockTagsAggregateBoolExp>;
  children?: InputMaybe<BlocksBoolExp>;
  children_aggregate?: InputMaybe<BlocksAggregateBoolExp>;
  comments?: InputMaybe<BlockCommentsBoolExp>;
  comments_aggregate?: InputMaybe<BlockCommentsAggregateBoolExp>;
  content?: InputMaybe<JsonbComparisonExp>;
  cover_image?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  deleted_at?: InputMaybe<TimetzComparisonExp>;
  folder?: InputMaybe<FoldersBoolExp>;
  folder_id?: InputMaybe<UuidComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  link_access?: InputMaybe<DocumentLinkAccessBoolExp>;
  page?: InputMaybe<BlocksBoolExp>;
  page_id?: InputMaybe<UuidComparisonExp>;
  parent_block?: InputMaybe<BlocksBoolExp>;
  parent_id?: InputMaybe<UuidComparisonExp>;
  position?: InputMaybe<IntComparisonExp>;
  reactions?: InputMaybe<BlockReactionsBoolExp>;
  reactions_aggregate?: InputMaybe<BlockReactionsAggregateBoolExp>;
  search_text?: InputMaybe<StringComparisonExp>;
  sub_blocks?: InputMaybe<BlocksBoolExp>;
  sub_blocks_aggregate?: InputMaybe<BlocksAggregateBoolExp>;
  tasks?: InputMaybe<TasksBoolExp>;
  tasks_aggregate?: InputMaybe<TasksAggregateBoolExp>;
  type?: InputMaybe<StringComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
  workspace?: InputMaybe<WorkspacesBoolExp>;
  workspace_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "blocks" */
export enum BlocksConstraint {
  /** unique or primary key constraint on columns "id" */
  BlocksPkey = 'blocks_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type BlocksDeleteAtPathInput = {
  content?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type BlocksDeleteElemInput = {
  content?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type BlocksDeleteKeyInput = {
  content?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "blocks" */
export type BlocksIncInput = {
  position?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "blocks" */
export type BlocksInsertInput = {
  access_requests?: InputMaybe<AccessRequestsArrRelInsertInput>;
  block_links_from?: InputMaybe<BlockLinksArrRelInsertInput>;
  block_links_to?: InputMaybe<BlockLinksArrRelInsertInput>;
  block_tags?: InputMaybe<BlockTagsArrRelInsertInput>;
  children?: InputMaybe<BlocksArrRelInsertInput>;
  comments?: InputMaybe<BlockCommentsArrRelInsertInput>;
  content?: InputMaybe<Scalars['jsonb']['input']>;
  cover_image?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deleted_at?: InputMaybe<Scalars['timetz']['input']>;
  folder?: InputMaybe<FoldersObjRelInsertInput>;
  folder_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  link_access?: InputMaybe<DocumentLinkAccessObjRelInsertInput>;
  page?: InputMaybe<BlocksObjRelInsertInput>;
  page_id?: InputMaybe<Scalars['uuid']['input']>;
  parent_block?: InputMaybe<BlocksObjRelInsertInput>;
  parent_id?: InputMaybe<Scalars['uuid']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  reactions?: InputMaybe<BlockReactionsArrRelInsertInput>;
  sub_blocks?: InputMaybe<BlocksArrRelInsertInput>;
  tasks?: InputMaybe<TasksArrRelInsertInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  workspace?: InputMaybe<WorkspacesObjRelInsertInput>;
  workspace_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type BlocksMaxFields = {
  __typename?: 'blocks_max_fields';
  cover_image?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timetz']['output']>;
  folder_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  page_id?: Maybe<Scalars['uuid']['output']>;
  parent_id?: Maybe<Scalars['uuid']['output']>;
  position?: Maybe<Scalars['Int']['output']>;
  search_text?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  workspace_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "blocks" */
export type BlocksMaxOrderBy = {
  cover_image?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  deleted_at?: InputMaybe<OrderBy>;
  folder_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  page_id?: InputMaybe<OrderBy>;
  parent_id?: InputMaybe<OrderBy>;
  position?: InputMaybe<OrderBy>;
  search_text?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
  workspace_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BlocksMinFields = {
  __typename?: 'blocks_min_fields';
  cover_image?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timetz']['output']>;
  folder_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  page_id?: Maybe<Scalars['uuid']['output']>;
  parent_id?: Maybe<Scalars['uuid']['output']>;
  position?: Maybe<Scalars['Int']['output']>;
  search_text?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  workspace_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "blocks" */
export type BlocksMinOrderBy = {
  cover_image?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  deleted_at?: InputMaybe<OrderBy>;
  folder_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  page_id?: InputMaybe<OrderBy>;
  parent_id?: InputMaybe<OrderBy>;
  position?: InputMaybe<OrderBy>;
  search_text?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
  workspace_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "blocks" */
export type BlocksMutationResponse = {
  __typename?: 'blocks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Blocks>;
};

/** input type for inserting object relation for remote table "blocks" */
export type BlocksObjRelInsertInput = {
  data: BlocksInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<BlocksOnConflict>;
};

/** on_conflict condition type for table "blocks" */
export type BlocksOnConflict = {
  constraint: BlocksConstraint;
  update_columns?: Array<BlocksUpdateColumn>;
  where?: InputMaybe<BlocksBoolExp>;
};

/** Ordering options when selecting data from "blocks". */
export type BlocksOrderBy = {
  access_requests_aggregate?: InputMaybe<AccessRequestsAggregateOrderBy>;
  block_links_from_aggregate?: InputMaybe<BlockLinksAggregateOrderBy>;
  block_links_to_aggregate?: InputMaybe<BlockLinksAggregateOrderBy>;
  block_tags_aggregate?: InputMaybe<BlockTagsAggregateOrderBy>;
  children_aggregate?: InputMaybe<BlocksAggregateOrderBy>;
  comments_aggregate?: InputMaybe<BlockCommentsAggregateOrderBy>;
  content?: InputMaybe<OrderBy>;
  cover_image?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  deleted_at?: InputMaybe<OrderBy>;
  folder?: InputMaybe<FoldersOrderBy>;
  folder_id?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  link_access?: InputMaybe<DocumentLinkAccessOrderBy>;
  page?: InputMaybe<BlocksOrderBy>;
  page_id?: InputMaybe<OrderBy>;
  parent_block?: InputMaybe<BlocksOrderBy>;
  parent_id?: InputMaybe<OrderBy>;
  position?: InputMaybe<OrderBy>;
  reactions_aggregate?: InputMaybe<BlockReactionsAggregateOrderBy>;
  search_text?: InputMaybe<OrderBy>;
  sub_blocks_aggregate?: InputMaybe<BlocksAggregateOrderBy>;
  tasks_aggregate?: InputMaybe<TasksAggregateOrderBy>;
  type?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
  workspace?: InputMaybe<WorkspacesOrderBy>;
  workspace_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: blocks */
export type BlocksPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type BlocksPrependInput = {
  content?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "blocks" */
export enum BlocksSelectColumn {
  /** column name */
  Content = 'content',
  /** column name */
  CoverImage = 'cover_image',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  FolderId = 'folder_id',
  /** column name */
  Id = 'id',
  /** column name */
  PageId = 'page_id',
  /** column name */
  ParentId = 'parent_id',
  /** column name */
  Position = 'position',
  /** column name */
  SearchText = 'search_text',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id',
  /** column name */
  WorkspaceId = 'workspace_id'
}

/** input type for updating data in table "blocks" */
export type BlocksSetInput = {
  content?: InputMaybe<Scalars['jsonb']['input']>;
  cover_image?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deleted_at?: InputMaybe<Scalars['timetz']['input']>;
  folder_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  page_id?: InputMaybe<Scalars['uuid']['input']>;
  parent_id?: InputMaybe<Scalars['uuid']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  workspace_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type BlocksStddevFields = {
  __typename?: 'blocks_stddev_fields';
  position?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "blocks" */
export type BlocksStddevOrderBy = {
  position?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BlocksStddevPopFields = {
  __typename?: 'blocks_stddev_pop_fields';
  position?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "blocks" */
export type BlocksStddevPopOrderBy = {
  position?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BlocksStddevSampFields = {
  __typename?: 'blocks_stddev_samp_fields';
  position?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "blocks" */
export type BlocksStddevSampOrderBy = {
  position?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "blocks" */
export type BlocksStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BlocksStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BlocksStreamCursorValueInput = {
  content?: InputMaybe<Scalars['jsonb']['input']>;
  cover_image?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deleted_at?: InputMaybe<Scalars['timetz']['input']>;
  folder_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  page_id?: InputMaybe<Scalars['uuid']['input']>;
  parent_id?: InputMaybe<Scalars['uuid']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  search_text?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  workspace_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type BlocksSumFields = {
  __typename?: 'blocks_sum_fields';
  position?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "blocks" */
export type BlocksSumOrderBy = {
  position?: InputMaybe<OrderBy>;
};

/** update columns of table "blocks" */
export enum BlocksUpdateColumn {
  /** column name */
  Content = 'content',
  /** column name */
  CoverImage = 'cover_image',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  FolderId = 'folder_id',
  /** column name */
  Id = 'id',
  /** column name */
  PageId = 'page_id',
  /** column name */
  ParentId = 'parent_id',
  /** column name */
  Position = 'position',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id',
  /** column name */
  WorkspaceId = 'workspace_id'
}

export type BlocksUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<BlocksAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<BlocksDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<BlocksDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<BlocksDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BlocksIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<BlocksPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BlocksSetInput>;
  /** filter the rows which have to be updated */
  where: BlocksBoolExp;
};

/** aggregate var_pop on columns */
export type BlocksVarPopFields = {
  __typename?: 'blocks_var_pop_fields';
  position?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "blocks" */
export type BlocksVarPopOrderBy = {
  position?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BlocksVarSampFields = {
  __typename?: 'blocks_var_samp_fields';
  position?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "blocks" */
export type BlocksVarSampOrderBy = {
  position?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BlocksVarianceFields = {
  __typename?: 'blocks_variance_fields';
  position?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "blocks" */
export type BlocksVarianceOrderBy = {
  position?: InputMaybe<OrderBy>;
};

/** ordering argument of a cursor */
export enum CursorOrdering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type DateComparisonExp = {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

/** Controls access granted to authenticated users who have a document link. */
export type DocumentLinkAccess = {
  __typename?: 'document_link_access';
  created_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  document: Blocks;
  document_id: Scalars['uuid']['output'];
  /** restricted, read, or write */
  permission_type: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "document_link_access" */
export type DocumentLinkAccessAggregate = {
  __typename?: 'document_link_access_aggregate';
  aggregate?: Maybe<DocumentLinkAccessAggregateFields>;
  nodes: Array<DocumentLinkAccess>;
};

/** aggregate fields of "document_link_access" */
export type DocumentLinkAccessAggregateFields = {
  __typename?: 'document_link_access_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<DocumentLinkAccessMaxFields>;
  min?: Maybe<DocumentLinkAccessMinFields>;
};


/** aggregate fields of "document_link_access" */
export type DocumentLinkAccessAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<DocumentLinkAccessSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "document_link_access". All fields are combined with a logical 'AND'. */
export type DocumentLinkAccessBoolExp = {
  _and?: InputMaybe<Array<DocumentLinkAccessBoolExp>>;
  _not?: InputMaybe<DocumentLinkAccessBoolExp>;
  _or?: InputMaybe<Array<DocumentLinkAccessBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  document?: InputMaybe<BlocksBoolExp>;
  document_id?: InputMaybe<UuidComparisonExp>;
  permission_type?: InputMaybe<StringComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "document_link_access" */
export enum DocumentLinkAccessConstraint {
  /** unique or primary key constraint on columns "document_id" */
  DocumentLinkAccessPkey = 'document_link_access_pkey'
}

/** input type for inserting data into table "document_link_access" */
export type DocumentLinkAccessInsertInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  document?: InputMaybe<BlocksObjRelInsertInput>;
  document_id?: InputMaybe<Scalars['uuid']['input']>;
  /** restricted, read, or write */
  permission_type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type DocumentLinkAccessMaxFields = {
  __typename?: 'document_link_access_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  document_id?: Maybe<Scalars['uuid']['output']>;
  /** restricted, read, or write */
  permission_type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type DocumentLinkAccessMinFields = {
  __typename?: 'document_link_access_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  document_id?: Maybe<Scalars['uuid']['output']>;
  /** restricted, read, or write */
  permission_type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "document_link_access" */
export type DocumentLinkAccessMutationResponse = {
  __typename?: 'document_link_access_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<DocumentLinkAccess>;
};

/** input type for inserting object relation for remote table "document_link_access" */
export type DocumentLinkAccessObjRelInsertInput = {
  data: DocumentLinkAccessInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<DocumentLinkAccessOnConflict>;
};

/** on_conflict condition type for table "document_link_access" */
export type DocumentLinkAccessOnConflict = {
  constraint: DocumentLinkAccessConstraint;
  update_columns?: Array<DocumentLinkAccessUpdateColumn>;
  where?: InputMaybe<DocumentLinkAccessBoolExp>;
};

/** Ordering options when selecting data from "document_link_access". */
export type DocumentLinkAccessOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  document?: InputMaybe<BlocksOrderBy>;
  document_id?: InputMaybe<OrderBy>;
  permission_type?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: document_link_access */
export type DocumentLinkAccessPkColumnsInput = {
  document_id: Scalars['uuid']['input'];
};

/** select columns of table "document_link_access" */
export enum DocumentLinkAccessSelectColumn {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DocumentId = 'document_id',
  /** column name */
  PermissionType = 'permission_type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "document_link_access" */
export type DocumentLinkAccessSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  document_id?: InputMaybe<Scalars['uuid']['input']>;
  /** restricted, read, or write */
  permission_type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "document_link_access" */
export type DocumentLinkAccessStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: DocumentLinkAccessStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type DocumentLinkAccessStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  document_id?: InputMaybe<Scalars['uuid']['input']>;
  /** restricted, read, or write */
  permission_type?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "document_link_access" */
export enum DocumentLinkAccessUpdateColumn {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DocumentId = 'document_id',
  /** column name */
  PermissionType = 'permission_type',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type DocumentLinkAccessUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<DocumentLinkAccessSetInput>;
  /** filter the rows which have to be updated */
  where: DocumentLinkAccessBoolExp;
};

/** columns and relationships of "files" */
export type Files = {
  __typename?: 'files';
  id: Scalars['uuid']['output'];
  mime_type?: Maybe<Scalars['String']['output']>;
  uploaded_at?: Maybe<Scalars['timestamptz']['output']>;
  uploaded_by?: Maybe<Scalars['uuid']['output']>;
  url: Scalars['String']['output'];
  /** An object relationship */
  user?: Maybe<Users>;
};

/** aggregated selection of "files" */
export type FilesAggregate = {
  __typename?: 'files_aggregate';
  aggregate?: Maybe<FilesAggregateFields>;
  nodes: Array<Files>;
};

export type FilesAggregateBoolExp = {
  count?: InputMaybe<FilesAggregateBoolExpCount>;
};

export type FilesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<FilesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<FilesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "files" */
export type FilesAggregateFields = {
  __typename?: 'files_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<FilesMaxFields>;
  min?: Maybe<FilesMinFields>;
};


/** aggregate fields of "files" */
export type FilesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<FilesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "files" */
export type FilesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<FilesMaxOrderBy>;
  min?: InputMaybe<FilesMinOrderBy>;
};

/** input type for inserting array relation for remote table "files" */
export type FilesArrRelInsertInput = {
  data: Array<FilesInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<FilesOnConflict>;
};

/** Boolean expression to filter rows from the table "files". All fields are combined with a logical 'AND'. */
export type FilesBoolExp = {
  _and?: InputMaybe<Array<FilesBoolExp>>;
  _not?: InputMaybe<FilesBoolExp>;
  _or?: InputMaybe<Array<FilesBoolExp>>;
  id?: InputMaybe<UuidComparisonExp>;
  mime_type?: InputMaybe<StringComparisonExp>;
  uploaded_at?: InputMaybe<TimestamptzComparisonExp>;
  uploaded_by?: InputMaybe<UuidComparisonExp>;
  url?: InputMaybe<StringComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "files" */
export enum FilesConstraint {
  /** unique or primary key constraint on columns "id" */
  FilesPkey = 'files_pkey'
}

/** input type for inserting data into table "files" */
export type FilesInsertInput = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  mime_type?: InputMaybe<Scalars['String']['input']>;
  uploaded_at?: InputMaybe<Scalars['timestamptz']['input']>;
  uploaded_by?: InputMaybe<Scalars['uuid']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type FilesMaxFields = {
  __typename?: 'files_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  mime_type?: Maybe<Scalars['String']['output']>;
  uploaded_at?: Maybe<Scalars['timestamptz']['output']>;
  uploaded_by?: Maybe<Scalars['uuid']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "files" */
export type FilesMaxOrderBy = {
  id?: InputMaybe<OrderBy>;
  mime_type?: InputMaybe<OrderBy>;
  uploaded_at?: InputMaybe<OrderBy>;
  uploaded_by?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type FilesMinFields = {
  __typename?: 'files_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  mime_type?: Maybe<Scalars['String']['output']>;
  uploaded_at?: Maybe<Scalars['timestamptz']['output']>;
  uploaded_by?: Maybe<Scalars['uuid']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "files" */
export type FilesMinOrderBy = {
  id?: InputMaybe<OrderBy>;
  mime_type?: InputMaybe<OrderBy>;
  uploaded_at?: InputMaybe<OrderBy>;
  uploaded_by?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "files" */
export type FilesMutationResponse = {
  __typename?: 'files_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Files>;
};

/** on_conflict condition type for table "files" */
export type FilesOnConflict = {
  constraint: FilesConstraint;
  update_columns?: Array<FilesUpdateColumn>;
  where?: InputMaybe<FilesBoolExp>;
};

/** Ordering options when selecting data from "files". */
export type FilesOrderBy = {
  id?: InputMaybe<OrderBy>;
  mime_type?: InputMaybe<OrderBy>;
  uploaded_at?: InputMaybe<OrderBy>;
  uploaded_by?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: files */
export type FilesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "files" */
export enum FilesSelectColumn {
  /** column name */
  Id = 'id',
  /** column name */
  MimeType = 'mime_type',
  /** column name */
  UploadedAt = 'uploaded_at',
  /** column name */
  UploadedBy = 'uploaded_by',
  /** column name */
  Url = 'url'
}

/** input type for updating data in table "files" */
export type FilesSetInput = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  mime_type?: InputMaybe<Scalars['String']['input']>;
  uploaded_at?: InputMaybe<Scalars['timestamptz']['input']>;
  uploaded_by?: InputMaybe<Scalars['uuid']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "files" */
export type FilesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: FilesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FilesStreamCursorValueInput = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  mime_type?: InputMaybe<Scalars['String']['input']>;
  uploaded_at?: InputMaybe<Scalars['timestamptz']['input']>;
  uploaded_by?: InputMaybe<Scalars['uuid']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "files" */
export enum FilesUpdateColumn {
  /** column name */
  Id = 'id',
  /** column name */
  MimeType = 'mime_type',
  /** column name */
  UploadedAt = 'uploaded_at',
  /** column name */
  UploadedBy = 'uploaded_by',
  /** column name */
  Url = 'url'
}

export type FilesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<FilesSetInput>;
  /** filter the rows which have to be updated */
  where: FilesBoolExp;
};

/** columns and relationships of "folders" */
export type Folders = {
  __typename?: 'folders';
  /** An array relationship */
  blocks: Array<Blocks>;
  /** An aggregate relationship */
  blocks_aggregate: BlocksAggregate;
  /** An array relationship */
  children: Array<Folders>;
  /** An aggregate relationship */
  children_aggregate: FoldersAggregate;
  color?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  folder?: Maybe<Folders>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  parent_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  workspace?: Maybe<Workspaces>;
  workspace_id?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "folders" */
export type FoldersBlocksArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "folders" */
export type FoldersBlocksAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "folders" */
export type FoldersChildrenArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};


/** columns and relationships of "folders" */
export type FoldersChildrenAggregateArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};

/** aggregated selection of "folders" */
export type FoldersAggregate = {
  __typename?: 'folders_aggregate';
  aggregate?: Maybe<FoldersAggregateFields>;
  nodes: Array<Folders>;
};

export type FoldersAggregateBoolExp = {
  count?: InputMaybe<FoldersAggregateBoolExpCount>;
};

export type FoldersAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<FoldersSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<FoldersBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "folders" */
export type FoldersAggregateFields = {
  __typename?: 'folders_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<FoldersMaxFields>;
  min?: Maybe<FoldersMinFields>;
};


/** aggregate fields of "folders" */
export type FoldersAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<FoldersSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "folders" */
export type FoldersAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<FoldersMaxOrderBy>;
  min?: InputMaybe<FoldersMinOrderBy>;
};

/** input type for inserting array relation for remote table "folders" */
export type FoldersArrRelInsertInput = {
  data: Array<FoldersInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<FoldersOnConflict>;
};

/** Boolean expression to filter rows from the table "folders". All fields are combined with a logical 'AND'. */
export type FoldersBoolExp = {
  _and?: InputMaybe<Array<FoldersBoolExp>>;
  _not?: InputMaybe<FoldersBoolExp>;
  _or?: InputMaybe<Array<FoldersBoolExp>>;
  blocks?: InputMaybe<BlocksBoolExp>;
  blocks_aggregate?: InputMaybe<BlocksAggregateBoolExp>;
  children?: InputMaybe<FoldersBoolExp>;
  children_aggregate?: InputMaybe<FoldersAggregateBoolExp>;
  color?: InputMaybe<StringComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  description?: InputMaybe<StringComparisonExp>;
  folder?: InputMaybe<FoldersBoolExp>;
  icon?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  parent_id?: InputMaybe<UuidComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
  workspace?: InputMaybe<WorkspacesBoolExp>;
  workspace_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "folders" */
export enum FoldersConstraint {
  /** unique or primary key constraint on columns "id" */
  FoldersPkey = 'folders_pkey'
}

/** input type for inserting data into table "folders" */
export type FoldersInsertInput = {
  blocks?: InputMaybe<BlocksArrRelInsertInput>;
  children?: InputMaybe<FoldersArrRelInsertInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<FoldersObjRelInsertInput>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent_id?: InputMaybe<Scalars['uuid']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  workspace?: InputMaybe<WorkspacesObjRelInsertInput>;
  workspace_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type FoldersMaxFields = {
  __typename?: 'folders_max_fields';
  color?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parent_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  workspace_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "folders" */
export type FoldersMaxOrderBy = {
  color?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  icon?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  parent_id?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
  workspace_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type FoldersMinFields = {
  __typename?: 'folders_min_fields';
  color?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parent_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  workspace_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "folders" */
export type FoldersMinOrderBy = {
  color?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  icon?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  parent_id?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
  workspace_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "folders" */
export type FoldersMutationResponse = {
  __typename?: 'folders_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Folders>;
};

/** input type for inserting object relation for remote table "folders" */
export type FoldersObjRelInsertInput = {
  data: FoldersInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<FoldersOnConflict>;
};

/** on_conflict condition type for table "folders" */
export type FoldersOnConflict = {
  constraint: FoldersConstraint;
  update_columns?: Array<FoldersUpdateColumn>;
  where?: InputMaybe<FoldersBoolExp>;
};

/** Ordering options when selecting data from "folders". */
export type FoldersOrderBy = {
  blocks_aggregate?: InputMaybe<BlocksAggregateOrderBy>;
  children_aggregate?: InputMaybe<FoldersAggregateOrderBy>;
  color?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  folder?: InputMaybe<FoldersOrderBy>;
  icon?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  parent_id?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
  workspace?: InputMaybe<WorkspacesOrderBy>;
  workspace_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: folders */
export type FoldersPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "folders" */
export enum FoldersSelectColumn {
  /** column name */
  Color = 'color',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Icon = 'icon',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ParentId = 'parent_id',
  /** column name */
  UserId = 'user_id',
  /** column name */
  WorkspaceId = 'workspace_id'
}

/** input type for updating data in table "folders" */
export type FoldersSetInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  workspace_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "folders" */
export type FoldersStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: FoldersStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FoldersStreamCursorValueInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  workspace_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "folders" */
export enum FoldersUpdateColumn {
  /** column name */
  Color = 'color',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Icon = 'icon',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ParentId = 'parent_id',
  /** column name */
  UserId = 'user_id',
  /** column name */
  WorkspaceId = 'workspace_id'
}

export type FoldersUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<FoldersSetInput>;
  /** filter the rows which have to be updated */
  where: FoldersBoolExp;
};

export type JsonbCastExp = {
  String?: InputMaybe<StringComparisonExp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
  _cast?: InputMaybe<JsonbCastExp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** mutation root */
export type MutationRoot = {
  __typename?: 'mutation_root';
  /** delete data from the table: "access_requests" */
  delete_access_requests?: Maybe<AccessRequestsMutationResponse>;
  /** delete single row from the table: "access_requests" */
  delete_access_requests_by_pk?: Maybe<AccessRequests>;
  /** delete data from the table: "block_comments" */
  delete_block_comments?: Maybe<BlockCommentsMutationResponse>;
  /** delete single row from the table: "block_comments" */
  delete_block_comments_by_pk?: Maybe<BlockComments>;
  /** delete data from the table: "block_links" */
  delete_block_links?: Maybe<BlockLinksMutationResponse>;
  /** delete single row from the table: "block_links" */
  delete_block_links_by_pk?: Maybe<BlockLinks>;
  /** delete data from the table: "block_reactions" */
  delete_block_reactions?: Maybe<BlockReactionsMutationResponse>;
  /** delete single row from the table: "block_reactions" */
  delete_block_reactions_by_pk?: Maybe<BlockReactions>;
  /** delete data from the table: "block_tags" */
  delete_block_tags?: Maybe<BlockTagsMutationResponse>;
  /** delete single row from the table: "block_tags" */
  delete_block_tags_by_pk?: Maybe<BlockTags>;
  /** delete data from the table: "blocks" */
  delete_blocks?: Maybe<BlocksMutationResponse>;
  /** delete single row from the table: "blocks" */
  delete_blocks_by_pk?: Maybe<Blocks>;
  /** delete data from the table: "document_link_access" */
  delete_document_link_access?: Maybe<DocumentLinkAccessMutationResponse>;
  /** delete single row from the table: "document_link_access" */
  delete_document_link_access_by_pk?: Maybe<DocumentLinkAccess>;
  /** delete data from the table: "files" */
  delete_files?: Maybe<FilesMutationResponse>;
  /** delete single row from the table: "files" */
  delete_files_by_pk?: Maybe<Files>;
  /** delete data from the table: "folders" */
  delete_folders?: Maybe<FoldersMutationResponse>;
  /** delete single row from the table: "folders" */
  delete_folders_by_pk?: Maybe<Folders>;
  /** delete data from the table: "notifications" */
  delete_notifications?: Maybe<NotificationsMutationResponse>;
  /** delete single row from the table: "notifications" */
  delete_notifications_by_pk?: Maybe<Notifications>;
  /** delete data from the table: "tags" */
  delete_tags?: Maybe<TagsMutationResponse>;
  /** delete single row from the table: "tags" */
  delete_tags_by_pk?: Maybe<Tags>;
  /** delete data from the table: "tasks" */
  delete_tasks?: Maybe<TasksMutationResponse>;
  /** delete single row from the table: "tasks" */
  delete_tasks_by_pk?: Maybe<Tasks>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<UsersMutationResponse>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** delete data from the table: "workspaces" */
  delete_workspaces?: Maybe<WorkspacesMutationResponse>;
  /** delete single row from the table: "workspaces" */
  delete_workspaces_by_pk?: Maybe<Workspaces>;
  /** insert data into the table: "access_requests" */
  insert_access_requests?: Maybe<AccessRequestsMutationResponse>;
  /** insert a single row into the table: "access_requests" */
  insert_access_requests_one?: Maybe<AccessRequests>;
  /** insert data into the table: "block_comments" */
  insert_block_comments?: Maybe<BlockCommentsMutationResponse>;
  /** insert a single row into the table: "block_comments" */
  insert_block_comments_one?: Maybe<BlockComments>;
  /** insert data into the table: "block_links" */
  insert_block_links?: Maybe<BlockLinksMutationResponse>;
  /** insert a single row into the table: "block_links" */
  insert_block_links_one?: Maybe<BlockLinks>;
  /** insert data into the table: "block_reactions" */
  insert_block_reactions?: Maybe<BlockReactionsMutationResponse>;
  /** insert a single row into the table: "block_reactions" */
  insert_block_reactions_one?: Maybe<BlockReactions>;
  /** insert data into the table: "block_tags" */
  insert_block_tags?: Maybe<BlockTagsMutationResponse>;
  /** insert a single row into the table: "block_tags" */
  insert_block_tags_one?: Maybe<BlockTags>;
  /** insert data into the table: "blocks" */
  insert_blocks?: Maybe<BlocksMutationResponse>;
  /** insert a single row into the table: "blocks" */
  insert_blocks_one?: Maybe<Blocks>;
  /** insert data into the table: "document_link_access" */
  insert_document_link_access?: Maybe<DocumentLinkAccessMutationResponse>;
  /** insert a single row into the table: "document_link_access" */
  insert_document_link_access_one?: Maybe<DocumentLinkAccess>;
  /** insert data into the table: "files" */
  insert_files?: Maybe<FilesMutationResponse>;
  /** insert a single row into the table: "files" */
  insert_files_one?: Maybe<Files>;
  /** insert data into the table: "folders" */
  insert_folders?: Maybe<FoldersMutationResponse>;
  /** insert a single row into the table: "folders" */
  insert_folders_one?: Maybe<Folders>;
  /** insert data into the table: "notifications" */
  insert_notifications?: Maybe<NotificationsMutationResponse>;
  /** insert a single row into the table: "notifications" */
  insert_notifications_one?: Maybe<Notifications>;
  /** insert data into the table: "tags" */
  insert_tags?: Maybe<TagsMutationResponse>;
  /** insert a single row into the table: "tags" */
  insert_tags_one?: Maybe<Tags>;
  /** insert data into the table: "tasks" */
  insert_tasks?: Maybe<TasksMutationResponse>;
  /** insert a single row into the table: "tasks" */
  insert_tasks_one?: Maybe<Tasks>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<UsersMutationResponse>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** insert data into the table: "workspaces" */
  insert_workspaces?: Maybe<WorkspacesMutationResponse>;
  /** insert a single row into the table: "workspaces" */
  insert_workspaces_one?: Maybe<Workspaces>;
  /** update data of the table: "access_requests" */
  update_access_requests?: Maybe<AccessRequestsMutationResponse>;
  /** update single row of the table: "access_requests" */
  update_access_requests_by_pk?: Maybe<AccessRequests>;
  /** update multiples rows of table: "access_requests" */
  update_access_requests_many?: Maybe<Array<Maybe<AccessRequestsMutationResponse>>>;
  /** update data of the table: "block_comments" */
  update_block_comments?: Maybe<BlockCommentsMutationResponse>;
  /** update single row of the table: "block_comments" */
  update_block_comments_by_pk?: Maybe<BlockComments>;
  /** update multiples rows of table: "block_comments" */
  update_block_comments_many?: Maybe<Array<Maybe<BlockCommentsMutationResponse>>>;
  /** update data of the table: "block_links" */
  update_block_links?: Maybe<BlockLinksMutationResponse>;
  /** update single row of the table: "block_links" */
  update_block_links_by_pk?: Maybe<BlockLinks>;
  /** update multiples rows of table: "block_links" */
  update_block_links_many?: Maybe<Array<Maybe<BlockLinksMutationResponse>>>;
  /** update data of the table: "block_reactions" */
  update_block_reactions?: Maybe<BlockReactionsMutationResponse>;
  /** update single row of the table: "block_reactions" */
  update_block_reactions_by_pk?: Maybe<BlockReactions>;
  /** update multiples rows of table: "block_reactions" */
  update_block_reactions_many?: Maybe<Array<Maybe<BlockReactionsMutationResponse>>>;
  /** update data of the table: "block_tags" */
  update_block_tags?: Maybe<BlockTagsMutationResponse>;
  /** update single row of the table: "block_tags" */
  update_block_tags_by_pk?: Maybe<BlockTags>;
  /** update multiples rows of table: "block_tags" */
  update_block_tags_many?: Maybe<Array<Maybe<BlockTagsMutationResponse>>>;
  /** update data of the table: "blocks" */
  update_blocks?: Maybe<BlocksMutationResponse>;
  /** update single row of the table: "blocks" */
  update_blocks_by_pk?: Maybe<Blocks>;
  /** update multiples rows of table: "blocks" */
  update_blocks_many?: Maybe<Array<Maybe<BlocksMutationResponse>>>;
  /** update data of the table: "document_link_access" */
  update_document_link_access?: Maybe<DocumentLinkAccessMutationResponse>;
  /** update single row of the table: "document_link_access" */
  update_document_link_access_by_pk?: Maybe<DocumentLinkAccess>;
  /** update multiples rows of table: "document_link_access" */
  update_document_link_access_many?: Maybe<Array<Maybe<DocumentLinkAccessMutationResponse>>>;
  /** update data of the table: "files" */
  update_files?: Maybe<FilesMutationResponse>;
  /** update single row of the table: "files" */
  update_files_by_pk?: Maybe<Files>;
  /** update multiples rows of table: "files" */
  update_files_many?: Maybe<Array<Maybe<FilesMutationResponse>>>;
  /** update data of the table: "folders" */
  update_folders?: Maybe<FoldersMutationResponse>;
  /** update single row of the table: "folders" */
  update_folders_by_pk?: Maybe<Folders>;
  /** update multiples rows of table: "folders" */
  update_folders_many?: Maybe<Array<Maybe<FoldersMutationResponse>>>;
  /** update data of the table: "notifications" */
  update_notifications?: Maybe<NotificationsMutationResponse>;
  /** update single row of the table: "notifications" */
  update_notifications_by_pk?: Maybe<Notifications>;
  /** update multiples rows of table: "notifications" */
  update_notifications_many?: Maybe<Array<Maybe<NotificationsMutationResponse>>>;
  /** update data of the table: "tags" */
  update_tags?: Maybe<TagsMutationResponse>;
  /** update single row of the table: "tags" */
  update_tags_by_pk?: Maybe<Tags>;
  /** update multiples rows of table: "tags" */
  update_tags_many?: Maybe<Array<Maybe<TagsMutationResponse>>>;
  /** update data of the table: "tasks" */
  update_tasks?: Maybe<TasksMutationResponse>;
  /** update single row of the table: "tasks" */
  update_tasks_by_pk?: Maybe<Tasks>;
  /** update multiples rows of table: "tasks" */
  update_tasks_many?: Maybe<Array<Maybe<TasksMutationResponse>>>;
  /** update data of the table: "users" */
  update_users?: Maybe<UsersMutationResponse>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<UsersMutationResponse>>>;
  /** update data of the table: "workspaces" */
  update_workspaces?: Maybe<WorkspacesMutationResponse>;
  /** update single row of the table: "workspaces" */
  update_workspaces_by_pk?: Maybe<Workspaces>;
  /** update multiples rows of table: "workspaces" */
  update_workspaces_many?: Maybe<Array<Maybe<WorkspacesMutationResponse>>>;
};


/** mutation root */
export type MutationRootDeleteAccessRequestsArgs = {
  where: AccessRequestsBoolExp;
};


/** mutation root */
export type MutationRootDeleteAccessRequestsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBlockCommentsArgs = {
  where: BlockCommentsBoolExp;
};


/** mutation root */
export type MutationRootDeleteBlockCommentsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBlockLinksArgs = {
  where: BlockLinksBoolExp;
};


/** mutation root */
export type MutationRootDeleteBlockLinksByPkArgs = {
  from_block_id: Scalars['uuid']['input'];
  to_block_id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBlockReactionsArgs = {
  where: BlockReactionsBoolExp;
};


/** mutation root */
export type MutationRootDeleteBlockReactionsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBlockTagsArgs = {
  where: BlockTagsBoolExp;
};


/** mutation root */
export type MutationRootDeleteBlockTagsByPkArgs = {
  block_id: Scalars['uuid']['input'];
  tag_id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteBlocksArgs = {
  where: BlocksBoolExp;
};


/** mutation root */
export type MutationRootDeleteBlocksByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteDocumentLinkAccessArgs = {
  where: DocumentLinkAccessBoolExp;
};


/** mutation root */
export type MutationRootDeleteDocumentLinkAccessByPkArgs = {
  document_id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteFilesArgs = {
  where: FilesBoolExp;
};


/** mutation root */
export type MutationRootDeleteFilesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteFoldersArgs = {
  where: FoldersBoolExp;
};


/** mutation root */
export type MutationRootDeleteFoldersByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteNotificationsArgs = {
  where: NotificationsBoolExp;
};


/** mutation root */
export type MutationRootDeleteNotificationsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteTagsArgs = {
  where: TagsBoolExp;
};


/** mutation root */
export type MutationRootDeleteTagsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteTasksArgs = {
  where: TasksBoolExp;
};


/** mutation root */
export type MutationRootDeleteTasksByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteUsersArgs = {
  where: UsersBoolExp;
};


/** mutation root */
export type MutationRootDeleteUsersByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootDeleteWorkspacesArgs = {
  where: WorkspacesBoolExp;
};


/** mutation root */
export type MutationRootDeleteWorkspacesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type MutationRootInsertAccessRequestsArgs = {
  objects: Array<AccessRequestsInsertInput>;
  on_conflict?: InputMaybe<AccessRequestsOnConflict>;
};


/** mutation root */
export type MutationRootInsertAccessRequestsOneArgs = {
  object: AccessRequestsInsertInput;
  on_conflict?: InputMaybe<AccessRequestsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlockCommentsArgs = {
  objects: Array<BlockCommentsInsertInput>;
  on_conflict?: InputMaybe<BlockCommentsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlockCommentsOneArgs = {
  object: BlockCommentsInsertInput;
  on_conflict?: InputMaybe<BlockCommentsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlockLinksArgs = {
  objects: Array<BlockLinksInsertInput>;
  on_conflict?: InputMaybe<BlockLinksOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlockLinksOneArgs = {
  object: BlockLinksInsertInput;
  on_conflict?: InputMaybe<BlockLinksOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlockReactionsArgs = {
  objects: Array<BlockReactionsInsertInput>;
  on_conflict?: InputMaybe<BlockReactionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlockReactionsOneArgs = {
  object: BlockReactionsInsertInput;
  on_conflict?: InputMaybe<BlockReactionsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlockTagsArgs = {
  objects: Array<BlockTagsInsertInput>;
  on_conflict?: InputMaybe<BlockTagsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlockTagsOneArgs = {
  object: BlockTagsInsertInput;
  on_conflict?: InputMaybe<BlockTagsOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlocksArgs = {
  objects: Array<BlocksInsertInput>;
  on_conflict?: InputMaybe<BlocksOnConflict>;
};


/** mutation root */
export type MutationRootInsertBlocksOneArgs = {
  object: BlocksInsertInput;
  on_conflict?: InputMaybe<BlocksOnConflict>;
};


/** mutation root */
export type MutationRootInsertDocumentLinkAccessArgs = {
  objects: Array<DocumentLinkAccessInsertInput>;
  on_conflict?: InputMaybe<DocumentLinkAccessOnConflict>;
};


/** mutation root */
export type MutationRootInsertDocumentLinkAccessOneArgs = {
  object: DocumentLinkAccessInsertInput;
  on_conflict?: InputMaybe<DocumentLinkAccessOnConflict>;
};


/** mutation root */
export type MutationRootInsertFilesArgs = {
  objects: Array<FilesInsertInput>;
  on_conflict?: InputMaybe<FilesOnConflict>;
};


/** mutation root */
export type MutationRootInsertFilesOneArgs = {
  object: FilesInsertInput;
  on_conflict?: InputMaybe<FilesOnConflict>;
};


/** mutation root */
export type MutationRootInsertFoldersArgs = {
  objects: Array<FoldersInsertInput>;
  on_conflict?: InputMaybe<FoldersOnConflict>;
};


/** mutation root */
export type MutationRootInsertFoldersOneArgs = {
  object: FoldersInsertInput;
  on_conflict?: InputMaybe<FoldersOnConflict>;
};


/** mutation root */
export type MutationRootInsertNotificationsArgs = {
  objects: Array<NotificationsInsertInput>;
  on_conflict?: InputMaybe<NotificationsOnConflict>;
};


/** mutation root */
export type MutationRootInsertNotificationsOneArgs = {
  object: NotificationsInsertInput;
  on_conflict?: InputMaybe<NotificationsOnConflict>;
};


/** mutation root */
export type MutationRootInsertTagsArgs = {
  objects: Array<TagsInsertInput>;
  on_conflict?: InputMaybe<TagsOnConflict>;
};


/** mutation root */
export type MutationRootInsertTagsOneArgs = {
  object: TagsInsertInput;
  on_conflict?: InputMaybe<TagsOnConflict>;
};


/** mutation root */
export type MutationRootInsertTasksArgs = {
  objects: Array<TasksInsertInput>;
  on_conflict?: InputMaybe<TasksOnConflict>;
};


/** mutation root */
export type MutationRootInsertTasksOneArgs = {
  object: TasksInsertInput;
  on_conflict?: InputMaybe<TasksOnConflict>;
};


/** mutation root */
export type MutationRootInsertUsersArgs = {
  objects: Array<UsersInsertInput>;
  on_conflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type MutationRootInsertUsersOneArgs = {
  object: UsersInsertInput;
  on_conflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type MutationRootInsertWorkspacesArgs = {
  objects: Array<WorkspacesInsertInput>;
  on_conflict?: InputMaybe<WorkspacesOnConflict>;
};


/** mutation root */
export type MutationRootInsertWorkspacesOneArgs = {
  object: WorkspacesInsertInput;
  on_conflict?: InputMaybe<WorkspacesOnConflict>;
};


/** mutation root */
export type MutationRootUpdateAccessRequestsArgs = {
  _set?: InputMaybe<AccessRequestsSetInput>;
  where: AccessRequestsBoolExp;
};


/** mutation root */
export type MutationRootUpdateAccessRequestsByPkArgs = {
  _set?: InputMaybe<AccessRequestsSetInput>;
  pk_columns: AccessRequestsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateAccessRequestsManyArgs = {
  updates: Array<AccessRequestsUpdates>;
};


/** mutation root */
export type MutationRootUpdateBlockCommentsArgs = {
  _set?: InputMaybe<BlockCommentsSetInput>;
  where: BlockCommentsBoolExp;
};


/** mutation root */
export type MutationRootUpdateBlockCommentsByPkArgs = {
  _set?: InputMaybe<BlockCommentsSetInput>;
  pk_columns: BlockCommentsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBlockCommentsManyArgs = {
  updates: Array<BlockCommentsUpdates>;
};


/** mutation root */
export type MutationRootUpdateBlockLinksArgs = {
  _set?: InputMaybe<BlockLinksSetInput>;
  where: BlockLinksBoolExp;
};


/** mutation root */
export type MutationRootUpdateBlockLinksByPkArgs = {
  _set?: InputMaybe<BlockLinksSetInput>;
  pk_columns: BlockLinksPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBlockLinksManyArgs = {
  updates: Array<BlockLinksUpdates>;
};


/** mutation root */
export type MutationRootUpdateBlockReactionsArgs = {
  _set?: InputMaybe<BlockReactionsSetInput>;
  where: BlockReactionsBoolExp;
};


/** mutation root */
export type MutationRootUpdateBlockReactionsByPkArgs = {
  _set?: InputMaybe<BlockReactionsSetInput>;
  pk_columns: BlockReactionsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBlockReactionsManyArgs = {
  updates: Array<BlockReactionsUpdates>;
};


/** mutation root */
export type MutationRootUpdateBlockTagsArgs = {
  _set?: InputMaybe<BlockTagsSetInput>;
  where: BlockTagsBoolExp;
};


/** mutation root */
export type MutationRootUpdateBlockTagsByPkArgs = {
  _set?: InputMaybe<BlockTagsSetInput>;
  pk_columns: BlockTagsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBlockTagsManyArgs = {
  updates: Array<BlockTagsUpdates>;
};


/** mutation root */
export type MutationRootUpdateBlocksArgs = {
  _append?: InputMaybe<BlocksAppendInput>;
  _delete_at_path?: InputMaybe<BlocksDeleteAtPathInput>;
  _delete_elem?: InputMaybe<BlocksDeleteElemInput>;
  _delete_key?: InputMaybe<BlocksDeleteKeyInput>;
  _inc?: InputMaybe<BlocksIncInput>;
  _prepend?: InputMaybe<BlocksPrependInput>;
  _set?: InputMaybe<BlocksSetInput>;
  where: BlocksBoolExp;
};


/** mutation root */
export type MutationRootUpdateBlocksByPkArgs = {
  _append?: InputMaybe<BlocksAppendInput>;
  _delete_at_path?: InputMaybe<BlocksDeleteAtPathInput>;
  _delete_elem?: InputMaybe<BlocksDeleteElemInput>;
  _delete_key?: InputMaybe<BlocksDeleteKeyInput>;
  _inc?: InputMaybe<BlocksIncInput>;
  _prepend?: InputMaybe<BlocksPrependInput>;
  _set?: InputMaybe<BlocksSetInput>;
  pk_columns: BlocksPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateBlocksManyArgs = {
  updates: Array<BlocksUpdates>;
};


/** mutation root */
export type MutationRootUpdateDocumentLinkAccessArgs = {
  _set?: InputMaybe<DocumentLinkAccessSetInput>;
  where: DocumentLinkAccessBoolExp;
};


/** mutation root */
export type MutationRootUpdateDocumentLinkAccessByPkArgs = {
  _set?: InputMaybe<DocumentLinkAccessSetInput>;
  pk_columns: DocumentLinkAccessPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateDocumentLinkAccessManyArgs = {
  updates: Array<DocumentLinkAccessUpdates>;
};


/** mutation root */
export type MutationRootUpdateFilesArgs = {
  _set?: InputMaybe<FilesSetInput>;
  where: FilesBoolExp;
};


/** mutation root */
export type MutationRootUpdateFilesByPkArgs = {
  _set?: InputMaybe<FilesSetInput>;
  pk_columns: FilesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateFilesManyArgs = {
  updates: Array<FilesUpdates>;
};


/** mutation root */
export type MutationRootUpdateFoldersArgs = {
  _set?: InputMaybe<FoldersSetInput>;
  where: FoldersBoolExp;
};


/** mutation root */
export type MutationRootUpdateFoldersByPkArgs = {
  _set?: InputMaybe<FoldersSetInput>;
  pk_columns: FoldersPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateFoldersManyArgs = {
  updates: Array<FoldersUpdates>;
};


/** mutation root */
export type MutationRootUpdateNotificationsArgs = {
  _append?: InputMaybe<NotificationsAppendInput>;
  _delete_at_path?: InputMaybe<NotificationsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<NotificationsDeleteElemInput>;
  _delete_key?: InputMaybe<NotificationsDeleteKeyInput>;
  _prepend?: InputMaybe<NotificationsPrependInput>;
  _set?: InputMaybe<NotificationsSetInput>;
  where: NotificationsBoolExp;
};


/** mutation root */
export type MutationRootUpdateNotificationsByPkArgs = {
  _append?: InputMaybe<NotificationsAppendInput>;
  _delete_at_path?: InputMaybe<NotificationsDeleteAtPathInput>;
  _delete_elem?: InputMaybe<NotificationsDeleteElemInput>;
  _delete_key?: InputMaybe<NotificationsDeleteKeyInput>;
  _prepend?: InputMaybe<NotificationsPrependInput>;
  _set?: InputMaybe<NotificationsSetInput>;
  pk_columns: NotificationsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateNotificationsManyArgs = {
  updates: Array<NotificationsUpdates>;
};


/** mutation root */
export type MutationRootUpdateTagsArgs = {
  _set?: InputMaybe<TagsSetInput>;
  where: TagsBoolExp;
};


/** mutation root */
export type MutationRootUpdateTagsByPkArgs = {
  _set?: InputMaybe<TagsSetInput>;
  pk_columns: TagsPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateTagsManyArgs = {
  updates: Array<TagsUpdates>;
};


/** mutation root */
export type MutationRootUpdateTasksArgs = {
  _set?: InputMaybe<TasksSetInput>;
  where: TasksBoolExp;
};


/** mutation root */
export type MutationRootUpdateTasksByPkArgs = {
  _set?: InputMaybe<TasksSetInput>;
  pk_columns: TasksPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateTasksManyArgs = {
  updates: Array<TasksUpdates>;
};


/** mutation root */
export type MutationRootUpdateUsersArgs = {
  _set?: InputMaybe<UsersSetInput>;
  where: UsersBoolExp;
};


/** mutation root */
export type MutationRootUpdateUsersByPkArgs = {
  _set?: InputMaybe<UsersSetInput>;
  pk_columns: UsersPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateUsersManyArgs = {
  updates: Array<UsersUpdates>;
};


/** mutation root */
export type MutationRootUpdateWorkspacesArgs = {
  _set?: InputMaybe<WorkspacesSetInput>;
  where: WorkspacesBoolExp;
};


/** mutation root */
export type MutationRootUpdateWorkspacesByPkArgs = {
  _set?: InputMaybe<WorkspacesSetInput>;
  pk_columns: WorkspacesPkColumnsInput;
};


/** mutation root */
export type MutationRootUpdateWorkspacesManyArgs = {
  updates: Array<WorkspacesUpdates>;
};

/** columns and relationships of "notifications" */
export type Notifications = {
  __typename?: 'notifications';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  data?: Maybe<Scalars['jsonb']['output']>;
  event_key?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  is_read?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  /** An object relationship */
  user: Users;
  user_id: Scalars['uuid']['output'];
};


/** columns and relationships of "notifications" */
export type NotificationsDataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "notifications" */
export type NotificationsAggregate = {
  __typename?: 'notifications_aggregate';
  aggregate?: Maybe<NotificationsAggregateFields>;
  nodes: Array<Notifications>;
};

/** aggregate fields of "notifications" */
export type NotificationsAggregateFields = {
  __typename?: 'notifications_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<NotificationsMaxFields>;
  min?: Maybe<NotificationsMinFields>;
};


/** aggregate fields of "notifications" */
export type NotificationsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<NotificationsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type NotificationsAppendInput = {
  data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "notifications". All fields are combined with a logical 'AND'. */
export type NotificationsBoolExp = {
  _and?: InputMaybe<Array<NotificationsBoolExp>>;
  _not?: InputMaybe<NotificationsBoolExp>;
  _or?: InputMaybe<Array<NotificationsBoolExp>>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  data?: InputMaybe<JsonbComparisonExp>;
  event_key?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  is_read?: InputMaybe<BooleanComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  title?: InputMaybe<StringComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "notifications" */
export enum NotificationsConstraint {
  /** unique or primary key constraint on columns "event_key" */
  IdxNotificationsEventKey = 'idx_notifications_event_key',
  /** unique or primary key constraint on columns "id" */
  NotificationsPkey = 'notifications_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type NotificationsDeleteAtPathInput = {
  data?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type NotificationsDeleteElemInput = {
  data?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type NotificationsDeleteKeyInput = {
  data?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "notifications" */
export type NotificationsInsertInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  data?: InputMaybe<Scalars['jsonb']['input']>;
  event_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_read?: InputMaybe<Scalars['Boolean']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type NotificationsMaxFields = {
  __typename?: 'notifications_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  event_key?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type NotificationsMinFields = {
  __typename?: 'notifications_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  event_key?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "notifications" */
export type NotificationsMutationResponse = {
  __typename?: 'notifications_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Notifications>;
};

/** on_conflict condition type for table "notifications" */
export type NotificationsOnConflict = {
  constraint: NotificationsConstraint;
  update_columns?: Array<NotificationsUpdateColumn>;
  where?: InputMaybe<NotificationsBoolExp>;
};

/** Ordering options when selecting data from "notifications". */
export type NotificationsOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  data?: InputMaybe<OrderBy>;
  event_key?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  is_read?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notifications */
export type NotificationsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type NotificationsPrependInput = {
  data?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "notifications" */
export enum NotificationsSelectColumn {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  EventKey = 'event_key',
  /** column name */
  Id = 'id',
  /** column name */
  IsRead = 'is_read',
  /** column name */
  Message = 'message',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "notifications" */
export type NotificationsSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  data?: InputMaybe<Scalars['jsonb']['input']>;
  event_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_read?: InputMaybe<Scalars['Boolean']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "notifications" */
export type NotificationsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: NotificationsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NotificationsStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  data?: InputMaybe<Scalars['jsonb']['input']>;
  event_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_read?: InputMaybe<Scalars['Boolean']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "notifications" */
export enum NotificationsUpdateColumn {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  EventKey = 'event_key',
  /** column name */
  Id = 'id',
  /** column name */
  IsRead = 'is_read',
  /** column name */
  Message = 'message',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id'
}

export type NotificationsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<NotificationsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<NotificationsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<NotificationsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<NotificationsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<NotificationsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<NotificationsSetInput>;
  /** filter the rows which have to be updated */
  where: NotificationsBoolExp;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type QueryRoot = {
  __typename?: 'query_root';
  /** An array relationship */
  access_requests: Array<AccessRequests>;
  /** An aggregate relationship */
  access_requests_aggregate: AccessRequestsAggregate;
  /** fetch data from the table: "access_requests" using primary key columns */
  access_requests_by_pk?: Maybe<AccessRequests>;
  /** An array relationship */
  block_comments: Array<BlockComments>;
  /** An aggregate relationship */
  block_comments_aggregate: BlockCommentsAggregate;
  /** fetch data from the table: "block_comments" using primary key columns */
  block_comments_by_pk?: Maybe<BlockComments>;
  /** fetch data from the table: "block_links" */
  block_links: Array<BlockLinks>;
  /** fetch aggregated fields from the table: "block_links" */
  block_links_aggregate: BlockLinksAggregate;
  /** fetch data from the table: "block_links" using primary key columns */
  block_links_by_pk?: Maybe<BlockLinks>;
  /** An array relationship */
  block_reactions: Array<BlockReactions>;
  /** An aggregate relationship */
  block_reactions_aggregate: BlockReactionsAggregate;
  /** fetch data from the table: "block_reactions" using primary key columns */
  block_reactions_by_pk?: Maybe<BlockReactions>;
  /** An array relationship */
  block_tags: Array<BlockTags>;
  /** An aggregate relationship */
  block_tags_aggregate: BlockTagsAggregate;
  /** fetch data from the table: "block_tags" using primary key columns */
  block_tags_by_pk?: Maybe<BlockTags>;
  /** An array relationship */
  blocks: Array<Blocks>;
  /** An aggregate relationship */
  blocks_aggregate: BlocksAggregate;
  /** fetch data from the table: "blocks" using primary key columns */
  blocks_by_pk?: Maybe<Blocks>;
  /** fetch data from the table: "document_link_access" */
  document_link_access: Array<DocumentLinkAccess>;
  /** fetch aggregated fields from the table: "document_link_access" */
  document_link_access_aggregate: DocumentLinkAccessAggregate;
  /** fetch data from the table: "document_link_access" using primary key columns */
  document_link_access_by_pk?: Maybe<DocumentLinkAccess>;
  /** An array relationship */
  files: Array<Files>;
  /** An aggregate relationship */
  files_aggregate: FilesAggregate;
  /** fetch data from the table: "files" using primary key columns */
  files_by_pk?: Maybe<Files>;
  /** An array relationship */
  folders: Array<Folders>;
  /** An aggregate relationship */
  folders_aggregate: FoldersAggregate;
  /** fetch data from the table: "folders" using primary key columns */
  folders_by_pk?: Maybe<Folders>;
  /** fetch data from the table: "notifications" */
  notifications: Array<Notifications>;
  /** fetch aggregated fields from the table: "notifications" */
  notifications_aggregate: NotificationsAggregate;
  /** fetch data from the table: "notifications" using primary key columns */
  notifications_by_pk?: Maybe<Notifications>;
  /** fetch data from the table: "tags" */
  tags: Array<Tags>;
  /** fetch aggregated fields from the table: "tags" */
  tags_aggregate: TagsAggregate;
  /** fetch data from the table: "tags" using primary key columns */
  tags_by_pk?: Maybe<Tags>;
  /** An array relationship */
  tasks: Array<Tasks>;
  /** An aggregate relationship */
  tasks_aggregate: TasksAggregate;
  /** fetch data from the table: "tasks" using primary key columns */
  tasks_by_pk?: Maybe<Tasks>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: UsersAggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** An array relationship */
  workspaces: Array<Workspaces>;
  /** An aggregate relationship */
  workspaces_aggregate: WorkspacesAggregate;
  /** fetch data from the table: "workspaces" using primary key columns */
  workspaces_by_pk?: Maybe<Workspaces>;
};


export type QueryRootAccessRequestsArgs = {
  distinct_on?: InputMaybe<Array<AccessRequestsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccessRequestsOrderBy>>;
  where?: InputMaybe<AccessRequestsBoolExp>;
};


export type QueryRootAccessRequestsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccessRequestsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccessRequestsOrderBy>>;
  where?: InputMaybe<AccessRequestsBoolExp>;
};


export type QueryRootAccessRequestsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBlockCommentsArgs = {
  distinct_on?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockCommentsOrderBy>>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};


export type QueryRootBlockCommentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockCommentsOrderBy>>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};


export type QueryRootBlockCommentsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBlockLinksArgs = {
  distinct_on?: InputMaybe<Array<BlockLinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockLinksOrderBy>>;
  where?: InputMaybe<BlockLinksBoolExp>;
};


export type QueryRootBlockLinksAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockLinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockLinksOrderBy>>;
  where?: InputMaybe<BlockLinksBoolExp>;
};


export type QueryRootBlockLinksByPkArgs = {
  from_block_id: Scalars['uuid']['input'];
  to_block_id: Scalars['uuid']['input'];
};


export type QueryRootBlockReactionsArgs = {
  distinct_on?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockReactionsOrderBy>>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};


export type QueryRootBlockReactionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockReactionsOrderBy>>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};


export type QueryRootBlockReactionsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootBlockTagsArgs = {
  distinct_on?: InputMaybe<Array<BlockTagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockTagsOrderBy>>;
  where?: InputMaybe<BlockTagsBoolExp>;
};


export type QueryRootBlockTagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockTagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockTagsOrderBy>>;
  where?: InputMaybe<BlockTagsBoolExp>;
};


export type QueryRootBlockTagsByPkArgs = {
  block_id: Scalars['uuid']['input'];
  tag_id: Scalars['uuid']['input'];
};


export type QueryRootBlocksArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


export type QueryRootBlocksAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


export type QueryRootBlocksByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootDocumentLinkAccessArgs = {
  distinct_on?: InputMaybe<Array<DocumentLinkAccessSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DocumentLinkAccessOrderBy>>;
  where?: InputMaybe<DocumentLinkAccessBoolExp>;
};


export type QueryRootDocumentLinkAccessAggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentLinkAccessSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DocumentLinkAccessOrderBy>>;
  where?: InputMaybe<DocumentLinkAccessBoolExp>;
};


export type QueryRootDocumentLinkAccessByPkArgs = {
  document_id: Scalars['uuid']['input'];
};


export type QueryRootFilesArgs = {
  distinct_on?: InputMaybe<Array<FilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FilesOrderBy>>;
  where?: InputMaybe<FilesBoolExp>;
};


export type QueryRootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<FilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FilesOrderBy>>;
  where?: InputMaybe<FilesBoolExp>;
};


export type QueryRootFilesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootFoldersArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};


export type QueryRootFoldersAggregateArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};


export type QueryRootFoldersByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootNotificationsArgs = {
  distinct_on?: InputMaybe<Array<NotificationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotificationsOrderBy>>;
  where?: InputMaybe<NotificationsBoolExp>;
};


export type QueryRootNotificationsAggregateArgs = {
  distinct_on?: InputMaybe<Array<NotificationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotificationsOrderBy>>;
  where?: InputMaybe<NotificationsBoolExp>;
};


export type QueryRootNotificationsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootTagsArgs = {
  distinct_on?: InputMaybe<Array<TagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TagsOrderBy>>;
  where?: InputMaybe<TagsBoolExp>;
};


export type QueryRootTagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TagsOrderBy>>;
  where?: InputMaybe<TagsBoolExp>;
};


export type QueryRootTagsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootTasksArgs = {
  distinct_on?: InputMaybe<Array<TasksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TasksOrderBy>>;
  where?: InputMaybe<TasksBoolExp>;
};


export type QueryRootTasksAggregateArgs = {
  distinct_on?: InputMaybe<Array<TasksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TasksOrderBy>>;
  where?: InputMaybe<TasksBoolExp>;
};


export type QueryRootTasksByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootUsersArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type QueryRootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type QueryRootUsersByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type QueryRootWorkspacesArgs = {
  distinct_on?: InputMaybe<Array<WorkspacesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkspacesOrderBy>>;
  where?: InputMaybe<WorkspacesBoolExp>;
};


export type QueryRootWorkspacesAggregateArgs = {
  distinct_on?: InputMaybe<Array<WorkspacesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkspacesOrderBy>>;
  where?: InputMaybe<WorkspacesBoolExp>;
};


export type QueryRootWorkspacesByPkArgs = {
  id: Scalars['uuid']['input'];
};

export type SubscriptionRoot = {
  __typename?: 'subscription_root';
  /** An array relationship */
  access_requests: Array<AccessRequests>;
  /** An aggregate relationship */
  access_requests_aggregate: AccessRequestsAggregate;
  /** fetch data from the table: "access_requests" using primary key columns */
  access_requests_by_pk?: Maybe<AccessRequests>;
  /** fetch data from the table in a streaming manner: "access_requests" */
  access_requests_stream: Array<AccessRequests>;
  /** An array relationship */
  block_comments: Array<BlockComments>;
  /** An aggregate relationship */
  block_comments_aggregate: BlockCommentsAggregate;
  /** fetch data from the table: "block_comments" using primary key columns */
  block_comments_by_pk?: Maybe<BlockComments>;
  /** fetch data from the table in a streaming manner: "block_comments" */
  block_comments_stream: Array<BlockComments>;
  /** fetch data from the table: "block_links" */
  block_links: Array<BlockLinks>;
  /** fetch aggregated fields from the table: "block_links" */
  block_links_aggregate: BlockLinksAggregate;
  /** fetch data from the table: "block_links" using primary key columns */
  block_links_by_pk?: Maybe<BlockLinks>;
  /** fetch data from the table in a streaming manner: "block_links" */
  block_links_stream: Array<BlockLinks>;
  /** An array relationship */
  block_reactions: Array<BlockReactions>;
  /** An aggregate relationship */
  block_reactions_aggregate: BlockReactionsAggregate;
  /** fetch data from the table: "block_reactions" using primary key columns */
  block_reactions_by_pk?: Maybe<BlockReactions>;
  /** fetch data from the table in a streaming manner: "block_reactions" */
  block_reactions_stream: Array<BlockReactions>;
  /** An array relationship */
  block_tags: Array<BlockTags>;
  /** An aggregate relationship */
  block_tags_aggregate: BlockTagsAggregate;
  /** fetch data from the table: "block_tags" using primary key columns */
  block_tags_by_pk?: Maybe<BlockTags>;
  /** fetch data from the table in a streaming manner: "block_tags" */
  block_tags_stream: Array<BlockTags>;
  /** An array relationship */
  blocks: Array<Blocks>;
  /** An aggregate relationship */
  blocks_aggregate: BlocksAggregate;
  /** fetch data from the table: "blocks" using primary key columns */
  blocks_by_pk?: Maybe<Blocks>;
  /** fetch data from the table in a streaming manner: "blocks" */
  blocks_stream: Array<Blocks>;
  /** fetch data from the table: "document_link_access" */
  document_link_access: Array<DocumentLinkAccess>;
  /** fetch aggregated fields from the table: "document_link_access" */
  document_link_access_aggregate: DocumentLinkAccessAggregate;
  /** fetch data from the table: "document_link_access" using primary key columns */
  document_link_access_by_pk?: Maybe<DocumentLinkAccess>;
  /** fetch data from the table in a streaming manner: "document_link_access" */
  document_link_access_stream: Array<DocumentLinkAccess>;
  /** An array relationship */
  files: Array<Files>;
  /** An aggregate relationship */
  files_aggregate: FilesAggregate;
  /** fetch data from the table: "files" using primary key columns */
  files_by_pk?: Maybe<Files>;
  /** fetch data from the table in a streaming manner: "files" */
  files_stream: Array<Files>;
  /** An array relationship */
  folders: Array<Folders>;
  /** An aggregate relationship */
  folders_aggregate: FoldersAggregate;
  /** fetch data from the table: "folders" using primary key columns */
  folders_by_pk?: Maybe<Folders>;
  /** fetch data from the table in a streaming manner: "folders" */
  folders_stream: Array<Folders>;
  /** fetch data from the table: "notifications" */
  notifications: Array<Notifications>;
  /** fetch aggregated fields from the table: "notifications" */
  notifications_aggregate: NotificationsAggregate;
  /** fetch data from the table: "notifications" using primary key columns */
  notifications_by_pk?: Maybe<Notifications>;
  /** fetch data from the table in a streaming manner: "notifications" */
  notifications_stream: Array<Notifications>;
  /** fetch data from the table: "tags" */
  tags: Array<Tags>;
  /** fetch aggregated fields from the table: "tags" */
  tags_aggregate: TagsAggregate;
  /** fetch data from the table: "tags" using primary key columns */
  tags_by_pk?: Maybe<Tags>;
  /** fetch data from the table in a streaming manner: "tags" */
  tags_stream: Array<Tags>;
  /** An array relationship */
  tasks: Array<Tasks>;
  /** An aggregate relationship */
  tasks_aggregate: TasksAggregate;
  /** fetch data from the table: "tasks" using primary key columns */
  tasks_by_pk?: Maybe<Tasks>;
  /** fetch data from the table in a streaming manner: "tasks" */
  tasks_stream: Array<Tasks>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: UsersAggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
  /** An array relationship */
  workspaces: Array<Workspaces>;
  /** An aggregate relationship */
  workspaces_aggregate: WorkspacesAggregate;
  /** fetch data from the table: "workspaces" using primary key columns */
  workspaces_by_pk?: Maybe<Workspaces>;
  /** fetch data from the table in a streaming manner: "workspaces" */
  workspaces_stream: Array<Workspaces>;
};


export type SubscriptionRootAccessRequestsArgs = {
  distinct_on?: InputMaybe<Array<AccessRequestsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccessRequestsOrderBy>>;
  where?: InputMaybe<AccessRequestsBoolExp>;
};


export type SubscriptionRootAccessRequestsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccessRequestsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccessRequestsOrderBy>>;
  where?: InputMaybe<AccessRequestsBoolExp>;
};


export type SubscriptionRootAccessRequestsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootAccessRequestsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<AccessRequestsStreamCursorInput>>;
  where?: InputMaybe<AccessRequestsBoolExp>;
};


export type SubscriptionRootBlockCommentsArgs = {
  distinct_on?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockCommentsOrderBy>>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};


export type SubscriptionRootBlockCommentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockCommentsOrderBy>>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};


export type SubscriptionRootBlockCommentsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBlockCommentsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BlockCommentsStreamCursorInput>>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};


export type SubscriptionRootBlockLinksArgs = {
  distinct_on?: InputMaybe<Array<BlockLinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockLinksOrderBy>>;
  where?: InputMaybe<BlockLinksBoolExp>;
};


export type SubscriptionRootBlockLinksAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockLinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockLinksOrderBy>>;
  where?: InputMaybe<BlockLinksBoolExp>;
};


export type SubscriptionRootBlockLinksByPkArgs = {
  from_block_id: Scalars['uuid']['input'];
  to_block_id: Scalars['uuid']['input'];
};


export type SubscriptionRootBlockLinksStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BlockLinksStreamCursorInput>>;
  where?: InputMaybe<BlockLinksBoolExp>;
};


export type SubscriptionRootBlockReactionsArgs = {
  distinct_on?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockReactionsOrderBy>>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};


export type SubscriptionRootBlockReactionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockReactionsOrderBy>>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};


export type SubscriptionRootBlockReactionsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBlockReactionsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BlockReactionsStreamCursorInput>>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};


export type SubscriptionRootBlockTagsArgs = {
  distinct_on?: InputMaybe<Array<BlockTagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockTagsOrderBy>>;
  where?: InputMaybe<BlockTagsBoolExp>;
};


export type SubscriptionRootBlockTagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockTagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockTagsOrderBy>>;
  where?: InputMaybe<BlockTagsBoolExp>;
};


export type SubscriptionRootBlockTagsByPkArgs = {
  block_id: Scalars['uuid']['input'];
  tag_id: Scalars['uuid']['input'];
};


export type SubscriptionRootBlockTagsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BlockTagsStreamCursorInput>>;
  where?: InputMaybe<BlockTagsBoolExp>;
};


export type SubscriptionRootBlocksArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


export type SubscriptionRootBlocksAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


export type SubscriptionRootBlocksByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootBlocksStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BlocksStreamCursorInput>>;
  where?: InputMaybe<BlocksBoolExp>;
};


export type SubscriptionRootDocumentLinkAccessArgs = {
  distinct_on?: InputMaybe<Array<DocumentLinkAccessSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DocumentLinkAccessOrderBy>>;
  where?: InputMaybe<DocumentLinkAccessBoolExp>;
};


export type SubscriptionRootDocumentLinkAccessAggregateArgs = {
  distinct_on?: InputMaybe<Array<DocumentLinkAccessSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DocumentLinkAccessOrderBy>>;
  where?: InputMaybe<DocumentLinkAccessBoolExp>;
};


export type SubscriptionRootDocumentLinkAccessByPkArgs = {
  document_id: Scalars['uuid']['input'];
};


export type SubscriptionRootDocumentLinkAccessStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<DocumentLinkAccessStreamCursorInput>>;
  where?: InputMaybe<DocumentLinkAccessBoolExp>;
};


export type SubscriptionRootFilesArgs = {
  distinct_on?: InputMaybe<Array<FilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FilesOrderBy>>;
  where?: InputMaybe<FilesBoolExp>;
};


export type SubscriptionRootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<FilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FilesOrderBy>>;
  where?: InputMaybe<FilesBoolExp>;
};


export type SubscriptionRootFilesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootFilesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FilesStreamCursorInput>>;
  where?: InputMaybe<FilesBoolExp>;
};


export type SubscriptionRootFoldersArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};


export type SubscriptionRootFoldersAggregateArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};


export type SubscriptionRootFoldersByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootFoldersStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FoldersStreamCursorInput>>;
  where?: InputMaybe<FoldersBoolExp>;
};


export type SubscriptionRootNotificationsArgs = {
  distinct_on?: InputMaybe<Array<NotificationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotificationsOrderBy>>;
  where?: InputMaybe<NotificationsBoolExp>;
};


export type SubscriptionRootNotificationsAggregateArgs = {
  distinct_on?: InputMaybe<Array<NotificationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NotificationsOrderBy>>;
  where?: InputMaybe<NotificationsBoolExp>;
};


export type SubscriptionRootNotificationsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootNotificationsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<NotificationsStreamCursorInput>>;
  where?: InputMaybe<NotificationsBoolExp>;
};


export type SubscriptionRootTagsArgs = {
  distinct_on?: InputMaybe<Array<TagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TagsOrderBy>>;
  where?: InputMaybe<TagsBoolExp>;
};


export type SubscriptionRootTagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TagsOrderBy>>;
  where?: InputMaybe<TagsBoolExp>;
};


export type SubscriptionRootTagsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootTagsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TagsStreamCursorInput>>;
  where?: InputMaybe<TagsBoolExp>;
};


export type SubscriptionRootTasksArgs = {
  distinct_on?: InputMaybe<Array<TasksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TasksOrderBy>>;
  where?: InputMaybe<TasksBoolExp>;
};


export type SubscriptionRootTasksAggregateArgs = {
  distinct_on?: InputMaybe<Array<TasksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TasksOrderBy>>;
  where?: InputMaybe<TasksBoolExp>;
};


export type SubscriptionRootTasksByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootTasksStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<TasksStreamCursorInput>>;
  where?: InputMaybe<TasksBoolExp>;
};


export type SubscriptionRootUsersArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootUsersByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootUsersStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersStreamCursorInput>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionRootWorkspacesArgs = {
  distinct_on?: InputMaybe<Array<WorkspacesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkspacesOrderBy>>;
  where?: InputMaybe<WorkspacesBoolExp>;
};


export type SubscriptionRootWorkspacesAggregateArgs = {
  distinct_on?: InputMaybe<Array<WorkspacesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkspacesOrderBy>>;
  where?: InputMaybe<WorkspacesBoolExp>;
};


export type SubscriptionRootWorkspacesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type SubscriptionRootWorkspacesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<WorkspacesStreamCursorInput>>;
  where?: InputMaybe<WorkspacesBoolExp>;
};

/** columns and relationships of "tags" */
export type Tags = {
  __typename?: 'tags';
  /** An array relationship */
  block_tags: Array<BlockTags>;
  /** An aggregate relationship */
  block_tags_aggregate: BlockTagsAggregate;
  color?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};


/** columns and relationships of "tags" */
export type TagsBlockTagsArgs = {
  distinct_on?: InputMaybe<Array<BlockTagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockTagsOrderBy>>;
  where?: InputMaybe<BlockTagsBoolExp>;
};


/** columns and relationships of "tags" */
export type TagsBlockTagsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockTagsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockTagsOrderBy>>;
  where?: InputMaybe<BlockTagsBoolExp>;
};

/** aggregated selection of "tags" */
export type TagsAggregate = {
  __typename?: 'tags_aggregate';
  aggregate?: Maybe<TagsAggregateFields>;
  nodes: Array<Tags>;
};

/** aggregate fields of "tags" */
export type TagsAggregateFields = {
  __typename?: 'tags_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<TagsMaxFields>;
  min?: Maybe<TagsMinFields>;
};


/** aggregate fields of "tags" */
export type TagsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TagsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "tags". All fields are combined with a logical 'AND'. */
export type TagsBoolExp = {
  _and?: InputMaybe<Array<TagsBoolExp>>;
  _not?: InputMaybe<TagsBoolExp>;
  _or?: InputMaybe<Array<TagsBoolExp>>;
  block_tags?: InputMaybe<BlockTagsBoolExp>;
  block_tags_aggregate?: InputMaybe<BlockTagsAggregateBoolExp>;
  color?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "tags" */
export enum TagsConstraint {
  /** unique or primary key constraint on columns "name" */
  TagsNameKey = 'tags_name_key',
  /** unique or primary key constraint on columns "id" */
  TagsPkey = 'tags_pkey'
}

/** input type for inserting data into table "tags" */
export type TagsInsertInput = {
  block_tags?: InputMaybe<BlockTagsArrRelInsertInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type TagsMaxFields = {
  __typename?: 'tags_max_fields';
  color?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type TagsMinFields = {
  __typename?: 'tags_min_fields';
  color?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "tags" */
export type TagsMutationResponse = {
  __typename?: 'tags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Tags>;
};

/** input type for inserting object relation for remote table "tags" */
export type TagsObjRelInsertInput = {
  data: TagsInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<TagsOnConflict>;
};

/** on_conflict condition type for table "tags" */
export type TagsOnConflict = {
  constraint: TagsConstraint;
  update_columns?: Array<TagsUpdateColumn>;
  where?: InputMaybe<TagsBoolExp>;
};

/** Ordering options when selecting data from "tags". */
export type TagsOrderBy = {
  block_tags_aggregate?: InputMaybe<BlockTagsAggregateOrderBy>;
  color?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: tags */
export type TagsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "tags" */
export enum TagsSelectColumn {
  /** column name */
  Color = 'color',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "tags" */
export type TagsSetInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "tags" */
export type TagsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TagsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TagsStreamCursorValueInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "tags" */
export enum TagsUpdateColumn {
  /** column name */
  Color = 'color',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type TagsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TagsSetInput>;
  /** filter the rows which have to be updated */
  where: TagsBoolExp;
};

/** columns and relationships of "tasks" */
export type Tasks = {
  __typename?: 'tasks';
  /** An object relationship */
  block?: Maybe<Blocks>;
  block_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deadline_date?: Maybe<Scalars['date']['output']>;
  id: Scalars['uuid']['output'];
  priority?: Maybe<Scalars['String']['output']>;
  schedule_date?: Maybe<Scalars['date']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "tasks" */
export type TasksAggregate = {
  __typename?: 'tasks_aggregate';
  aggregate?: Maybe<TasksAggregateFields>;
  nodes: Array<Tasks>;
};

export type TasksAggregateBoolExp = {
  count?: InputMaybe<TasksAggregateBoolExpCount>;
};

export type TasksAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<TasksSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<TasksBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "tasks" */
export type TasksAggregateFields = {
  __typename?: 'tasks_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<TasksMaxFields>;
  min?: Maybe<TasksMinFields>;
};


/** aggregate fields of "tasks" */
export type TasksAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TasksSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "tasks" */
export type TasksAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<TasksMaxOrderBy>;
  min?: InputMaybe<TasksMinOrderBy>;
};

/** input type for inserting array relation for remote table "tasks" */
export type TasksArrRelInsertInput = {
  data: Array<TasksInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<TasksOnConflict>;
};

/** Boolean expression to filter rows from the table "tasks". All fields are combined with a logical 'AND'. */
export type TasksBoolExp = {
  _and?: InputMaybe<Array<TasksBoolExp>>;
  _not?: InputMaybe<TasksBoolExp>;
  _or?: InputMaybe<Array<TasksBoolExp>>;
  block?: InputMaybe<BlocksBoolExp>;
  block_id?: InputMaybe<UuidComparisonExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  deadline_date?: InputMaybe<DateComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  priority?: InputMaybe<StringComparisonExp>;
  schedule_date?: InputMaybe<DateComparisonExp>;
  status?: InputMaybe<StringComparisonExp>;
  updated_at?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  user_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "tasks" */
export enum TasksConstraint {
  /** unique or primary key constraint on columns "id" */
  TasksPkey = 'tasks_pkey'
}

/** input type for inserting data into table "tasks" */
export type TasksInsertInput = {
  block?: InputMaybe<BlocksObjRelInsertInput>;
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deadline_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  schedule_date?: InputMaybe<Scalars['date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type TasksMaxFields = {
  __typename?: 'tasks_max_fields';
  block_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deadline_date?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  priority?: Maybe<Scalars['String']['output']>;
  schedule_date?: Maybe<Scalars['date']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "tasks" */
export type TasksMaxOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  deadline_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  schedule_date?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type TasksMinFields = {
  __typename?: 'tasks_min_fields';
  block_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deadline_date?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  priority?: Maybe<Scalars['String']['output']>;
  schedule_date?: Maybe<Scalars['date']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "tasks" */
export type TasksMinOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  deadline_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  schedule_date?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "tasks" */
export type TasksMutationResponse = {
  __typename?: 'tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Tasks>;
};

/** on_conflict condition type for table "tasks" */
export type TasksOnConflict = {
  constraint: TasksConstraint;
  update_columns?: Array<TasksUpdateColumn>;
  where?: InputMaybe<TasksBoolExp>;
};

/** Ordering options when selecting data from "tasks". */
export type TasksOrderBy = {
  block?: InputMaybe<BlocksOrderBy>;
  block_id?: InputMaybe<OrderBy>;
  created_at?: InputMaybe<OrderBy>;
  deadline_date?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  schedule_date?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  updated_at?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  user_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: tasks */
export type TasksPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "tasks" */
export enum TasksSelectColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeadlineDate = 'deadline_date',
  /** column name */
  Id = 'id',
  /** column name */
  Priority = 'priority',
  /** column name */
  ScheduleDate = 'schedule_date',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "tasks" */
export type TasksSetInput = {
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deadline_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  schedule_date?: InputMaybe<Scalars['date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "tasks" */
export type TasksStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TasksStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TasksStreamCursorValueInput = {
  block_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deadline_date?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  schedule_date?: InputMaybe<Scalars['date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "tasks" */
export enum TasksUpdateColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeadlineDate = 'deadline_date',
  /** column name */
  Id = 'id',
  /** column name */
  Priority = 'priority',
  /** column name */
  ScheduleDate = 'schedule_date',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

export type TasksUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TasksSetInput>;
  /** filter the rows which have to be updated */
  where: TasksBoolExp;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type TimestamptzComparisonExp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** Boolean expression to compare columns of type "timetz". All fields are combined with logical 'AND'. */
export type TimetzComparisonExp = {
  _eq?: InputMaybe<Scalars['timetz']['input']>;
  _gt?: InputMaybe<Scalars['timetz']['input']>;
  _gte?: InputMaybe<Scalars['timetz']['input']>;
  _in?: InputMaybe<Array<Scalars['timetz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timetz']['input']>;
  _lte?: InputMaybe<Scalars['timetz']['input']>;
  _neq?: InputMaybe<Scalars['timetz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timetz']['input']>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  avatar_url?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  block_comments: Array<BlockComments>;
  /** An aggregate relationship */
  block_comments_aggregate: BlockCommentsAggregate;
  /** An array relationship */
  block_reactions: Array<BlockReactions>;
  /** An aggregate relationship */
  block_reactions_aggregate: BlockReactionsAggregate;
  /** An array relationship */
  blocks: Array<Blocks>;
  /** An aggregate relationship */
  blocks_aggregate: BlocksAggregate;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email: Scalars['String']['output'];
  /** An array relationship */
  files: Array<Files>;
  /** An aggregate relationship */
  files_aggregate: FilesAggregate;
  /** An array relationship */
  folders: Array<Folders>;
  /** An aggregate relationship */
  folders_aggregate: FoldersAggregate;
  id: Scalars['uuid']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  /** An array relationship */
  tasks: Array<Tasks>;
  /** An aggregate relationship */
  tasks_aggregate: TasksAggregate;
  /** An array relationship */
  workspaces: Array<Workspaces>;
  /** An aggregate relationship */
  workspaces_aggregate: WorkspacesAggregate;
};


/** columns and relationships of "users" */
export type UsersBlockCommentsArgs = {
  distinct_on?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockCommentsOrderBy>>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBlockCommentsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockCommentsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockCommentsOrderBy>>;
  where?: InputMaybe<BlockCommentsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBlockReactionsArgs = {
  distinct_on?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockReactionsOrderBy>>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBlockReactionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockReactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockReactionsOrderBy>>;
  where?: InputMaybe<BlockReactionsBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBlocksArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBlocksAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "users" */
export type UsersFilesArgs = {
  distinct_on?: InputMaybe<Array<FilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FilesOrderBy>>;
  where?: InputMaybe<FilesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<FilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FilesOrderBy>>;
  where?: InputMaybe<FilesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersFoldersArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersFoldersAggregateArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};


/** columns and relationships of "users" */
export type UsersTasksArgs = {
  distinct_on?: InputMaybe<Array<TasksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TasksOrderBy>>;
  where?: InputMaybe<TasksBoolExp>;
};


/** columns and relationships of "users" */
export type UsersTasksAggregateArgs = {
  distinct_on?: InputMaybe<Array<TasksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TasksOrderBy>>;
  where?: InputMaybe<TasksBoolExp>;
};


/** columns and relationships of "users" */
export type UsersWorkspacesArgs = {
  distinct_on?: InputMaybe<Array<WorkspacesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkspacesOrderBy>>;
  where?: InputMaybe<WorkspacesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersWorkspacesAggregateArgs = {
  distinct_on?: InputMaybe<Array<WorkspacesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<WorkspacesOrderBy>>;
  where?: InputMaybe<WorkspacesBoolExp>;
};

/** aggregated selection of "users" */
export type UsersAggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<UsersAggregateFields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type UsersAggregateFields = {
  __typename?: 'users_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<UsersMaxFields>;
  min?: Maybe<UsersMinFields>;
};


/** aggregate fields of "users" */
export type UsersAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UsersSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type UsersBoolExp = {
  _and?: InputMaybe<Array<UsersBoolExp>>;
  _not?: InputMaybe<UsersBoolExp>;
  _or?: InputMaybe<Array<UsersBoolExp>>;
  avatar_url?: InputMaybe<StringComparisonExp>;
  block_comments?: InputMaybe<BlockCommentsBoolExp>;
  block_comments_aggregate?: InputMaybe<BlockCommentsAggregateBoolExp>;
  block_reactions?: InputMaybe<BlockReactionsBoolExp>;
  block_reactions_aggregate?: InputMaybe<BlockReactionsAggregateBoolExp>;
  blocks?: InputMaybe<BlocksBoolExp>;
  blocks_aggregate?: InputMaybe<BlocksAggregateBoolExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  files?: InputMaybe<FilesBoolExp>;
  files_aggregate?: InputMaybe<FilesAggregateBoolExp>;
  folders?: InputMaybe<FoldersBoolExp>;
  folders_aggregate?: InputMaybe<FoldersAggregateBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  role?: InputMaybe<StringComparisonExp>;
  tasks?: InputMaybe<TasksBoolExp>;
  tasks_aggregate?: InputMaybe<TasksAggregateBoolExp>;
  workspaces?: InputMaybe<WorkspacesBoolExp>;
  workspaces_aggregate?: InputMaybe<WorkspacesAggregateBoolExp>;
};

/** unique or primary key constraints on table "users" */
export enum UsersConstraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = 'users_email_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey'
}

/** input type for inserting data into table "users" */
export type UsersInsertInput = {
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  block_comments?: InputMaybe<BlockCommentsArrRelInsertInput>;
  block_reactions?: InputMaybe<BlockReactionsArrRelInsertInput>;
  blocks?: InputMaybe<BlocksArrRelInsertInput>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<FilesArrRelInsertInput>;
  folders?: InputMaybe<FoldersArrRelInsertInput>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  tasks?: InputMaybe<TasksArrRelInsertInput>;
  workspaces?: InputMaybe<WorkspacesArrRelInsertInput>;
};

/** aggregate max on columns */
export type UsersMaxFields = {
  __typename?: 'users_max_fields';
  avatar_url?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type UsersMinFields = {
  __typename?: 'users_min_fields';
  avatar_url?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "users" */
export type UsersMutationResponse = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type UsersObjRelInsertInput = {
  data: UsersInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<UsersOnConflict>;
};

/** on_conflict condition type for table "users" */
export type UsersOnConflict = {
  constraint: UsersConstraint;
  update_columns?: Array<UsersUpdateColumn>;
  where?: InputMaybe<UsersBoolExp>;
};

/** Ordering options when selecting data from "users". */
export type UsersOrderBy = {
  avatar_url?: InputMaybe<OrderBy>;
  block_comments_aggregate?: InputMaybe<BlockCommentsAggregateOrderBy>;
  block_reactions_aggregate?: InputMaybe<BlockReactionsAggregateOrderBy>;
  blocks_aggregate?: InputMaybe<BlocksAggregateOrderBy>;
  created_at?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  files_aggregate?: InputMaybe<FilesAggregateOrderBy>;
  folders_aggregate?: InputMaybe<FoldersAggregateOrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  tasks_aggregate?: InputMaybe<TasksAggregateOrderBy>;
  workspaces_aggregate?: InputMaybe<WorkspacesAggregateOrderBy>;
};

/** primary key columns input for table: users */
export type UsersPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "users" */
export enum UsersSelectColumn {
  /** column name */
  AvatarUrl = 'avatar_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Role = 'role'
}

/** input type for updating data in table "users" */
export type UsersSetInput = {
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "users" */
export type UsersStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: UsersStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UsersStreamCursorValueInput = {
  avatar_url?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "users" */
export enum UsersUpdateColumn {
  /** column name */
  AvatarUrl = 'avatar_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Role = 'role'
}

export type UsersUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersSetInput>;
  /** filter the rows which have to be updated */
  where: UsersBoolExp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type UuidComparisonExp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

/** columns and relationships of "workspaces" */
export type Workspaces = {
  __typename?: 'workspaces';
  /** An array relationship */
  blocks: Array<Blocks>;
  /** An aggregate relationship */
  blocks_aggregate: BlocksAggregate;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  folders: Array<Folders>;
  /** An aggregate relationship */
  folders_aggregate: FoldersAggregate;
  id: Scalars['uuid']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  user?: Maybe<Users>;
};


/** columns and relationships of "workspaces" */
export type WorkspacesBlocksArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "workspaces" */
export type WorkspacesBlocksAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlocksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlocksOrderBy>>;
  where?: InputMaybe<BlocksBoolExp>;
};


/** columns and relationships of "workspaces" */
export type WorkspacesFoldersArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};


/** columns and relationships of "workspaces" */
export type WorkspacesFoldersAggregateArgs = {
  distinct_on?: InputMaybe<Array<FoldersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FoldersOrderBy>>;
  where?: InputMaybe<FoldersBoolExp>;
};

/** aggregated selection of "workspaces" */
export type WorkspacesAggregate = {
  __typename?: 'workspaces_aggregate';
  aggregate?: Maybe<WorkspacesAggregateFields>;
  nodes: Array<Workspaces>;
};

export type WorkspacesAggregateBoolExp = {
  count?: InputMaybe<WorkspacesAggregateBoolExpCount>;
};

export type WorkspacesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<WorkspacesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<WorkspacesBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "workspaces" */
export type WorkspacesAggregateFields = {
  __typename?: 'workspaces_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<WorkspacesMaxFields>;
  min?: Maybe<WorkspacesMinFields>;
};


/** aggregate fields of "workspaces" */
export type WorkspacesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<WorkspacesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "workspaces" */
export type WorkspacesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<WorkspacesMaxOrderBy>;
  min?: InputMaybe<WorkspacesMinOrderBy>;
};

/** input type for inserting array relation for remote table "workspaces" */
export type WorkspacesArrRelInsertInput = {
  data: Array<WorkspacesInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<WorkspacesOnConflict>;
};

/** Boolean expression to filter rows from the table "workspaces". All fields are combined with a logical 'AND'. */
export type WorkspacesBoolExp = {
  _and?: InputMaybe<Array<WorkspacesBoolExp>>;
  _not?: InputMaybe<WorkspacesBoolExp>;
  _or?: InputMaybe<Array<WorkspacesBoolExp>>;
  blocks?: InputMaybe<BlocksBoolExp>;
  blocks_aggregate?: InputMaybe<BlocksAggregateBoolExp>;
  created_at?: InputMaybe<TimestamptzComparisonExp>;
  created_by?: InputMaybe<UuidComparisonExp>;
  folders?: InputMaybe<FoldersBoolExp>;
  folders_aggregate?: InputMaybe<FoldersAggregateBoolExp>;
  id?: InputMaybe<UuidComparisonExp>;
  image_url?: InputMaybe<StringComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
};

/** unique or primary key constraints on table "workspaces" */
export enum WorkspacesConstraint {
  /** unique or primary key constraint on columns "created_by" */
  WorkspacesCreatedByKey = 'workspaces_created_by_key',
  /** unique or primary key constraint on columns "id" */
  WorkspacesPkey = 'workspaces_pkey'
}

/** input type for inserting data into table "workspaces" */
export type WorkspacesInsertInput = {
  blocks?: InputMaybe<BlocksArrRelInsertInput>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  folders?: InputMaybe<FoldersArrRelInsertInput>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
};

/** aggregate max on columns */
export type WorkspacesMaxFields = {
  __typename?: 'workspaces_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "workspaces" */
export type WorkspacesMaxOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  created_by?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  image_url?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type WorkspacesMinFields = {
  __typename?: 'workspaces_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "workspaces" */
export type WorkspacesMinOrderBy = {
  created_at?: InputMaybe<OrderBy>;
  created_by?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  image_url?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "workspaces" */
export type WorkspacesMutationResponse = {
  __typename?: 'workspaces_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Workspaces>;
};

/** input type for inserting object relation for remote table "workspaces" */
export type WorkspacesObjRelInsertInput = {
  data: WorkspacesInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<WorkspacesOnConflict>;
};

/** on_conflict condition type for table "workspaces" */
export type WorkspacesOnConflict = {
  constraint: WorkspacesConstraint;
  update_columns?: Array<WorkspacesUpdateColumn>;
  where?: InputMaybe<WorkspacesBoolExp>;
};

/** Ordering options when selecting data from "workspaces". */
export type WorkspacesOrderBy = {
  blocks_aggregate?: InputMaybe<BlocksAggregateOrderBy>;
  created_at?: InputMaybe<OrderBy>;
  created_by?: InputMaybe<OrderBy>;
  folders_aggregate?: InputMaybe<FoldersAggregateOrderBy>;
  id?: InputMaybe<OrderBy>;
  image_url?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
};

/** primary key columns input for table: workspaces */
export type WorkspacesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "workspaces" */
export enum WorkspacesSelectColumn {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "workspaces" */
export type WorkspacesSetInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "workspaces" */
export type WorkspacesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: WorkspacesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type WorkspacesStreamCursorValueInput = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "workspaces" */
export enum WorkspacesUpdateColumn {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  Name = 'name'
}

export type WorkspacesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<WorkspacesSetInput>;
  /** filter the rows which have to be updated */
  where: WorkspacesBoolExp;
};
