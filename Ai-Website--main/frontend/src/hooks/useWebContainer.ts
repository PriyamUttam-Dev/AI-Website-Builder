import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

let bootPromise: Promise<WebContainer> | null = null;
let cachedInstance: WebContainer | null = null;

async function getWebContainer(): Promise<WebContainer> {
    if (cachedInstance) return cachedInstance;
    if (!bootPromise) {
        bootPromise = WebContainer.boot().then((instance) => {
            cachedInstance = instance;
            return instance;
        });
    }
    return bootPromise;
}

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();

    useEffect(() => {
        let cancelled = false;
        getWebContainer().then((instance) => {
            if (!cancelled) setWebcontainer(instance);
        });

        return () => {
            cancelled = true;
        }
    }, [])

    return webcontainer;
}