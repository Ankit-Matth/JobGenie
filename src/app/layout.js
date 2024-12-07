import "./globals.css";
import CommonLayout from "./CommonLayout";
import AuthProvider from "./AuthProvider";
import { auth } from "../auth"

export const metadata = {
  title: "The Job Genie",
  description: "A team project",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <AuthProvider session={session}>
          <body>
              <CommonLayout>
                {children}
              </CommonLayout>
          </body>
      </AuthProvider>
    </html>
  );
}
