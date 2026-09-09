import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type GetBlockInteractionsQueryVariables = Types.Exact<{
  pageId: Types.Scalars['uuid']['input'];
}>;


export type GetBlockInteractionsQuery = { __typename?: 'query_root', block_comments: Array<{ __typename?: 'block_comments', id: string, block_id: string, user_id: string, content: string, created_at: string, user: { __typename?: 'users', id: string, name?: string | null, avatar_url?: string | null } }>, block_reactions: Array<{ __typename?: 'block_reactions', id: string, block_id: string, user_id: string, emoji: string, created_at: string, user: { __typename?: 'users', id: string, name?: string | null, avatar_url?: string | null } }> };

export type SubscribeToBlockCommentsSubscriptionVariables = Types.Exact<{
  pageId: Types.Scalars['uuid']['input'];
}>;


export type SubscribeToBlockCommentsSubscription = { __typename?: 'subscription_root', block_comments: Array<{ __typename?: 'block_comments', id: string, block_id: string, user_id: string, content: string, created_at: string, user: { __typename?: 'users', id: string, name?: string | null, avatar_url?: string | null } }> };

export type SubscribeToBlockReactionsSubscriptionVariables = Types.Exact<{
  pageId: Types.Scalars['uuid']['input'];
}>;


export type SubscribeToBlockReactionsSubscription = { __typename?: 'subscription_root', block_reactions: Array<{ __typename?: 'block_reactions', id: string, block_id: string, user_id: string, emoji: string, created_at: string, user: { __typename?: 'users', id: string, name?: string | null, avatar_url?: string | null } }> };

export type AddBlockCommentMutationVariables = Types.Exact<{
  blockId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
  content: Types.Scalars['String']['input'];
}>;


export type AddBlockCommentMutation = { __typename?: 'mutation_root', insert_block_comments_one?: { __typename?: 'block_comments', id: string, block_id: string, user_id: string, content: string, created_at: string, user: { __typename?: 'users', id: string, name?: string | null, avatar_url?: string | null } } | null };

export type DeleteBlockCommentMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type DeleteBlockCommentMutation = { __typename?: 'mutation_root', delete_block_comments_by_pk?: { __typename?: 'block_comments', id: string } | null };

export type AddBlockReactionMutationVariables = Types.Exact<{
  blockId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
  emoji: Types.Scalars['String']['input'];
}>;


export type AddBlockReactionMutation = { __typename?: 'mutation_root', insert_block_reactions_one?: { __typename?: 'block_reactions', id: string, block_id: string, user_id: string, emoji: string, created_at: string, user: { __typename?: 'users', id: string, name?: string | null, avatar_url?: string | null } } | null };

export type DeleteBlockReactionMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type DeleteBlockReactionMutation = { __typename?: 'mutation_root', delete_block_reactions_by_pk?: { __typename?: 'block_reactions', id: string } | null };


export const GetBlockInteractionsDocument = gql`
    query GetBlockInteractions($pageId: uuid!) {
  block_comments(
    where: {block: {_or: [{id: {_eq: $pageId}}, {page_id: {_eq: $pageId}}]}}
    order_by: {created_at: asc}
  ) {
    id
    block_id
    user_id
    content
    created_at
    user {
      id
      name
      avatar_url
    }
  }
  block_reactions(
    where: {block: {_or: [{id: {_eq: $pageId}}, {page_id: {_eq: $pageId}}]}}
    order_by: {created_at: asc}
  ) {
    id
    block_id
    user_id
    emoji
    created_at
    user {
      id
      name
      avatar_url
    }
  }
}
    `;

/**
 * __useGetBlockInteractionsQuery__
 *
 * To run a query within a React component, call `useGetBlockInteractionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockInteractionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlockInteractionsQuery({
 *   variables: {
 *      pageId: // value for 'pageId'
 *   },
 * });
 */
export function useGetBlockInteractionsQuery(baseOptions: Apollo.QueryHookOptions<GetBlockInteractionsQuery, GetBlockInteractionsQueryVariables> & ({ variables: GetBlockInteractionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBlockInteractionsQuery, GetBlockInteractionsQueryVariables>(GetBlockInteractionsDocument, options);
      }
export function useGetBlockInteractionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBlockInteractionsQuery, GetBlockInteractionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBlockInteractionsQuery, GetBlockInteractionsQueryVariables>(GetBlockInteractionsDocument, options);
        }
export function useGetBlockInteractionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBlockInteractionsQuery, GetBlockInteractionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBlockInteractionsQuery, GetBlockInteractionsQueryVariables>(GetBlockInteractionsDocument, options);
        }
