'use client';  
  
import { WebrtcProvider } from "y-webrtc";  
import * as Y from "yjs";  
import { Awareness } from 'y-protocols/awareness';  
import { useEffect, useState } from "react";  
  
// lib/hooks/useCollaborativeEditing.ts  
export function useCollaborativeEditing(documentId: string) {  
    const [doc] = useState<Y.Doc>(new Y.Doc());  
    const [awareness, setAwareness] = useState<Awareness | null>(null);  
  
    useEffect(() => {  
        const provider = new WebrtcProvider(documentId, doc);  
        setAwareness(provider.awareness);  
  
        return () => {  
            provider.destroy();  
        };  
    }, [documentId, doc]);  
  
    return { doc, awareness };  
}  