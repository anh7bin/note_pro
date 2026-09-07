import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type CreateAccessRequestMutationVariables = Types.Exact<{
  input: Types.AccessRequestsInsertInput;
}>;


export type CreateAccessRequestMutation = { __typename?: 'mutation_root', insert_access_requests_one?: { __typename?: 'access_requests', id: string, document_id: string, requester_id: string, owner_id: string, status?: string | null, message?: string | null, permission_type?: string | null, created_at?: string | null, updated_at?: string | null } | null };

export type BulkDeleteAccessRequestsMutationVariables = Types.Exact<{
  document_ids: Array<Types.Scalars['uuid']['input']> | Types.Scalars['uuid']['input'];
  requester_id: Types.Scalars['uuid']['input'];
}>;


export type BulkDeleteAccessRequestsMutation = { __typename?: 'mutation_root', delete_access_requests?: { __typename?: 'access_requests_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'access_requests', id: string, document_id: string }> } | null };


export const CreateAccessRequestDocument = gql`
    mutation CreateAccessRequest($input: access_requests_insert_input!) {
  insert_access_requests_one(
    object: $input
    on_conflict: {constraint: access_requests_document_id_requester_id_key, update_columns: [permission_type, status, message, updated_at]}
  ) {
    id
    document_id
    requester_id
    owner_id
    status
    message
    permission_type
    created_at
    updated_at
  }
}
    `;
export type CreateAccessRequestMutationFn = Apollo.MutationFunction<CreateAccessRequestMutation, CreateAccessRequestMutationVariables>;

/**
 * __useCreateAccessRequestMutation__
 *
 * To run a mutation, you first call `useCreateAccessRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccessRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccessRequestMutation, { data, loading, error }] = useCreateAccessRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAccessRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccessRequestMutation, CreateAccessRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccessRequestMutation, CreateAccessRequestMutationVariables>(CreateAccessRequestDocument, options);
      }
export type CreateAccessRequestMutationHookResult = ReturnType<typeof useCreateAccessRequestMutation>;
export type CreateAccessRequestMutationResult = Apollo.MutationResult<CreateAccessRequestMutation>;
export type CreateAccessRequestMutationOptions = Apollo.BaseMutationOptions<CreateAccessRequestMutation, CreateAccessRequestMutationVariables>;
export const BulkDeleteAccessRequestsDocument = gql`
    mutation BulkDeleteAccessRequests($document_ids: [uuid!]!, $requester_id: uuid!) {
  delete_access_requests(
    where: {document_id: {_in: $document_ids}, requester_id: {_eq: $requester_id}}
  ) {
    affected_rows
    returning {
      id
      document_id
    }
  }
}
    `;
export type BulkDeleteAccessRequestsMutationFn = Apollo.MutationFunction<BulkDeleteAccessRequestsMutation, BulkDeleteAccessRequestsMutationVariables>;

/**
 * __useBulkDeleteAccessRequestsMutation__
 *
 * To run a mutation, you first call `useBulkDeleteAccessRequestsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteAccessRequestsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteAccessRequestsMutation, { data, loading, error }] = useBulkDeleteAccessRequestsMutation({
 *   variables: {
 *      document_ids: // value for 'document_ids'
 *      requester_id: // value for 'requester_id'
 *   },
 * });
 */
export function useBulkDeleteAccessRequestsMutation(baseOptions?: Apollo.MutationHookOptions<BulkDeleteAccessRequestsMutation, BulkDeleteAccessRequestsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDeleteAccessRequestsMutation, BulkDeleteAccessRequestsMutationVariables>(BulkDeleteAccessRequestsDocument, options);
      }
export type BulkDeleteAccessRequestsMutationHookResult = ReturnType<typeof useBulkDeleteAccessRequestsMutation>;
export type BulkDeleteAccessRequestsMutationResult = Apollo.MutationResult<BulkDeleteAccessRequestsMutation>;
export type BulkDeleteAccessRequestsMutationOptions = Apollo.BaseMutationOptions<BulkDeleteAccessRequestsMutation, BulkDeleteAccessRequestsMutationVariables>;