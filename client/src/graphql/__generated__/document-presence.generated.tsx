import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type DocumentPresenceSubscriptionVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
}>;


export type DocumentPresenceSubscription = { __typename?: 'subscription_root', document_presence: Array<{ __typename?: 'document_presence', user_id: string, last_seen: string, user: { __typename?: 'users', id: string, name?: string | null, email: string, avatar_url?: string | null } }> };

export type HeartbeatDocumentPresenceMutationVariables = Types.Exact<{
  sessionId: Types.Scalars['uuid']['input'];
  documentId: Types.Scalars['uuid']['input'];
}>;


export type HeartbeatDocumentPresenceMutation = { __typename?: 'mutation_root', insert_document_presence_one?: { __typename?: 'document_presence', session_id: string } | null };

export type LeaveDocumentPresenceMutationVariables = Types.Exact<{
  sessionId: Types.Scalars['uuid']['input'];
  documentId: Types.Scalars['uuid']['input'];
}>;


export type LeaveDocumentPresenceMutation = { __typename?: 'mutation_root', delete_document_presence?: { __typename?: 'document_presence_mutation_response', affected_rows: number } | null };


export const DocumentPresenceDocument = gql`
    subscription DocumentPresence($documentId: uuid!) {
  document_presence(
    where: {document_id: {_eq: $documentId}}
    order_by: {last_seen: desc}
  ) {
    user_id
    last_seen
    user {
      id
      name
      email
      avatar_url
    }
  }
}
    `;

/**
 * __useDocumentPresenceSubscription__
 *
 * To run a query within a React component, call `useDocumentPresenceSubscription` and pass it any options that fit your needs.
 * When your component renders, `useDocumentPresenceSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDocumentPresenceSubscription({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useDocumentPresenceSubscription(baseOptions: Apollo.SubscriptionHookOptions<DocumentPresenceSubscription, DocumentPresenceSubscriptionVariables> & ({ variables: DocumentPresenceSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<DocumentPresenceSubscription, DocumentPresenceSubscriptionVariables>(DocumentPresenceDocument, options);
      }
export type DocumentPresenceSubscriptionHookResult = ReturnType<typeof useDocumentPresenceSubscription>;
export type DocumentPresenceSubscriptionResult = Apollo.SubscriptionResult<DocumentPresenceSubscription>;
export const HeartbeatDocumentPresenceDocument = gql`
    mutation HeartbeatDocumentPresence($sessionId: uuid!, $documentId: uuid!) {
  insert_document_presence_one(
    object: {session_id: $sessionId, document_id: $documentId}
    on_conflict: {constraint: document_presence_pkey, update_columns: [last_seen]}
  ) {
    session_id
  }
}
    `;
export type HeartbeatDocumentPresenceMutationFn = Apollo.MutationFunction<HeartbeatDocumentPresenceMutation, HeartbeatDocumentPresenceMutationVariables>;

/**
 * __useHeartbeatDocumentPresenceMutation__
 *
 * To run a mutation, you first call `useHeartbeatDocumentPresenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHeartbeatDocumentPresenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [heartbeatDocumentPresenceMutation, { data, loading, error }] = useHeartbeatDocumentPresenceMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useHeartbeatDocumentPresenceMutation(baseOptions?: Apollo.MutationHookOptions<HeartbeatDocumentPresenceMutation, HeartbeatDocumentPresenceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HeartbeatDocumentPresenceMutation, HeartbeatDocumentPresenceMutationVariables>(HeartbeatDocumentPresenceDocument, options);
      }
export type HeartbeatDocumentPresenceMutationHookResult = ReturnType<typeof useHeartbeatDocumentPresenceMutation>;
export type HeartbeatDocumentPresenceMutationResult = Apollo.MutationResult<HeartbeatDocumentPresenceMutation>;
export type HeartbeatDocumentPresenceMutationOptions = Apollo.BaseMutationOptions<HeartbeatDocumentPresenceMutation, HeartbeatDocumentPresenceMutationVariables>;
export const LeaveDocumentPresenceDocument = gql`
    mutation LeaveDocumentPresence($sessionId: uuid!, $documentId: uuid!) {
  delete_document_presence(
    where: {session_id: {_eq: $sessionId}, document_id: {_eq: $documentId}}
  ) {
    affected_rows
  }
}
    `;
export type LeaveDocumentPresenceMutationFn = Apollo.MutationFunction<LeaveDocumentPresenceMutation, LeaveDocumentPresenceMutationVariables>;

/**
 * __useLeaveDocumentPresenceMutation__
 *
 * To run a mutation, you first call `useLeaveDocumentPresenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveDocumentPresenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveDocumentPresenceMutation, { data, loading, error }] = useLeaveDocumentPresenceMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useLeaveDocumentPresenceMutation(baseOptions?: Apollo.MutationHookOptions<LeaveDocumentPresenceMutation, LeaveDocumentPresenceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveDocumentPresenceMutation, LeaveDocumentPresenceMutationVariables>(LeaveDocumentPresenceDocument, options);
      }
export type LeaveDocumentPresenceMutationHookResult = ReturnType<typeof useLeaveDocumentPresenceMutation>;
export type LeaveDocumentPresenceMutationResult = Apollo.MutationResult<LeaveDocumentPresenceMutation>;
export type LeaveDocumentPresenceMutationOptions = Apollo.BaseMutationOptions<LeaveDocumentPresenceMutation, LeaveDocumentPresenceMutationVariables>;