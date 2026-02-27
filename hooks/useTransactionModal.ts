import { create } from "zustand";

interface TransactionModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useTransactionModal = create<TransactionModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
