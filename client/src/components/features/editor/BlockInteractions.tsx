'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useBlockInteractions } from '@/contexts/BlockInteractionsContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { MessageCirclePlus, Send, SmilePlus, Trash2, X } from 'lucide-react';
import { FormEvent, memo, useMemo, useRef, useState } from 'react';

const QUICK_REACTIONS = ['👍', '❤️', '🎉', '😂', '😮', '😢'] as const;

interface BlockInteractionsProps {
    blockId: string;
    variant?: 'block' | 'document-title';
}

function getInitials(name?: string | null) {
    const initials = name
        ?.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
    return initials || '?';
}

function getRelativeTime(value: string) {
    try {
        return formatDistanceToNow(new Date(value), { addSuffix: true });
    } catch {
        return '';
    }
}

export const BlockInteractions = memo(function BlockInteractions({
    blockId,
    variant = 'block',
}: BlockInteractionsProps) {
    const {
        commentsByBlock,
        reactionsByBlock,
        addComment,
        deleteComment,
        toggleReaction,
    } = useBlockInteractions();
    const currentUser = useCurrentUser();
    const comments = useMemo(
        () => commentsByBlock.get(blockId) ?? [],
        [blockId, commentsByBlock]
    );
    const reactions = useMemo(
        () => reactionsByBlock.get(blockId) ?? [],
        [blockId, reactionsByBlock]
    );
    const [commentOpen, setCommentOpen] = useState(false);
    const [reactionOpen, setReactionOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const reactionGroups = useMemo(() => {
        const groups = new Map<
            string,
            { count: number; reactedByCurrentUser: boolean; names: string[] }
        >();

        reactions.forEach((reaction) => {
            const group = groups.get(reaction.emoji) ?? {
                count: 0,
                reactedByCurrentUser: false,
                names: [],
            };
            group.count += 1;
            group.reactedByCurrentUser ||= reaction.user_id === currentUser.id;
            group.names.push(reaction.user.name || 'Someone');
            groups.set(reaction.emoji, group);
        });

        return [...groups.entries()];
    }, [currentUser.id, reactions]);

    const latestComment = comments.at(-1);
    const isToolbarOpen = commentOpen || reactionOpen;
    const isDocumentTitle = variant === 'document-title';

    const handleSubmitComment = async (event?: FormEvent) => {
        event?.preventDefault();
        const submittedComment = commentText.trim();
        if (!submittedComment || isSubmitting) return;

        setCommentText('');
        setIsSubmitting(true);
        const wasAdded = await addComment(blockId, submittedComment);
        if (!wasAdded) {
            setCommentText((currentValue) =>
                currentValue ? currentValue : submittedComment
            );
        }
        setIsSubmitting(false);
        requestAnimationFrame(() => textareaRef.current?.focus());
    };

    const openComments = () => {
        setReactionOpen(false);
        setCommentOpen(true);
    };

    return (
        <>
            <div
                className={cn(
                    'absolute top-0 z-20 flex items-center gap-0.5 rounded-lg border border-border/70 bg-popover/95 p-0.5 shadow-sm backdrop-blur-sm transition-[opacity,box-shadow]',
                    'right-0',
                    'opacity-100 md:pointer-events-none md:opacity-0 md:group-hover/block:pointer-events-auto md:group-hover/block:opacity-100 md:focus-within:pointer-events-auto md:focus-within:opacity-100',
                    isToolbarOpen &&
                        'shadow-md md:pointer-events-auto md:opacity-100'
                )}>
                <Popover
                    open={reactionOpen}
                    onOpenChange={(open) => {
                        setReactionOpen(open);
                        if (open) setCommentOpen(false);
                    }}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label="Add reaction">
                            <SmilePlus aria-hidden="true" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="top"
                        align="end"
                        collisionPadding={12}
                        className="flex w-auto gap-1 p-1.5">
                        {QUICK_REACTIONS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-md text-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                                aria-label={`React with ${emoji}`}
                                onClick={() => {
                                    void toggleReaction(blockId, emoji);
                                    setReactionOpen(false);
                                }}>
                                {emoji}
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>

                <Popover open={commentOpen} onOpenChange={setCommentOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="relative h-7 w-7"
                            aria-label="Add comment">
                            <MessageCirclePlus aria-hidden="true" />
                            {comments.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                                    {comments.length > 99
                                        ? '99+'
                                        : comments.length}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="bottom"
                        align="end"
                        collisionPadding={12}
                        className="w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden p-0"
                        onOpenAutoFocus={(event) => {
                            event.preventDefault();
                            requestAnimationFrame(() =>
                                textareaRef.current?.focus()
                            );
                        }}>
                        <div className="flex h-11 items-center justify-between border-b border-border px-3">
                            <h3 className="text-sm font-semibold">Comments</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Close comments"
                                onClick={() => setCommentOpen(false)}>
                                <X />
                            </Button>
                        </div>

                        <div
                            className="max-h-72 min-h-24 overflow-y-auto p-3"
                            aria-live="polite">
                            {comments.length === 0 ? (
                                <div className="flex min-h-20 items-center justify-center text-center text-sm text-muted-foreground">
                                    Start a conversation about this block.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <article
                                            key={comment.id}
                                            className="group/comment flex gap-2.5">
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage
                                                    src={
                                                        comment.user
                                                            .avatar_url ||
                                                        undefined
                                                    }
                                                />
                                                <AvatarFallback className="text-[10px]">
                                                    {getInitials(
                                                        comment.user.name
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="truncate text-sm font-medium">
                                                        {comment.user.name ||
                                                            'Unknown user'}
                                                    </span>
                                                    <time
                                                        className="shrink-0 text-xs text-muted-foreground"
                                                        dateTime={
                                                            comment.created_at
                                                        }>
                                                        {getRelativeTime(
                                                            comment.created_at
                                                        )}
                                                    </time>
                                                    {comment.user_id ===
                                                        currentUser.id &&
                                                        !comment.id.startsWith(
                                                            'optimistic-'
                                                        ) && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="ml-auto h-6 w-6 opacity-0 group-hover/comment:opacity-100 focus-visible:opacity-100"
                                                                aria-label="Delete comment"
                                                                onClick={() =>
                                                                    void deleteComment(
                                                                        comment.id
                                                                    )
                                                                }>
                                                                <Trash2 aria-hidden="true" />
                                                            </Button>
                                                        )}
                                                </div>
                                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form
                            className="border-t border-border p-2"
                            onSubmit={handleSubmitComment}>
                            <div className="flex items-end gap-2 rounded-md border border-input bg-background p-1 focus-within:ring-2 focus-within:ring-ring/30">
                                <Textarea
                                    ref={textareaRef}
                                    value={commentText}
                                    onChange={(event) =>
                                        setCommentText(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === 'Enter' &&
                                            !event.shiftKey
                                        ) {
                                            event.preventDefault();
                                            void handleSubmitComment();
                                        }
                                    }}
                                    rows={1}
                                    maxLength={2000}
                                    aria-label="Comment"
                                    placeholder="Type your comment"
                                    className="min-h-9 max-h-28 resize-none border-0 px-2 py-2 shadow-none focus-visible:ring-0"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-9 w-9 shrink-0"
                                    disabled={
                                        !commentText.trim() || isSubmitting
                                    }
                                    aria-label="Send comment"
                                    aria-busy={isSubmitting}>
                                    <Send aria-hidden="true" />
                                </Button>
                            </div>
                            <p className="px-1 pt-1 text-[11px] text-muted-foreground">
                                Enter to send · Shift + Enter for a new line
                            </p>
                        </form>
                    </PopoverContent>
                </Popover>
            </div>

            {(reactionGroups.length > 0 || latestComment) && (
                <div className="flex flex-wrap items-center gap-1.5 pb-0.5 pt-1">
                    {reactionGroups.map(
                        ([emoji, { count, reactedByCurrentUser, names }]) => (
                            <button
                                key={emoji}
                                type="button"
                                aria-pressed={reactedByCurrentUser}
                                aria-label={`${emoji} reaction from ${names.join(', ')}`}
                                title={names.join(', ')}
                                className={cn(
                                    'inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border px-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                                    reactedByCurrentUser
                                        ? 'border-primary/40 bg-primary/10 text-foreground'
                                        : 'border-border bg-muted/60 hover:bg-accent'
                                )}
                                onClick={() =>
                                    void toggleReaction(blockId, emoji)
                                }>
                                <span aria-hidden="true">{emoji}</span>
                                <span>{count}</span>
                            </button>
                        )
                    )}

                    {latestComment && (
                        <button
                            type="button"
                            className={cn(
                                'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                                isDocumentTitle
                                    ? 'border border-border/60 bg-muted/70 shadow-xs'
                                    : 'bg-muted'
                            )}
                            aria-label={`Open ${comments.length} comment${comments.length === 1 ? '' : 's'}`}
                            onClick={openComments}>
                            <Avatar className="h-5 w-5">
                                <AvatarImage
                                    src={
                                        latestComment.user.avatar_url ||
                                        undefined
                                    }
                                />
                                <AvatarFallback className="text-[9px]">
                                    {getInitials(latestComment.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span>
                                {comments.length}{' '}
                                {comments.length === 1 ? 'comment' : 'comments'}
                            </span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={latestComment.created_at}>
                                {getRelativeTime(latestComment.created_at)}
                            </time>
                        </button>
                    )}
                </div>
            )}
        </>
    );
});
