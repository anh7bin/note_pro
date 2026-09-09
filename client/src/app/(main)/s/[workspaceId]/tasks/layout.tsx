import type { Metadata } from 'next';
import { TasksLayoutClient } from './TasksLayoutClient';

export const metadata: Metadata = {
    title: 'Tasks',
};

export default function TasksLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <TasksLayoutClient>{children}</TasksLayoutClient>;
}
