import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      // ISS Data
      issPositions: [],
      addIssPosition: (pos) => set((state) => {
        const newPositions = [...state.issPositions, pos];
        if (newPositions.length > 15) {
          newPositions.shift();
        }
        return { issPositions: newPositions };
      }),
      clearIssPositions: () => set({ issPositions: [] }),
      
      astronauts: [],
      setAstronauts: (astronauts) => set({ astronauts }),

      // Chatbot state
      chatMessages: [],
      addChatMessage: (msg) => set((state) => {
        const newMessages = [...state.chatMessages, msg];
        if (newMessages.length > 30) {
          newMessages.shift(); // Keep last 30 messages
        }
        return { chatMessages: newMessages };
      }),
      clearChatMessages: () => set({ chatMessages: [] }),
    }),
    {
      name: 'spacepulse-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        chatMessages: state.chatMessages
      }), // Only persist theme and chatMessages
    }
  )
);
