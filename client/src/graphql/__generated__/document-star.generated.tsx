import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type GetDocumentStarQueryVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
}>;


export type GetDocumentStarQuery = { __typename?: 'query_root', document_stars_by_pk?: { __typename?: 'document_stars', document_id: string, created_at: string } | null };

export type GetStarredDocumentsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetStarredDocumentsQuery = { __typename?: 'query_root', document_stars: Array<{ __typename?: 'document_stars', document_id: string, created_at: string, document: { __typename?: 'blocks', id: string, content?: any | null, workspace_id?: string | null, folder?: { __typename?: 'folders', id: string } | null } }> };

export type GetDocumentsToStarQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
}>;


export type GetDocumentsToStarQuery = { __typename?: 'query_root', blocks: Array<{ __typename?: 'blocks', id: string, content?: any | null, workspace_id?: string | null, folder?: { __typename?: 'folders', id: string, name: string } | null, document_stars: Array<{ __typename?: 'document_stars', document_id: string }> }> };

export type StarDocumentMutationVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
}>;


export type StarDocumentMutation = { __typename?: 'mutation_root', delete_existing_star?: { __typename?: 'document_stars_mutation_response', affected_rows: number } | null, insert_document_stars_one?: { __typename?: 'document_stars', document_id: string, created_at: string } | null };

export type UnstarDocumentMutationVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
}>;


export type UnstarDocumentMutation = { __typename?: 'mutation_root', delete_document_stars_by_pk?: { __typename?: 'document_stars', document_id: string } | null };

export type StarDocumentsMutationVariables = Types.Exact<{
  documentIds: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
  objects: Array<Types.DocumentStarsInsertInput> | Types.DocumentStarsInsertInput;
}>;