export type GetBlockInteractionsQueryHookResult = ReturnType<typeof useGetBlockInteractionsQuery>;
export type GetBlockInteractionsLazyQueryHookResult = ReturnType<typeof useGetBlockInteractionsLazyQuery>;
export type GetBlockInteractionsSuspenseQueryHookResult = ReturnType<typeof useGetBlockInteractionsSuspenseQuery>;
export type GetBlockInteractionsQueryResult = Apollo.QueryResult<GetBlockInteractionsQuery, GetBlockInteractionsQueryVariables>;
export const SubscribeToBlockCommentsDocument = gql`
    subscription SubscribeToBlockComments($pageId: uuid!) {
  block_comments(
    where: {block: {_or: [{id: {_eq: $pageId}}, {page_id: {_eq: $pageId}}]}}
    order_by: {created_at: asc}
  ) {
    id
    block_id
    user_id
    content
    created_at
    user {
      id
      name
      avatar_url
    }
  }
}
    `;

/**
 * __useSubscribeToBlockCommentsSubscription__
 *
 * To run a query within a React component, call `useSubscribeToBlockCommentsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToBlockCommentsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeToBlockCommentsSubscription({
 *   variables: {
 *      pageId: // value for 'pageId'
 *   },
 * });
 */
export function useSubscribeToBlockCommentsSubscription(baseOptions: Apollo.SubscriptionHookOptions<SubscribeToBlockCommentsSubscription, SubscribeToBlockCommentsSubscriptionVariables> & ({ variables: SubscribeToBlockCommentsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeToBlockCommentsSubscription, SubscribeToBlockCommentsSubscriptionVariables>(SubscribeToBlockCommentsDocument, options);
      }
export type SubscribeToBlockCommentsSubscriptionHookResult = ReturnType<typeof useSubscribeToBlockCommentsSubscription>;
export type SubscribeToBlockCommentsSubscriptionResult = Apollo.SubscriptionResult<SubscribeToBlockCommentsSubscription>;
export const SubscribeToBlockReactionsDocument = gql`
    subscription SubscribeToBlockReactions($pageId: uuid!) {
  block_reactions(
    where: {block: {_or: [{id: {_eq: $pageId}}, {page_id: {_eq: $pageId}}]}}
    order_by: {created_at: asc}
  ) {
    id
    block_id
    user_id
    emoji
    created_at
    user {
      id
      name
      avatar_url
    }
  }
}
    `;

/**
 * __useSubscribeToBlockReactionsSubscription__
 *
 * To run a query within a React component, call `useSubscribeToBlockReactionsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToBlockReactionsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeToBlockReactionsSubscription({
 *   variables: {
 *      pageId: // value for 'pageId'
 *   },
 * });
 */
export function useSubscribeToBlockReactionsSubscription(baseOptions: Apollo.SubscriptionHookOptions<SubscribeToBlockReactionsSubscription, SubscribeToBlockReactionsSubscriptionVariables> & ({ variables: SubscribeToBlockReactionsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeToBlockReactionsSubscription, SubscribeToBlockReactionsSubscriptionVariables>(SubscribeToBlockReactionsDocument, options);
      }
export type SubscribeToBlockReactionsSubscriptionHookResult = ReturnType<typeof useSubscribeToBlockReactionsSubscription>;
export type SubscribeToBlockReactionsSubscriptionResult = Apollo.SubscriptionResult<SubscribeToBlockReactionsSubscription>;
export const AddBlockCommentDocument = gql`
    mutation AddBlockComment($blockId: uuid!, $userId: uuid!, $content: String!) {
  insert_block_comments_one(
    object: {block_id: $blockId, user_id: $userId, content: $content}
  ) {
    id
    block_id
    user_id
    content
    created_at
    user {
      id
      name
      avatar_url
    }
  }
}
    `;
export type AddBlockCommentMutationFn = Apollo.MutationFunction<AddBlockCommentMutation, AddBlockCommentMutationVariables>;

/**
 * __useAddBlockCommentMutation__
 *
 * To run a mutation, you first call `useAddBlockCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBlockCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBlockCommentMutation, { data, loading, error }] = useAddBlockCommentMutation({
 *   variables: {
 *      blockId: // value for 'blockId'
 *      userId: // value for 'userId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useAddBlockCommentMutation(baseOptions?: Apollo.MutationHookOptions<AddBlockCommentMutation, AddBlockCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBlockCommentMutation, AddBlockCommentMutationVariables>(AddBlockCommentDocument, options);
      }
export type AddBlockCommentMutationHookResult = ReturnType<typeof useAddBlockCommentMutation>;
export type AddBlockCommentMutationResult = Apollo.MutationResult<AddBlockCommentMutation>;
export type AddBlockCommentMutationOptions = Apollo.BaseMutationOptions<AddBlockCommentMutation, AddBlockCommentMutationVariables>;
export const DeleteBlockCommentDocument = gql`
    mutation DeleteBlockComment($id: uuid!) {
  delete_block_comments_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteBlockCommentMutationFn = Apollo.MutationFunction<DeleteBlockCommentMutation, DeleteBlockCommentMutationVariables>;

/**
 * __useDeleteBlockCommentMutation__
 *
 * To run a mutation, you first call `useDeleteBlockCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBlockCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBlockCommentMutation, { data, loading, error }] = useDeleteBlockCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBlockCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBlockCommentMutation, DeleteBlockCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBlockCommentMutation, DeleteBlockCommentMutationVariables>(DeleteBlockCommentDocument, options);
      }
export type DeleteBlockCommentMutationHookResult = ReturnType<typeof useDeleteBlockCommentMutation>;
export type DeleteBlockCommentMutationResult = Apollo.MutationResult<DeleteBlockCommentMutation>;
export type DeleteBlockCommentMutationOptions = Apollo.BaseMutationOptions<DeleteBlockCommentMutation, DeleteBlockCommentMutationVariables>;
export const AddBlockReactionDocument = gql`
    mutation AddBlockReaction($blockId: uuid!, $userId: uuid!, $emoji: String!) {
  insert_block_reactions_one(
    object: {block_id: $blockId, user_id: $userId, emoji: $emoji}
  ) {
    id
    block_id
    user_id
    emoji
    created_at
    user {
      id
      name
      avatar_url
    }
  }
}
    `;
export type AddBlockReactionMutationFn = Apollo.MutationFunction<AddBlockReactionMutation, AddBlockReactionMutationVariables>;

/**
 * __useAddBlockReactionMutation__
 *
 * To run a mutation, you first call `useAddBlockReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBlockReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBlockReactionMutation, { data, loading, error }] = useAddBlockReactionMutation({
 *   variables: {
 *      blockId: // value for 'blockId'
 *      userId: // value for 'userId'
 *      emoji: // value for 'emoji'
 *   },
 * });
 */
export function useAddBlockReactionMutation(baseOptions?: Apollo.MutationHookOptions<AddBlockReactionMutation, AddBlockReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBlockReactionMutation, AddBlockReactionMutationVariables>(AddBlockReactionDocument, options);
      }
export type AddBlockReactionMutationHookResult = ReturnType<typeof useAddBlockReactionMutation>;
export type AddBlockReactionMutationResult = Apollo.MutationResult<AddBlockReactionMutation>;
export type AddBlockReactionMutationOptions = Apollo.BaseMutationOptions<AddBlockReactionMutation, AddBlockReactionMutationVariables>;
export const DeleteBlockReactionDocument = gql`
    mutation DeleteBlockReaction($id: uuid!) {
  delete_block_reactions_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteBlockReactionMutationFn = Apollo.MutationFunction<DeleteBlockReactionMutation, DeleteBlockReactionMutationVariables>;

/**
 * __useDeleteBlockReactionMutation__
 *
 * To run a mutation, you first call `useDeleteBlockReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBlockReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBlockReactionMutation, { data, loading, error }] = useDeleteBlockReactionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBlockReactionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBlockReactionMutation, DeleteBlockReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBlockReactionMutation, DeleteBlockReactionMutationVariables>(DeleteBlockReactionDocument, options);
      }
export type DeleteBlockReactionMutationHookResult = ReturnType<typeof useDeleteBlockReactionMutation>;
export type DeleteBlockReactionMutationResult = Apollo.MutationResult<DeleteBlockReactionMutation>;
export type DeleteBlockReactionMutationOptions = Apollo.BaseMutationOptions<DeleteBlockReactionMutation, DeleteBlockReactionMutationVariables>;