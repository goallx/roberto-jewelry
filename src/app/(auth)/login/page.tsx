'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { Loader } from '@/components/loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const LoginPage = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            setMessage(error.message);
            setShowSuccess(false);
        } else {
            setMessage(t('signinForm.codeSent'));
            setShowSuccess(true);
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F1EC] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
            <div className={`relative w-full max-w-lg p-12 mx-auto rounded-full backdrop-blur-sm bg-[#F6F2ED] shadow-2xl z-10 transition-opacity duration-1000 ease-in ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

                <div className="text-center mb-8">
                    <h2 className="mt-2 text-5xl font-amandine text-[#333333] tracking-wide drop-shadow-sm">
                        {t('Welcome')}
                    </h2>
                    <p className="mt-4 text-lg text-[#777777] font-light drop-shadow-sm">
                        {t('signinForm.enterEmail')}
                    </p>
                </div>

                {showSuccess && (
                    <div className="rounded-md bg-green-100/70 p-4 mb-4 border border-[#2AAE3D]/50 text-[#333333] backdrop-blur-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-[#2AAE3D]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {message && !showSuccess && (
                    <div className="rounded-md bg-red-100/70 p-4 mb-4 border border-red-400/50 text-[#333333] backdrop-blur-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{message}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="sr-only">{t('signinForm.email')}</label>
                        <div className="relative rounded-full shadow-inner-lg bg-white/50 border border-white/50 focus-within:ring-2 focus-within:ring-black/20 transition-all duration-300">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-700/80" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-4 bg-transparent placeholder-gray-500/80 text-[#333333] focus:outline-none text-lg rounded-full"
                                placeholder="email.address@yahoo.com"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-white/30 rounded-full shadow-lg text-base font-semibold text-white bg-black/70 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/50 transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <>
                                    {t('signinForm.signIn')}
                                    <span className="ml-2">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-white/30 text-center">
                    <p className="text-xs text-[#777777] font-light drop-shadow-sm">
                        {t('signinForm.magicLinkNotice')}
                    </p>

                    {/* <div className="mt-4">
                        <Link
                            href="/signup"
                            className="text-black/70 hover:text-black text-sm font-medium transition-colors duration-200"
                        >
                            {t('signinForm.dontHaveAccount')}
                        </Link>
                    </div> */}
                </div>
            </div>

            <style jsx>{`
                .font-amandine {
                    font-family: 'Amandine', sans-serif;
                    font-weight: 600;
                }
                .shadow-inner-lg {
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                }
            `}</style>
        </div>
    );
};

export default LoginPage;