export type StarDocumentsMutation = { __typename?: 'mutation_root', delete_existing_stars?: { __typename?: 'document_stars_mutation_response', affected_rows: number } | null, insert_document_stars?: { __typename?: 'document_stars_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'document_stars', document_id: string }> } | null };

export type UnstarDocumentsMutationVariables = Types.Exact<{
  documentIds: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
}>;


export type UnstarDocumentsMutation = { __typename?: 'mutation_root', delete_document_stars?: { __typename?: 'document_stars_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'document_stars', document_id: string }> } | null };


export const GetDocumentStarDocument = gql`
    query GetDocumentStar($documentId: uuid!, $userId: uuid!) {
  document_stars_by_pk(document_id: $documentId, user_id: $userId) {
    document_id
    created_at
  }
}
    `;

/**
 * __useGetDocumentStarQuery__
 *
 * To run a query within a React component, call `useGetDocumentStarQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentStarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentStarQuery({
 *   variables: {
 *      documentId: // value for 'documentId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetDocumentStarQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentStarQuery, GetDocumentStarQueryVariables> & ({ variables: GetDocumentStarQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentStarQuery, GetDocumentStarQueryVariables>(GetDocumentStarDocument, options);
      }
export function useGetDocumentStarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentStarQuery, GetDocumentStarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentStarQuery, GetDocumentStarQueryVariables>(GetDocumentStarDocument, options);
        }
export function useGetDocumentStarSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocumentStarQuery, GetDocumentStarQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocumentStarQuery, GetDocumentStarQueryVariables>(GetDocumentStarDocument, options);
        }
export type GetDocumentStarQueryHookResult = ReturnType<typeof useGetDocumentStarQuery>;
export type GetDocumentStarLazyQueryHookResult = ReturnType<typeof useGetDocumentStarLazyQuery>;
export type GetDocumentStarSuspenseQueryHookResult = ReturnType<typeof useGetDocumentStarSuspenseQuery>;
export type GetDocumentStarQueryResult = Apollo.QueryResult<GetDocumentStarQuery, GetDocumentStarQueryVariables>;
export const GetStarredDocumentsDocument = gql`
    query GetStarredDocuments {
  document_stars(
    where: {document: {type: {_eq: "page"}, deleted_at: {_is_null: true}}}
    order_by: {created_at: desc}
  ) {
    document_id
    created_at
    document {
      id
      content
      workspace_id
      folder {
        id
      }
    }
  }
}
    `;

/**
 * __useGetStarredDocumentsQuery__
 *
 * To run a query within a React component, call `useGetStarredDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStarredDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStarredDocumentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStarredDocumentsQuery(baseOptions?: Apollo.QueryHookOptions<GetStarredDocumentsQuery, GetStarredDocumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStarredDocumentsQuery, GetStarredDocumentsQueryVariables>(GetStarredDocumentsDocument, options);
      }
export function useGetStarredDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStarredDocumentsQuery, GetStarredDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStarredDocumentsQuery, GetStarredDocumentsQueryVariables>(GetStarredDocumentsDocument, options);
        }
export function useGetStarredDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStarredDocumentsQuery, GetStarredDocumentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStarredDocumentsQuery, GetStarredDocumentsQueryVariables>(GetStarredDocumentsDocument, options);
        }
export type GetStarredDocumentsQueryHookResult = ReturnType<typeof useGetStarredDocumentsQuery>;
export type GetStarredDocumentsLazyQueryHookResult = ReturnType<typeof useGetStarredDocumentsLazyQuery>;
export type GetStarredDocumentsSuspenseQueryHookResult = ReturnType<typeof useGetStarredDocumentsSuspenseQuery>;
export type GetStarredDocumentsQueryResult = Apollo.QueryResult<GetStarredDocumentsQuery, GetStarredDocumentsQueryVariables>;
export const GetDocumentsToStarDocument = gql`
    query GetDocumentsToStar($workspaceId: uuid!, $userId: uuid!) {
  blocks(
    where: {type: {_eq: "page"}, deleted_at: {_is_null: true}, _or: [{workspace_id: {_eq: $workspaceId}}, {access_requests: {requester_id: {_eq: $userId}, status: {_eq: "approved"}}}]}
    order_by: {updated_at: desc}
  ) {
    id
    content
    workspace_id
    folder {
      id
      name
    }
    document_stars {
      document_id
    }
  }
}
    `;

/**
 * __useGetDocumentsToStarQuery__
 *
 * To run a query within a React component, call `useGetDocumentsToStarQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentsToStarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentsToStarQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetDocumentsToStarQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentsToStarQuery, GetDocumentsToStarQueryVariables> & ({ variables: GetDocumentsToStarQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentsToStarQuery, GetDocumentsToStarQueryVariables>(GetDocumentsToStarDocument, options);
      }
export function useGetDocumentsToStarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentsToStarQuery, GetDocumentsToStarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentsToStarQuery, GetDocumentsToStarQueryVariables>(GetDocumentsToStarDocument, options);
        }
export function useGetDocumentsToStarSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocumentsToStarQuery, GetDocumentsToStarQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocumentsToStarQuery, GetDocumentsToStarQueryVariables>(GetDocumentsToStarDocument, options);
        }
export type GetDocumentsToStarQueryHookResult = ReturnType<typeof useGetDocumentsToStarQuery>;
export type GetDocumentsToStarLazyQueryHookResult = ReturnType<typeof useGetDocumentsToStarLazyQuery>;
export type GetDocumentsToStarSuspenseQueryHookResult = ReturnType<typeof useGetDocumentsToStarSuspenseQuery>;
export type GetDocumentsToStarQueryResult = Apollo.QueryResult<GetDocumentsToStarQuery, GetDocumentsToStarQueryVariables>;
export const StarDocumentDocument = gql`
    mutation StarDocument($documentId: uuid!) {
  delete_existing_star: delete_document_stars(
    where: {document_id: {_eq: $documentId}}
  ) {
    affected_rows
  }
  insert_document_stars_one(object: {document_id: $documentId}) {
    document_id
    created_at
  }
}
    `;
export type StarDocumentMutationFn = Apollo.MutationFunction<StarDocumentMutation, StarDocumentMutationVariables>;

/**
 * __useStarDocumentMutation__
 *
 * To run a mutation, you first call `useStarDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStarDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [starDocumentMutation, { data, loading, error }] = useStarDocumentMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useStarDocumentMutation(baseOptions?: Apollo.MutationHookOptions<StarDocumentMutation, StarDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StarDocumentMutation, StarDocumentMutationVariables>(StarDocumentDocument, options);
      }
export type StarDocumentMutationHookResult = ReturnType<typeof useStarDocumentMutation>;
export type StarDocumentMutationResult = Apollo.MutationResult<StarDocumentMutation>;
export type StarDocumentMutationOptions = Apollo.BaseMutationOptions<StarDocumentMutation, StarDocumentMutationVariables>;
export const UnstarDocumentDocument = gql`
    mutation UnstarDocument($documentId: uuid!, $userId: uuid!) {
  delete_document_stars_by_pk(document_id: $documentId, user_id: $userId) {
    document_id
  }
}
    `;
export type UnstarDocumentMutationFn = Apollo.MutationFunction<UnstarDocumentMutation, UnstarDocumentMutationVariables>;

/**
 * __useUnstarDocumentMutation__
 *
 * To run a mutation, you first call `useUnstarDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnstarDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unstarDocumentMutation, { data, loading, error }] = useUnstarDocumentMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnstarDocumentMutation(baseOptions?: Apollo.MutationHookOptions<UnstarDocumentMutation, UnstarDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnstarDocumentMutation, UnstarDocumentMutationVariables>(UnstarDocumentDocument, options);
      }
export type UnstarDocumentMutationHookResult = ReturnType<typeof useUnstarDocumentMutation>;
export type UnstarDocumentMutationResult = Apollo.MutationResult<UnstarDocumentMutation>;
export type UnstarDocumentMutationOptions = Apollo.BaseMutationOptions<UnstarDocumentMutation, UnstarDocumentMutationVariables>;
export const StarDocumentsDocument = gql`
    mutation StarDocuments($documentIds: [uuid!]!, $objects: [document_stars_insert_input!]!) {
  delete_existing_stars: delete_document_stars(
    where: {document_id: {_in: $documentIds}}
  ) {
    affected_rows
  }
  insert_document_stars(objects: $objects) {
    affected_rows
    returning {
      document_id
    }
  }
}
    `;
export type StarDocumentsMutationFn = Apollo.MutationFunction<StarDocumentsMutation, StarDocumentsMutationVariables>;

/**
 * __useStarDocumentsMutation__
 *
 * To run a mutation, you first call `useStarDocumentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStarDocumentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [starDocumentsMutation, { data, loading, error }] = useStarDocumentsMutation({
 *   variables: {
 *      documentIds: // value for 'documentIds'
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useStarDocumentsMutation(baseOptions?: Apollo.MutationHookOptions<StarDocumentsMutation, StarDocumentsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StarDocumentsMutation, StarDocumentsMutationVariables>(StarDocumentsDocument, options);
      }
export type StarDocumentsMutationHookResult = ReturnType<typeof useStarDocumentsMutation>;
export type StarDocumentsMutationResult = Apollo.MutationResult<StarDocumentsMutation>;
export type StarDocumentsMutationOptions = Apollo.BaseMutationOptions<StarDocumentsMutation, StarDocumentsMutationVariables>;
export const UnstarDocumentsDocument = gql`
    mutation UnstarDocuments($documentIds: [uuid!]!) {
  delete_document_stars(where: {document_id: {_in: $documentIds}}) {
    affected_rows
    returning {
      document_id
    }
  }
}
    `;
export type UnstarDocumentsMutationFn = Apollo.MutationFunction<UnstarDocumentsMutation, UnstarDocumentsMutationVariables>;

/**
 * __useUnstarDocumentsMutation__
 *
 * To run a mutation, you first call `useUnstarDocumentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnstarDocumentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unstarDocumentsMutation, { data, loading, error }] = useUnstarDocumentsMutation({
 *   variables: {
 *      documentIds: // value for 'documentIds'
 *   },
 * });
 */
export function useUnstarDocumentsMutation(baseOptions?: Apollo.MutationHookOptions<UnstarDocumentsMutation, UnstarDocumentsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnstarDocumentsMutation, UnstarDocumentsMutationVariables>(UnstarDocumentsDocument, options);
      }
export type UnstarDocumentsMutationHookResult = ReturnType<typeof useUnstarDocumentsMutation>;
export type UnstarDocumentsMutationResult = Apollo.MutationResult<UnstarDocumentsMutation>;
export type UnstarDocumentsMutationOptions = Apollo.BaseMutationOptions<UnstarDocumentsMutation, UnstarDocumentsMutationVariables>;