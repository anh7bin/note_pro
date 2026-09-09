import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type SoftDeleteDocumentMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type SoftDeleteDocumentMutation = { __typename?: 'mutation_root', update_blocks_by_pk?: { __typename?: 'blocks', id: string } | null };

export type CreateUntitledPageMutationVariables = Types.Exact<{
  input: Types.BlocksInsertInput;
}>;


export type CreateUntitledPageMutation = { __typename?: 'mutation_root', insert_blocks_one?: { __typename?: 'blocks', id: string } | null };

export type UpdateBlockMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  input: Types.BlocksSetInput;
}>;


export type UpdateBlockMutation = { __typename?: 'mutation_root', update_blocks_by_pk?: { __typename?: 'blocks', id: string, content?: any | null, cover_image?: string | null, position?: number | null, parent_id?: string | null, page_id?: string | null, type: string, created_at?: string | null, updated_at?: string | null } | null };

export type DeleteBlockMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type DeleteBlockMutation = { __typename?: 'mutation_root', delete_blocks_by_pk?: { __typename?: 'blocks', id: string } | null };

export type InsertBlockAndUpdatePositionMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  pageId: Types.Scalars['uuid']['input'];
  position: Types.Scalars['Int']['input'];
  type: Types.Scalars['String']['input'];
  workspaceId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
  content: Types.Scalars['jsonb']['input'];
}>;


export type InsertBlockAndUpdatePositionMutation = { __typename?: 'mutation_root', update_blocks?: { __typename?: 'blocks_mutation_response', affected_rows: number } | null, insert_blocks_one?: { __typename?: 'blocks', id: string, content?: any | null, cover_image?: string | null, position?: number | null, parent_id?: string | null, page_id?: string | null, type: string, created_at?: string | null, updated_at?: string | null } | null };

export type UpdateBlocksPositionsMutationVariables = Types.Exact<{
  updates: Array<Types.BlocksUpdates> | Types.BlocksUpdates;
}>;


export type UpdateBlocksPositionsMutation = { __typename?: 'mutation_root', update_blocks_many?: Array<{ __typename?: 'blocks_mutation_response', returning: Array<{ __typename?: 'blocks', id: string, position?: number | null, updated_at?: string | null }> } | null> | null };

export type MoveDocumentToFolderMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  folderId?: Types.InputMaybe<Types.Scalars['uuid']['input']>;
}>;


export type MoveDocumentToFolderMutation = { __typename?: 'mutation_root', update_blocks_by_pk?: { __typename?: 'blocks', id: string, folder_id?: string | null, folder?: { __typename?: 'folders', id: string, name: string } | null } | null };

export type BulkMoveDocumentsToFolderMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
  folderId?: Types.InputMaybe<Types.Scalars['uuid']['input']>;
}>;


