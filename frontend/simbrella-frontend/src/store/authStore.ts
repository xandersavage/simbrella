import { create } from "zustand";
import api from "@/lib/api";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // The '?' means it's optional
  role?: string; // The '?' means it's optional
  // We'll expand this later to match the full user object we get from the backend
  // when we integrate user data into the dashboard.
}

// AuthState is the blueprint for the ENTIRE whiteboard (our global state)
// related to authentication. What information does it hold?
interface AuthState {
  user: AuthUser | null; // This will hold the logged-in user's info, or be empty (null) if no one is logged in.
  token: string | null; // This will hold the secret JWT token we get from the backend after login.
  isAuthenticated: boolean; // A simple `true` or `false` to quickly check if someone is logged in.
  isLoading: boolean; // `true` if we're busy checking login status (e.g., when the app first starts).
  error: string | null; // If something goes wrong with login, we can store an error message here.

  setAuth: (user: AuthUser, token: string) => void; // Instruction: "Set this user and token as logged in."
  logout: () => void; // Instruction: "Clear all login info; log out the user."
  setLoading: (loading: boolean) => void; // Instruction: "Change the loading status."
  setError: (error: string | null) => void; // Instruction: "Set or clear an error message."
  initializeAuth: () => void; // Instruction: "Check if we were already logged in (from previous visits)."
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null, // No user initially
  token: null, // No token initially
  isAuthenticated: false, // Not authenticated initially
  isLoading: true, // We are 'loading' because we need to check localStorage first
  error: null, // No error initially

  // --- Implementations of our actions (how the instructions work) ---

  // When `setAuth` is called:
  setAuth: (user, token) => {
    // We use `set()` to update the whiteboard.
    // It updates `user`, `token`, `isAuthenticated`, clears any `error`, and sets `isLoading` to false.
    set({ user, token, isAuthenticated: true, error: null, isLoading: false });
    // IMPORTANT: We also save the token to `localStorage` in the user's browser.
    // This is like writing the token on a sticky note and putting it on the fridge.
    // This way, if the user closes the browser and comes back, we can find the token again.
    localStorage.setItem("token", token);
    console.log("Auth state set: user logged in."); // Just a message for our developer console
  },

  // When `logout` is called:
  logout: () => {
    // We `set()` everything back to empty/default values.
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
    // We also remove the token from `localStorage` (tear off the sticky note).
    localStorage.removeItem("token");
    console.log("Auth state cleared: user logged out.");
  },

  // When `setLoading` is called:
  setLoading: (loading) => set({ isLoading: loading }),

  // When `setError` is called:
  setError: (error) => set({ error }),

  // When `initializeAuth` is called (this is super important for remembering logins!):
  initializeAuth: async () => {
    const token = localStorage.getItem("token"); // Look for the sticky note (token) on the fridge.
    if (token) {
      try {
        // Fetch user profile to get user data
        const response = await api.get("/auth/me");
        const user = response.data.user;

        // Update the state with both token and user data
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        console.log("Auth state initialized from localStorage with user data.");
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If there's an error fetching the profile, clear the auth state
        localStorage.removeItem("token");
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      // If no token is found, then no one is logged in.
      set({ isLoading: false, isAuthenticated: false });
      console.log("No token found in localStorage. Not authenticated.");
    }
  },
}));
