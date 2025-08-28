'use client'

import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '../loader/Loader';
import { useAlert } from '@/context/AlertsContext';

export interface ILoginUser {
    email: string,
    password: string
}

const SigninForm = () => {
    const { setShowSignin, login } = useAuth()
    const [formData, setFormData] = useState<ILoginUser>({ email: "", password: "" })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<string>("")
    const [showVerifyPage, setShowVerifyPage] = useState<boolean>(false)
    const [verificationCode, setVerificationCode] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null)
    const { showAlert } = useAlert()

    useEffect(() => {
        if (inputRef.current)
            inputRef.current.focus()
        return () => setShowVerifyPage(false)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/user/signup/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });

            if (response.ok) {
                showAlert('Verification code resent successfully.', 'success');
            } else {
                const errorData = await response.json();
                setErrors(errorData.message || 'Failed to resend verification code.');
            }
        } catch (error) {
            setErrors('Failed to resend verification code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/user/signup/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, verificationCode }),
            });

            if (response.ok) {
                await login({ email: formData.email, password: formData.password }, () => undefined);
                setShowVerifyPage(false)
            } else {
                const errorData = await response.json();
                setErrors(errorData.message || 'Invalid verification code.');
            }
        } catch (error) {
            setErrors('Failed to verify code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors("")
        setIsLoading(true)
        await login(formData, async (err: string, isVerified: boolean) => {
            setErrors(err)
            if (!isVerified) {
                setShowVerifyPage(true)
                await handleResendCode()
            }
        })
        setIsLoading(false)
    };

    if (showVerifyPage) {
        return (
            <div className="flex flex-col items-center justify-evenly gap-2 h-[300px]">
                <h2 className="font-amandine text-2xl mb-4">Verification Code</h2>
                <p className='font-light'>Your email isn't verified yet!</p>
                <p className='font-light text-center'>A verification code has been sent to your email {formData.email}</p>
                <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-2 mb-4 border"
                    placeholder="Enter verification code"
                    required
                />
                <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="w-full p-2 bg-black text-white flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader /> : "Verify Code"}
                </button>
                <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-gray-500 flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader /> : "Resend Code"}
                </button>
            </div>
        )
    }

    return (
        <form className="flex flex-col gap-3 text-center py-2" onSubmit={handleSubmit}>
            <h2 className="font-amandine text-2xl mb-4">Sign In</h2>
            {errors && <p className="text-sm text-red-500">{errors}</p>}
            <div className="flex flex-col items-start gap-2">
                <label>Email</label>
                <input
                    ref={inputRef}
                    type="email"
                    value={formData.email}
                    name="email"
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border"
                    required
                />
            </div>
            <div className="flex flex-col items-start gap-2 text-base">
                <label>Password</label>
                <input
                    type="password"
                    value={formData.password}
                    name="password"
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border text-base"
                    required
                />
            </div>
            <a onClick={() => setShowSignin(false)} className="font-light text-sm m-1 cursor-pointer hover:text-blue-800">Don't have an account? Sign up</a>
            <button type="submit" className="w-full p-2 bg-black text-white flex justify-center" >
                {
                    isLoading ?
                        <Loader />
                        :
                        "Sign In"
                }
            </button>
        </form>

    );
};

export default SigninForm;
