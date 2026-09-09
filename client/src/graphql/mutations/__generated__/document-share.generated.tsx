import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type ShareDocumentWithUserMutationVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
  ownerId: Types.Scalars['uuid']['input'];
  permissionType: Types.Scalars['String']['input'];
}>;


export type ShareDocumentWithUserMutation = { __typename?: 'mutation_root', insert_access_requests_one?: { __typename?: 'access_requests', id: string, document_id: string, requester_id: string, owner_id: string, status?: string | null, permission_type?: string | null, created_at?: string | null, updated_at?: string | null } | null };

export type ShareDocumentWithUsersMutationVariables = Types.Exact<{
  objects: Array<Types.AccessRequestsInsertInput> | Types.AccessRequestsInsertInput;
}>;


export type ShareDocumentWithUsersMutation = { __typename?: 'mutation_root', insert_access_requests?: { __typename?: 'access_requests_mutation_response', affected_rows: number } | null };

export type SetDocumentLinkAccessMutationVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
  permissionType: Types.Scalars['String']['input'];
}>;


export type SetDocumentLinkAccessMutation = { __typename?: 'mutation_root', insert_document_link_access_one?: { __typename?: 'document_link_access', document_id: string, permission_type: string, updated_at: string } | null };

export type RemoveDocumentAccessMutationVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
}>;


export type RemoveDocumentAccessMutation = { __typename?: 'mutation_root', delete_access_requests?: { __typename?: 'access_requests_mutation_response', affected_rows: number } | null };

export type UpdateDocumentPermissionMutationVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
  permissionType: Types.Scalars['String']['input'];
}>;


