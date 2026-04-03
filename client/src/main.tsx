import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AppProvider } from "./context/AppContext.tsx";

// contexts
import { QueryClientProvider } from '@tanstack/react-query'
import { SkeletonTheme } from 'react-loading-skeleton';

import { queryClient } from './context/TanstackQuery.tsx'

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AppProvider>
                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <AppWrapper>
                            <App />
                        </AppWrapper>
                    </SkeletonTheme>
                </AppProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode >,
);
