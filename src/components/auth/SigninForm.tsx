'use client'

import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '../loader/Loader';
import { useAlert } from '@/context/AlertsContext';
import { useTranslation } from 'react-i18next';

export interface ILoginUser {
    email: string,
    password: string
}

const SigninForm = () => {
    const { t } = useTranslation();
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
                showAlert(t('signinForm.errors.codeResent'), 'success');
            } else {
                const errorData = await response.json();
                setErrors(errorData.message || t('signinForm.errors.failedToResend'));
            }
        } catch (error) {
            setErrors(t('signinForm.errors.failedToResend'));
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
                setErrors(errorData.message || t('signinForm.errors.invalidCode'));
            }
        } catch (error) {
            setErrors(t('signinForm.errors.failedToVerify'));
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
                <h2 className="font-amandine text-2xl mb-4">{t('signinForm.verificationCode')}</h2>
                <p className='font-light'>{t('signinForm.emailNotVerified')}</p>
                <p className='font-light text-center'>{t('signinForm.codeSent', { email: formData.email })}</p>
                <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-2 mb-4 border"
                    placeholder={t('signinForm.enterVerificationCode')}
                    required
                />
                <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="w-full p-2 bg-black text-white flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader /> : t('signinForm.verifyCode')}
                </button>
                <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-gray-500 flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader /> : t('signinForm.resendCode')}
                </button>
            </div>
        )
    }

    return (
        <form className="flex flex-col gap-3 text-center py-2" onSubmit={handleSubmit}>
            <h2 className="font-amandine text-2xl mb-4">{t('signinForm.signIn')}</h2>
            {errors && <p className="text-sm text-red-500">{errors}</p>}
            <div className="flex flex-col items-start gap-2">
                <label>{t('signinForm.email')}</label>
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
                <label>{t('signinForm.password')}</label>
                <input
                    type="password"
                    value={formData.password}
                    name="password"
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border text-base"
                    required
                />
            </div>
            <a onClick={() => setShowSignin(false)} className="font-light text-sm m-1 cursor-pointer hover:text-blue-800">
                {t('signinForm.dontHaveAccount')}
            </a>
            <button type="submit" className="w-full p-2 bg-black text-white flex justify-center" >
                {
                    isLoading ?
                        <Loader />
                        :
                        t('signinForm.signIn')
                }
            </button>
        </form>
    );
};

export default SigninForm;