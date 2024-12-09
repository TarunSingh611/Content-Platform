// lib/store.ts  
import { create } from 'zustand'  

interface AppState {  
  currentContent: any  
  setCurrentContent: (content: any) => void  
  isOptimizing: boolean  
  setIsOptimizing: (status: boolean) => void  
}  

export const useStore = create<AppState>((set:any) => ({  
  currentContent: null,  
  setCurrentContent: (content:any) => set({ currentContent: content }),  
  isOptimizing: false,  
  setIsOptimizing: (status:any) => set({ isOptimizing: status }),  
}))  