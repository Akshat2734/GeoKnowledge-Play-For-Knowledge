"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, ReactNode } from "react";

interface PortalProps {
    children: ReactNode;
}

export default function Portal({ children }: PortalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? createPortal(children, document.body) : null;
}
