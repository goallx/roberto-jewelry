'use client'

import { useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { Loader } from '@/components/loader/Loader';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage(`Magic link sent to ${email}. Check your inbox!`);
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <form
                className="w-full max-w-md p-8 bg-white shadow-md rounded-md flex flex-col gap-4"
                onSubmit={handleLogin}
            >
                <h2 className="text-2xl font-bold text-center">Sign In</h2>
                {message && <p className="text-sm text-center text-blue-600">{message}</p>}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-black text-white p-2 rounded-md flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader /> : 'Send Magic Link'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
