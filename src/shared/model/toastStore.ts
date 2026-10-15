import { createStore } from "zustand/vanilla";

export type ToastMessage = {
  id: number;
  message: string;
  type: "error";
};

type ToastState = {
  toast?: ToastMessage;
  showError: (message: string) => void;
};

let nextToastId = 0;

export const toastStore = createStore<ToastState>((set) => ({
  showError: (message) => {
    nextToastId += 1;
    set({ toast: { id: nextToastId, message, type: "error" } });
  },
}));

export function showErrorToast(message: string) {
  toastStore.getState().showError(message);
}
