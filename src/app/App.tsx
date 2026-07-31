import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "next-themes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  );
}