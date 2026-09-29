import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from '@/i18n/config';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import Providers from './providers';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata = {
    title: 'Bin Craft',
    description: 'Bin Craft - Note Taking App',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
    const locale = isLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;

    return (
        <html lang={locale} className={inter.variable} suppressHydrationWarning>
            <body className="font-sans antialiased">
                <Providers initialLocale={locale}>{children}</Providers>
            </body>
        </html>
    );
}
