export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SHARED_WITH_ME: '/shared-with-me',

    // Workspace routes
    WORKSPACE: {
        ALL_DOCS: (workspaceSlug: string) =>
            `/workspace/${workspaceSlug}/documents`,
        TASKS: (workspaceSlug: string) => `/workspace/${workspaceSlug}/tasks`,
        CALENDAR: (workspaceSlug: string) =>
            `/workspace/${workspaceSlug}/calendar`,
        FOLDER: (workspaceSlug: string, folderId: string) =>
            `/workspace/${workspaceSlug}/folders/${folderId}`,
    },

    // Editor routes
    EDITOR: {
        DOCUMENT: (workspaceSlug: string, documentId: string) =>
            `/editor/${workspaceSlug}/documents/${documentId}`,
        DOCUMENT_IN_FOLDER: (
            workspaceSlug: string,
            folderId: string,
            documentId: string
        ) =>
            `/editor/${workspaceSlug}/folders/${folderId}/documents/${documentId}`,
    },

    // Legacy routes (for backward compatibility)
    WORKSPACE_ALL_DOCS: (workspaceSlug: string) => `/s/${workspaceSlug}/all`,
    WORKSPACE_TASKS: (workspaceSlug: string) => `/s/${workspaceSlug}/tasks`,
    WORKSPACE_TASKS_INBOX: (workspaceSlug: string) =>
        `/s/${workspaceSlug}/tasks/inbox`,
    WORKSPACE_TASKS_TODAY: (workspaceSlug: string) =>
        `/s/${workspaceSlug}/tasks/today`,
    WORKSPACE_TASKS_ALL: (workspaceSlug: string) =>
        `/s/${workspaceSlug}/tasks/all`,
    WORKSPACE_CALENDAR: (workspaceSlug: string) =>
        `/s/${workspaceSlug}/calendar`,
    WORKSPACE_DOCUMENT: (workspaceSlug: string, documentId: string) =>
        `/editor/d/${workspaceSlug}/${documentId}`,
    WORKSPACE_DOCUMENT_DRAFT: (workspaceSlug: string, documentId: string) =>
        `/editor/d/${workspaceSlug}/new/${documentId}`,
    WORKSPACE_DOCUMENT_FOLDER: (
        workspaceSlug: string,
        folderId: string,
        documentId: string
    ) => `/editor/d/${workspaceSlug}/${folderId}/${documentId}`,
    WORKSPACE_DOCUMENT_FOLDER_DRAFT: (
        workspaceSlug: string,
        folderId: string,
        documentId: string
    ) => `/editor/d/${workspaceSlug}/${folderId}/new/${documentId}`,
    WORKSPACE_FOLDER: (workspaceSlug: string, folderId: string) =>
        `/s/${workspaceSlug}/f/${folderId}`,
} as const;