export type UpdateDocumentPermissionMutation = { __typename?: 'mutation_root', update_access_requests?: { __typename?: 'access_requests_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'access_requests', id: string, permission_type?: string | null, updated_at?: string | null }> } | null };

export type GetDocumentSharedUsersQueryVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
}>;


export type GetDocumentSharedUsersQuery = { __typename?: 'query_root', access_requests: Array<{ __typename?: 'access_requests', id: string, requester_id: string, permission_type?: string | null, created_at?: string | null, requester: { __typename?: 'users', id: string, email: string, name?: string | null, avatar_url?: string | null } }>, pending_requests: Array<{ __typename?: 'access_requests', id: string, requester_id: string, permission_type?: string | null, created_at?: string | null, requester: { __typename?: 'users', id: string, email: string, name?: string | null, avatar_url?: string | null } }>, blocks_by_pk?: { __typename?: 'blocks', id: string, user_id?: string | null, content?: any | null, link_access?: { __typename?: 'document_link_access', permission_type: string } | null, user?: { __typename?: 'users', id: string, email: string, name?: string | null, avatar_url?: string | null } | null } | null };

export type ApproveAccessRequestMutationVariables = Types.Exact<{
  requestId: Types.Scalars['uuid']['input'];
}>;


export type ApproveAccessRequestMutation = { __typename?: 'mutation_root', update_access_requests_by_pk?: { __typename?: 'access_requests', id: string, status?: string | null, requester_id: string, document_id: string, permission_type?: string | null } | null };

export type DeclineAccessRequestMutationVariables = Types.Exact<{
  requestId: Types.Scalars['uuid']['input'];
  status: Types.Scalars['String']['input'];
}>;


export type DeclineAccessRequestMutation = { __typename?: 'mutation_root', update_access_requests_by_pk?: { __typename?: 'access_requests', id: string, status?: string | null, requester_id: string, document_id: string, permission_type?: string | null } | null };


export const ShareDocumentWithUserDocument = gql`
    mutation ShareDocumentWithUser($documentId: uuid!, $userId: uuid!, $ownerId: uuid!, $permissionType: String!) {
  insert_access_requests_one(
    object: {document_id: $documentId, requester_id: $userId, owner_id: $ownerId, status: "approved", permission_type: $permissionType}
    on_conflict: {constraint: access_requests_document_id_requester_id_key, update_columns: [permission_type, status, updated_at]}
  ) {
    id
    document_id
    requester_id
    owner_id
    status
    permission_type
    created_at
    updated_at
  }
}
    `;
export type ShareDocumentWithUserMutationFn = Apollo.MutationFunction<ShareDocumentWithUserMutation, ShareDocumentWithUserMutationVariables>;

/**
 * __useShareDocumentWithUserMutation__
 *
 * To run a mutation, you first call `useShareDocumentWithUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShareDocumentWithUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shareDocumentWithUserMutation, { data, loading, error }] = useShareDocumentWithUserMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *      userId: // value for 'userId'
 *      ownerId: // value for 'ownerId'
 *      permissionType: // value for 'permissionType'
 *   },
 * });
 */
export function useShareDocumentWithUserMutation(baseOptions?: Apollo.MutationHookOptions<ShareDocumentWithUserMutation, ShareDocumentWithUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShareDocumentWithUserMutation, ShareDocumentWithUserMutationVariables>(ShareDocumentWithUserDocument, options);
      }
export type ShareDocumentWithUserMutationHookResult = ReturnType<typeof useShareDocumentWithUserMutation>;
export type ShareDocumentWithUserMutationResult = Apollo.MutationResult<ShareDocumentWithUserMutation>;
export type ShareDocumentWithUserMutationOptions = Apollo.BaseMutationOptions<ShareDocumentWithUserMutation, ShareDocumentWithUserMutationVariables>;
export const ShareDocumentWithUsersDocument = gql`
    mutation ShareDocumentWithUsers($objects: [access_requests_insert_input!]!) {
  insert_access_requests(
    objects: $objects
    on_conflict: {constraint: access_requests_document_id_requester_id_key, update_columns: [permission_type, status, updated_at]}
  ) {
    affected_rows
  }
}
    `;
export type ShareDocumentWithUsersMutationFn = Apollo.MutationFunction<ShareDocumentWithUsersMutation, ShareDocumentWithUsersMutationVariables>;

/**
 * __useShareDocumentWithUsersMutation__
 *
 * To run a mutation, you first call `useShareDocumentWithUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShareDocumentWithUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shareDocumentWithUsersMutation, { data, loading, error }] = useShareDocumentWithUsersMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useShareDocumentWithUsersMutation(baseOptions?: Apollo.MutationHookOptions<ShareDocumentWithUsersMutation, ShareDocumentWithUsersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShareDocumentWithUsersMutation, ShareDocumentWithUsersMutationVariables>(ShareDocumentWithUsersDocument, options);
      }
export type ShareDocumentWithUsersMutationHookResult = ReturnType<typeof useShareDocumentWithUsersMutation>;
export type ShareDocumentWithUsersMutationResult = Apollo.MutationResult<ShareDocumentWithUsersMutation>;
export type ShareDocumentWithUsersMutationOptions = Apollo.BaseMutationOptions<ShareDocumentWithUsersMutation, ShareDocumentWithUsersMutationVariables>;
export const SetDocumentLinkAccessDocument = gql`
    mutation SetDocumentLinkAccess($documentId: uuid!, $permissionType: String!) {
  insert_document_link_access_one(
    object: {document_id: $documentId, permission_type: $permissionType}
    on_conflict: {constraint: document_link_access_pkey, update_columns: [permission_type, updated_at]}
  ) {
    document_id
    permission_type
    updated_at
  }
}
    `;
export type SetDocumentLinkAccessMutationFn = Apollo.MutationFunction<SetDocumentLinkAccessMutation, SetDocumentLinkAccessMutationVariables>;

/**
 * __useSetDocumentLinkAccessMutation__
 *
 * To run a mutation, you first call `useSetDocumentLinkAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDocumentLinkAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDocumentLinkAccessMutation, { data, loading, error }] = useSetDocumentLinkAccessMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *      permissionType: // value for 'permissionType'
 *   },
 * });
 */
export function useSetDocumentLinkAccessMutation(baseOptions?: Apollo.MutationHookOptions<SetDocumentLinkAccessMutation, SetDocumentLinkAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDocumentLinkAccessMutation, SetDocumentLinkAccessMutationVariables>(SetDocumentLinkAccessDocument, options);
      }
export type SetDocumentLinkAccessMutationHookResult = ReturnType<typeof useSetDocumentLinkAccessMutation>;
export type SetDocumentLinkAccessMutationResult = Apollo.MutationResult<SetDocumentLinkAccessMutation>;
export type SetDocumentLinkAccessMutationOptions = Apollo.BaseMutationOptions<SetDocumentLinkAccessMutation, SetDocumentLinkAccessMutationVariables>;
export const RemoveDocumentAccessDocument = gql`
    mutation RemoveDocumentAccess($documentId: uuid!, $userId: uuid!) {
  delete_access_requests(
    where: {document_id: {_eq: $documentId}, requester_id: {_eq: $userId}}
  ) {
    affected_rows
  }
}
    `;
export type RemoveDocumentAccessMutationFn = Apollo.MutationFunction<RemoveDocumentAccessMutation, RemoveDocumentAccessMutationVariables>;

/**
 * __useRemoveDocumentAccessMutation__
 *
 * To run a mutation, you first call `useRemoveDocumentAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveDocumentAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeDocumentAccessMutation, { data, loading, error }] = useRemoveDocumentAccessMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRemoveDocumentAccessMutation(baseOptions?: Apollo.MutationHookOptions<RemoveDocumentAccessMutation, RemoveDocumentAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveDocumentAccessMutation, RemoveDocumentAccessMutationVariables>(RemoveDocumentAccessDocument, options);
      }
export type RemoveDocumentAccessMutationHookResult = ReturnType<typeof useRemoveDocumentAccessMutation>;
export type RemoveDocumentAccessMutationResult = Apollo.MutationResult<RemoveDocumentAccessMutation>;
export type RemoveDocumentAccessMutationOptions = Apollo.BaseMutationOptions<RemoveDocumentAccessMutation, RemoveDocumentAccessMutationVariables>;
export const UpdateDocumentPermissionDocument = gql`
    mutation UpdateDocumentPermission($documentId: uuid!, $userId: uuid!, $permissionType: String!) {
  update_access_requests(
    where: {document_id: {_eq: $documentId}, requester_id: {_eq: $userId}}
    _set: {permission_type: $permissionType, updated_at: "now()"}
  ) {
    affected_rows
    returning {
      id
      permission_type
      updated_at
    }
  }
}
    `;
export type UpdateDocumentPermissionMutationFn = Apollo.MutationFunction<UpdateDocumentPermissionMutation, UpdateDocumentPermissionMutationVariables>;

/**
 * __useUpdateDocumentPermissionMutation__
 *
 * To run a mutation, you first call `useUpdateDocumentPermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDocumentPermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDocumentPermissionMutation, { data, loading, error }] = useUpdateDocumentPermissionMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *      userId: // value for 'userId'
 *      permissionType: // value for 'permissionType'
 *   },
 * });
 */
export function useUpdateDocumentPermissionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDocumentPermissionMutation, UpdateDocumentPermissionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDocumentPermissionMutation, UpdateDocumentPermissionMutationVariables>(UpdateDocumentPermissionDocument, options);
      }
