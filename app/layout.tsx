import "./globals.css";

export const metadata = {
  title: "Recall Intelligence Platform",
  description: "Every Failure has some lessons to learn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#f3f4f6",
        }}
      >
        {children}
      </body>
    </html>
  );
}
