'use client';

import { PageLoader } from "@/components/loader/PageLoader";
import { useAuth } from "@/context/AuthContext";
import { useStores } from "@/context/StoreContext";
import { ProfileStore } from "@/stores/ProfileStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WithAuthOptions {
    role?: string;
}

export default function withAuth(
    Component: React.ComponentType,
    options?: WithAuthOptions
) {
    return function AuthenticatedComponent({ ...props }) {
        const { isAuthenticated } = useAuth();
        let { profileStore } = useStores();
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            const checkAuthorization = async () => {
                if (!profileStore) profileStore = new ProfileStore()
                if (!profileStore.profile && isAuthenticated) {
                    await profileStore.fetchProfile();
                }
                if (!isAuthenticated || (options?.role && profileStore.profile?.role !== options.role)) {
                    router.push("/");
                } else {
                    setLoading(false);
                }
            };

            checkAuthorization();
        }, [isAuthenticated, profileStore, options, router]);


        return <Component {...props} />;
    };
}