export type UpdateDocumentPermissionMutationHookResult = ReturnType<typeof useUpdateDocumentPermissionMutation>;
export type UpdateDocumentPermissionMutationResult = Apollo.MutationResult<UpdateDocumentPermissionMutation>;
export type UpdateDocumentPermissionMutationOptions = Apollo.BaseMutationOptions<UpdateDocumentPermissionMutation, UpdateDocumentPermissionMutationVariables>;
export const GetDocumentSharedUsersDocument = gql`
    query GetDocumentSharedUsers($documentId: uuid!) {
  access_requests(
    where: {document_id: {_eq: $documentId}, status: {_eq: "approved"}}
  ) {
    id
    requester_id
    permission_type
    created_at
    requester {
      id
      email
      name
      avatar_url
    }
  }
  pending_requests: access_requests(
    where: {document_id: {_eq: $documentId}, status: {_eq: "pending"}}
    order_by: {created_at: desc}
  ) {
    id
    requester_id
    permission_type
    created_at
    requester {
      id
      email
      name
      avatar_url
    }
  }
  blocks_by_pk(id: $documentId) {
    id
    user_id
    content
    link_access {
      permission_type
    }
    user {
      id
      email
      name
      avatar_url
    }
  }
}
    `;

/**
 * __useGetDocumentSharedUsersQuery__
 *
 * To run a query within a React component, call `useGetDocumentSharedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentSharedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentSharedUsersQuery({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useGetDocumentSharedUsersQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentSharedUsersQuery, GetDocumentSharedUsersQueryVariables> & ({ variables: GetDocumentSharedUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentSharedUsersQuery, GetDocumentSharedUsersQueryVariables>(GetDocumentSharedUsersDocument, options);
      }
export function useGetDocumentSharedUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentSharedUsersQuery, GetDocumentSharedUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentSharedUsersQuery, GetDocumentSharedUsersQueryVariables>(GetDocumentSharedUsersDocument, options);
        }
export function useGetDocumentSharedUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocumentSharedUsersQuery, GetDocumentSharedUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocumentSharedUsersQuery, GetDocumentSharedUsersQueryVariables>(GetDocumentSharedUsersDocument, options);
        }
export type GetDocumentSharedUsersQueryHookResult = ReturnType<typeof useGetDocumentSharedUsersQuery>;
export type GetDocumentSharedUsersLazyQueryHookResult = ReturnType<typeof useGetDocumentSharedUsersLazyQuery>;
export type GetDocumentSharedUsersSuspenseQueryHookResult = ReturnType<typeof useGetDocumentSharedUsersSuspenseQuery>;
export type GetDocumentSharedUsersQueryResult = Apollo.QueryResult<GetDocumentSharedUsersQuery, GetDocumentSharedUsersQueryVariables>;
export const ApproveAccessRequestDocument = gql`
    mutation ApproveAccessRequest($requestId: uuid!) {
  update_access_requests_by_pk(
    pk_columns: {id: $requestId}
    _set: {status: "approved", updated_at: "now()"}
  ) {
    id
    status
    requester_id
    document_id
    permission_type
  }
}
    `;
export type ApproveAccessRequestMutationFn = Apollo.MutationFunction<ApproveAccessRequestMutation, ApproveAccessRequestMutationVariables>;

/**
 * __useApproveAccessRequestMutation__
 *
 * To run a mutation, you first call `useApproveAccessRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveAccessRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveAccessRequestMutation, { data, loading, error }] = useApproveAccessRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useApproveAccessRequestMutation(baseOptions?: Apollo.MutationHookOptions<ApproveAccessRequestMutation, ApproveAccessRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveAccessRequestMutation, ApproveAccessRequestMutationVariables>(ApproveAccessRequestDocument, options);
      }
export type ApproveAccessRequestMutationHookResult = ReturnType<typeof useApproveAccessRequestMutation>;
export type ApproveAccessRequestMutationResult = Apollo.MutationResult<ApproveAccessRequestMutation>;
export type ApproveAccessRequestMutationOptions = Apollo.BaseMutationOptions<ApproveAccessRequestMutation, ApproveAccessRequestMutationVariables>;
export const DeclineAccessRequestDocument = gql`
    mutation DeclineAccessRequest($requestId: uuid!, $status: String!) {
  update_access_requests_by_pk(
    pk_columns: {id: $requestId}
    _set: {status: $status, permission_type: "read", updated_at: "now()"}
  ) {
    id
    status
    requester_id
    document_id
    permission_type
  }
}
    `;
export type DeclineAccessRequestMutationFn = Apollo.MutationFunction<DeclineAccessRequestMutation, DeclineAccessRequestMutationVariables>;

/**
 * __useDeclineAccessRequestMutation__
 *
 * To run a mutation, you first call `useDeclineAccessRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineAccessRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineAccessRequestMutation, { data, loading, error }] = useDeclineAccessRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useDeclineAccessRequestMutation(baseOptions?: Apollo.MutationHookOptions<DeclineAccessRequestMutation, DeclineAccessRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeclineAccessRequestMutation, DeclineAccessRequestMutationVariables>(DeclineAccessRequestDocument, options);
      }
export type DeclineAccessRequestMutationHookResult = ReturnType<typeof useDeclineAccessRequestMutation>;
export type DeclineAccessRequestMutationResult = Apollo.MutationResult<DeclineAccessRequestMutation>;
export type DeclineAccessRequestMutationOptions = Apollo.BaseMutationOptions<DeclineAccessRequestMutation, DeclineAccessRequestMutationVariables>;
