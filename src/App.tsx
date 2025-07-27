import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import PostPropertyPage from "./pages/PostPropertyPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import MyListingsPage from "./pages/MyListingsPage";
import ListingBookingsPage from "./pages/ListingBookingsPage";
import EditProfilePage from "./pages/EditProfilePage";
import BottomNavigation from "./components/BottomNavigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/post-property" element={<PostPropertyPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/listings/:listingId/bookings" element={<ListingBookingsPage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
