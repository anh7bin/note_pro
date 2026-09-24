import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type UpdateWorkspaceMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
  imageUrl?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type UpdateWorkspaceMutation = { __typename?: 'mutation_root', update_workspaces_by_pk?: { __typename?: 'workspaces', id: string, name?: string | null, image_url?: string | null } | null };


export const UpdateWorkspaceDocument = gql`
    mutation UpdateWorkspace($workspaceId: uuid!, $name: String, $imageUrl: String) {
  update_workspaces_by_pk(
    pk_columns: {id: $workspaceId}
    _set: {name: $name, image_url: $imageUrl}
  ) {
    id
    name
    image_url
  }
}
    `;
export type UpdateWorkspaceMutationFn = Apollo.MutationFunction<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>;

/**
 * __useUpdateWorkspaceMutation__
 *
 * To run a mutation, you first call `useUpdateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkspaceMutation, { data, loading, error }] = useUpdateWorkspaceMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      name: // value for 'name'
 *      imageUrl: // value for 'imageUrl'
 *   },
 * });
 */
export function useUpdateWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>(UpdateWorkspaceDocument, options);
      }
export type UpdateWorkspaceMutationHookResult = ReturnType<typeof useUpdateWorkspaceMutation>;
export type UpdateWorkspaceMutationResult = Apollo.MutationResult<UpdateWorkspaceMutation>;
export type UpdateWorkspaceMutationOptions = Apollo.BaseMutationOptions<UpdateWorkspaceMutation, UpdateWorkspaceMutationVariables>;