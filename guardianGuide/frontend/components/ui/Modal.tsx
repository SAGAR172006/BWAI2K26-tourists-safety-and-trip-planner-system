"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-bg-elevated border border-border rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {title && (
              <h2 className="text-heading-3 text-text-primary font-semibold mb-4">{title}</h2>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
