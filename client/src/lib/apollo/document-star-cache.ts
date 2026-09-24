import type { ApolloCache } from '@apollo/client';
import {
    GetStarredDocumentsDocument,
    GetStarredDocumentsPageDocument,
} from '@/graphql/__generated__/document-star.generated';

export const DOCUMENT_STAR_REFETCH_QUERIES = [
    GetStarredDocumentsDocument,
    GetStarredDocumentsPageDocument,
];

export function updateDocumentStarCache(
    cache: ApolloCache<unknown>,
    documentIds: readonly string[],
    isStarred: boolean
) {
    documentIds.forEach((documentId) => {
        cache.modify({
            id: cache.identify({
                __typename: 'blocks',
                id: documentId,
            }),
            fields: {
                document_stars() {
                    return isStarred
                        ? [
                              {
                                  __typename: 'document_stars',
                                  document_id: documentId,
                              },
                          ]
                        : [];
                },
            },
        });
    });
}
