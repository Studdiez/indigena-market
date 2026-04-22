export const metadata = {
  title: 'Indigena Market',
  description: 'Indigenous creative economy platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#1A1A1A" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#1A1A1A',
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        overscrollBehavior: 'none'
      }}>
        {children}
      </body>
    </html>
  )
}
