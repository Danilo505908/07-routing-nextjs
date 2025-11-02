"use client";

import React from "react";

interface DefaultModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function DefaultModal(_: DefaultModalProps) {
  return null;
}