'use client'

import React, { useEffect } from 'react';
import ProfileForm from './ProfileForm';
import { useStores } from '@/context/StoreContext';
import { observer } from 'mobx-react-lite';
import { Breadcrumb } from '@/components/breadcrumbs/Breadcrumb';
import { useAuth } from '@/context/AuthContext';

function ProfilePage() {
    const { profileStore } = useStores()
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        if (isAuthenticated && profileStore)
            profileStore.fetchProfile();
    }, [profileStore, isAuthenticated]);

    return (
        <div className='flex flex-col'>
            <div className="mt-24 px-8">
                <Breadcrumb />
            </div>
            {
                profileStore &&
                <ProfileForm profileData={profileStore.profile} isLoading={profileStore.isLoading} />
            }
        </div>
    );
}


export default observer(ProfilePage)