export type BulkMoveDocumentsToFolderMutation = { __typename?: 'mutation_root', update_blocks?: { __typename?: 'blocks_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'blocks', id: string, folder_id?: string | null }> } | null };

export type BulkDeleteDocumentsMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
}>;


export type BulkDeleteDocumentsMutation = { __typename?: 'mutation_root', update_blocks?: { __typename?: 'blocks_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'blocks', id: string, deleted_at?: string | null }> } | null };

export type BulkDeleteDocumentsAndFoldersMutationVariables = Types.Exact<{
  documentIds: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
  folderIds: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
}>;


export type BulkDeleteDocumentsAndFoldersMutation = { __typename?: 'mutation_root', delete_documents?: { __typename?: 'blocks_mutation_response', affected_rows: number } | null, delete_folders?: { __typename?: 'folders_mutation_response', affected_rows: number } | null };


export const SoftDeleteDocumentDocument = gql`
    mutation SoftDeleteDocument($id: uuid!) {
  update_blocks_by_pk(pk_columns: {id: $id}, _set: {deleted_at: "now()"}) {
    id
  }
}
    `;
export type SoftDeleteDocumentMutationFn = Apollo.MutationFunction<SoftDeleteDocumentMutation, SoftDeleteDocumentMutationVariables>;

/**
 * __useSoftDeleteDocumentMutation__
 *
 * To run a mutation, you first call `useSoftDeleteDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSoftDeleteDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [softDeleteDocumentMutation, { data, loading, error }] = useSoftDeleteDocumentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSoftDeleteDocumentMutation(baseOptions?: Apollo.MutationHookOptions<SoftDeleteDocumentMutation, SoftDeleteDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SoftDeleteDocumentMutation, SoftDeleteDocumentMutationVariables>(SoftDeleteDocumentDocument, options);
      }
export type SoftDeleteDocumentMutationHookResult = ReturnType<typeof useSoftDeleteDocumentMutation>;
export type SoftDeleteDocumentMutationResult = Apollo.MutationResult<SoftDeleteDocumentMutation>;
export type SoftDeleteDocumentMutationOptions = Apollo.BaseMutationOptions<SoftDeleteDocumentMutation, SoftDeleteDocumentMutationVariables>;
export const CreateUntitledPageDocument = gql`
    mutation CreateUntitledPage($input: blocks_insert_input!) {
  insert_blocks_one(object: $input) {
    id
  }
}
    `;
export type CreateUntitledPageMutationFn = Apollo.MutationFunction<CreateUntitledPageMutation, CreateUntitledPageMutationVariables>;

/**
 * __useCreateUntitledPageMutation__
 *
 * To run a mutation, you first call `useCreateUntitledPageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUntitledPageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUntitledPageMutation, { data, loading, error }] = useCreateUntitledPageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUntitledPageMutation(baseOptions?: Apollo.MutationHookOptions<CreateUntitledPageMutation, CreateUntitledPageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUntitledPageMutation, CreateUntitledPageMutationVariables>(CreateUntitledPageDocument, options);
      }
export type CreateUntitledPageMutationHookResult = ReturnType<typeof useCreateUntitledPageMutation>;
export type CreateUntitledPageMutationResult = Apollo.MutationResult<CreateUntitledPageMutation>;
export type CreateUntitledPageMutationOptions = Apollo.BaseMutationOptions<CreateUntitledPageMutation, CreateUntitledPageMutationVariables>;
export const UpdateBlockDocument = gql`
    mutation UpdateBlock($id: uuid!, $input: blocks_set_input!) {
  update_blocks_by_pk(pk_columns: {id: $id}, _set: $input) {
    id
    content
    cover_image
    position
    parent_id
    page_id
    type
    created_at
    updated_at
  }
}
    `;
export type UpdateBlockMutationFn = Apollo.MutationFunction<UpdateBlockMutation, UpdateBlockMutationVariables>;

/**
 * __useUpdateBlockMutation__
 *
 * To run a mutation, you first call `useUpdateBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBlockMutation, { data, loading, error }] = useUpdateBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBlockMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBlockMutation, UpdateBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBlockMutation, UpdateBlockMutationVariables>(UpdateBlockDocument, options);
      }
export type UpdateBlockMutationHookResult = ReturnType<typeof useUpdateBlockMutation>;
export type UpdateBlockMutationResult = Apollo.MutationResult<UpdateBlockMutation>;
export type UpdateBlockMutationOptions = Apollo.BaseMutationOptions<UpdateBlockMutation, UpdateBlockMutationVariables>;
export const DeleteBlockDocument = gql`
    mutation DeleteBlock($id: uuid!) {
  delete_blocks_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteBlockMutationFn = Apollo.MutationFunction<DeleteBlockMutation, DeleteBlockMutationVariables>;

/**
 * __useDeleteBlockMutation__
 *
 * To run a mutation, you first call `useDeleteBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBlockMutation, { data, loading, error }] = useDeleteBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBlockMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBlockMutation, DeleteBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBlockMutation, DeleteBlockMutationVariables>(DeleteBlockDocument, options);
      }
export type DeleteBlockMutationHookResult = ReturnType<typeof useDeleteBlockMutation>;
export type DeleteBlockMutationResult = Apollo.MutationResult<DeleteBlockMutation>;
export type DeleteBlockMutationOptions = Apollo.BaseMutationOptions<DeleteBlockMutation, DeleteBlockMutationVariables>;
export const InsertBlockAndUpdatePositionDocument = gql`
    mutation InsertBlockAndUpdatePosition($id: uuid!, $pageId: uuid!, $position: Int!, $type: String!, $workspaceId: uuid!, $userId: uuid!, $content: jsonb!) {
  update_blocks(
    where: {page_id: {_eq: $pageId}, position: {_gte: $position}}
    _inc: {position: 1}
    _set: {updated_at: "now()"}
  ) {
    affected_rows
  }
  insert_blocks_one(
    object: {id: $id, page_id: $pageId, position: $position, type: $type, workspace_id: $workspaceId, user_id: $userId, content: $content}
  ) {
    id
    content
    cover_image
    position
    parent_id
    page_id
    type
    created_at
    updated_at
  }
}
    `;
export type InsertBlockAndUpdatePositionMutationFn = Apollo.MutationFunction<InsertBlockAndUpdatePositionMutation, InsertBlockAndUpdatePositionMutationVariables>;

/**
 * __useInsertBlockAndUpdatePositionMutation__
 *
 * To run a mutation, you first call `useInsertBlockAndUpdatePositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertBlockAndUpdatePositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertBlockAndUpdatePositionMutation, { data, loading, error }] = useInsertBlockAndUpdatePositionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      pageId: // value for 'pageId'
 *      position: // value for 'position'
 *      type: // value for 'type'
 *      workspaceId: // value for 'workspaceId'
 *      userId: // value for 'userId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useInsertBlockAndUpdatePositionMutation(baseOptions?: Apollo.MutationHookOptions<InsertBlockAndUpdatePositionMutation, InsertBlockAndUpdatePositionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertBlockAndUpdatePositionMutation, InsertBlockAndUpdatePositionMutationVariables>(InsertBlockAndUpdatePositionDocument, options);
      }
export type InsertBlockAndUpdatePositionMutationHookResult = ReturnType<typeof useInsertBlockAndUpdatePositionMutation>;
export type InsertBlockAndUpdatePositionMutationResult = Apollo.MutationResult<InsertBlockAndUpdatePositionMutation>;
export type InsertBlockAndUpdatePositionMutationOptions = Apollo.BaseMutationOptions<InsertBlockAndUpdatePositionMutation, InsertBlockAndUpdatePositionMutationVariables>;
export const UpdateBlocksPositionsDocument = gql`
    mutation UpdateBlocksPositions($updates: [blocks_updates!]!) {
  update_blocks_many(updates: $updates) {
    returning {
      id
      position
      updated_at
    }
  }
}
    `;
export type UpdateBlocksPositionsMutationFn = Apollo.MutationFunction<UpdateBlocksPositionsMutation, UpdateBlocksPositionsMutationVariables>;

/**
 * __useUpdateBlocksPositionsMutation__
 *
 * To run a mutation, you first call `useUpdateBlocksPositionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBlocksPositionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBlocksPositionsMutation, { data, loading, error }] = useUpdateBlocksPositionsMutation({
 *   variables: {
 *      updates: // value for 'updates'
 *   },
 * });
 */
export function useUpdateBlocksPositionsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBlocksPositionsMutation, UpdateBlocksPositionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBlocksPositionsMutation, UpdateBlocksPositionsMutationVariables>(UpdateBlocksPositionsDocument, options);
      }
export type UpdateBlocksPositionsMutationHookResult = ReturnType<typeof useUpdateBlocksPositionsMutation>;
export type UpdateBlocksPositionsMutationResult = Apollo.MutationResult<UpdateBlocksPositionsMutation>;
export type UpdateBlocksPositionsMutationOptions = Apollo.BaseMutationOptions<UpdateBlocksPositionsMutation, UpdateBlocksPositionsMutationVariables>;
export const MoveDocumentToFolderDocument = gql`
    mutation MoveDocumentToFolder($id: uuid!, $folderId: uuid) {
  update_blocks_by_pk(pk_columns: {id: $id}, _set: {folder_id: $folderId}) {
    id
    folder_id
    folder {
      id
      name
    }
  }
}
    `;
export type MoveDocumentToFolderMutationFn = Apollo.MutationFunction<MoveDocumentToFolderMutation, MoveDocumentToFolderMutationVariables>;

/**
 * __useMoveDocumentToFolderMutation__
 *
 * To run a mutation, you first call `useMoveDocumentToFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveDocumentToFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveDocumentToFolderMutation, { data, loading, error }] = useMoveDocumentToFolderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      folderId: // value for 'folderId'
 *   },
 * });
 */
export function useMoveDocumentToFolderMutation(baseOptions?: Apollo.MutationHookOptions<MoveDocumentToFolderMutation, MoveDocumentToFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveDocumentToFolderMutation, MoveDocumentToFolderMutationVariables>(MoveDocumentToFolderDocument, options);
      }
export type MoveDocumentToFolderMutationHookResult = ReturnType<typeof useMoveDocumentToFolderMutation>;
export type MoveDocumentToFolderMutationResult = Apollo.MutationResult<MoveDocumentToFolderMutation>;
export type MoveDocumentToFolderMutationOptions = Apollo.BaseMutationOptions<MoveDocumentToFolderMutation, MoveDocumentToFolderMutationVariables>;
export const BulkMoveDocumentsToFolderDocument = gql`
    mutation BulkMoveDocumentsToFolder($ids: [uuid!]!, $folderId: uuid) {
  update_blocks(where: {id: {_in: $ids}}, _set: {folder_id: $folderId}) {
    affected_rows
    returning {
      id
      folder_id
    }
  }
}
    `;
export type BulkMoveDocumentsToFolderMutationFn = Apollo.MutationFunction<BulkMoveDocumentsToFolderMutation, BulkMoveDocumentsToFolderMutationVariables>;

/**
 * __useBulkMoveDocumentsToFolderMutation__
 *
 * To run a mutation, you first call `useBulkMoveDocumentsToFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkMoveDocumentsToFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkMoveDocumentsToFolderMutation, { data, loading, error }] = useBulkMoveDocumentsToFolderMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *      folderId: // value for 'folderId'
 *   },
 * });
 */
export function useBulkMoveDocumentsToFolderMutation(baseOptions?: Apollo.MutationHookOptions<BulkMoveDocumentsToFolderMutation, BulkMoveDocumentsToFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkMoveDocumentsToFolderMutation, BulkMoveDocumentsToFolderMutationVariables>(BulkMoveDocumentsToFolderDocument, options);
      }
export type BulkMoveDocumentsToFolderMutationHookResult = ReturnType<typeof useBulkMoveDocumentsToFolderMutation>;
export type BulkMoveDocumentsToFolderMutationResult = Apollo.MutationResult<BulkMoveDocumentsToFolderMutation>;
export type BulkMoveDocumentsToFolderMutationOptions = Apollo.BaseMutationOptions<BulkMoveDocumentsToFolderMutation, BulkMoveDocumentsToFolderMutationVariables>;
export const BulkDeleteDocumentsDocument = gql`
    mutation BulkDeleteDocuments($ids: [uuid!]!) {
  update_blocks(where: {id: {_in: $ids}}, _set: {deleted_at: "now()"}) {
    affected_rows
    returning {
      id
      deleted_at
    }
  }
}
    `;
export type BulkDeleteDocumentsMutationFn = Apollo.MutationFunction<BulkDeleteDocumentsMutation, BulkDeleteDocumentsMutationVariables>;

/**
 * __useBulkDeleteDocumentsMutation__
 *
 * To run a mutation, you first call `useBulkDeleteDocumentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteDocumentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteDocumentsMutation, { data, loading, error }] = useBulkDeleteDocumentsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useBulkDeleteDocumentsMutation(baseOptions?: Apollo.MutationHookOptions<BulkDeleteDocumentsMutation, BulkDeleteDocumentsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDeleteDocumentsMutation, BulkDeleteDocumentsMutationVariables>(BulkDeleteDocumentsDocument, options);
      }
export type BulkDeleteDocumentsMutationHookResult = ReturnType<typeof useBulkDeleteDocumentsMutation>;
export type BulkDeleteDocumentsMutationResult = Apollo.MutationResult<BulkDeleteDocumentsMutation>;
export type BulkDeleteDocumentsMutationOptions = Apollo.BaseMutationOptions<BulkDeleteDocumentsMutation, BulkDeleteDocumentsMutationVariables>;
export const BulkDeleteDocumentsAndFoldersDocument = gql`
    mutation BulkDeleteDocumentsAndFolders($documentIds: [uuid!]!, $folderIds: [uuid!]!) {
  delete_documents: update_blocks(
    where: {id: {_in: $documentIds}}
    _set: {deleted_at: "now()"}
  ) {
    affected_rows
  }
  delete_folders: delete_folders(where: {id: {_in: $folderIds}}) {
    affected_rows
  }
}
    `;
export type BulkDeleteDocumentsAndFoldersMutationFn = Apollo.MutationFunction<BulkDeleteDocumentsAndFoldersMutation, BulkDeleteDocumentsAndFoldersMutationVariables>;

/**
 * __useBulkDeleteDocumentsAndFoldersMutation__
 *
 * To run a mutation, you first call `useBulkDeleteDocumentsAndFoldersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteDocumentsAndFoldersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteDocumentsAndFoldersMutation, { data, loading, error }] = useBulkDeleteDocumentsAndFoldersMutation({
 *   variables: {
 *      documentIds: // value for 'documentIds'
 *      folderIds: // value for 'folderIds'
 *   },
 * });
 */
export function useBulkDeleteDocumentsAndFoldersMutation(baseOptions?: Apollo.MutationHookOptions<BulkDeleteDocumentsAndFoldersMutation, BulkDeleteDocumentsAndFoldersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDeleteDocumentsAndFoldersMutation, BulkDeleteDocumentsAndFoldersMutationVariables>(BulkDeleteDocumentsAndFoldersDocument, options);
      }
export type BulkDeleteDocumentsAndFoldersMutationHookResult = ReturnType<typeof useBulkDeleteDocumentsAndFoldersMutation>;
export type BulkDeleteDocumentsAndFoldersMutationResult = Apollo.MutationResult<BulkDeleteDocumentsAndFoldersMutation>;
export type BulkDeleteDocumentsAndFoldersMutationOptions = Apollo.BaseMutationOptions<BulkDeleteDocumentsAndFoldersMutation, BulkDeleteDocumentsAndFoldersMutationVariables>;