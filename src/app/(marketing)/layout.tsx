import MarketingLayoutClient from './layout-client';

export default function MarketingLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <MarketingLayoutClient>
            {children}
        </MarketingLayoutClient>
    )
}
