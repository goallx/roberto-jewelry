"use client";

import { useAuth } from '@/context/AuthContext';
import { signUpSchema } from '@/utils/validate';
import { useState } from 'react';
import { Loader } from '../loader/Loader';
import { useAlert } from '@/context/AlertsContext';

export interface INewUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string,
    birthday: { day: string; month: string; year: string };
    confirmPassword?: string;
}

const initUser = {
    firstName: '',
    lastName: '',
    email: "",
    password: "",
    phoneNumber: "",
    confirmPassword: "",
    birthday: {
        day: "",
        month: "",
        year: ""
    }
}

const SignUpForm = () => {
    const { signup, login, setShowSignin } = useAuth();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<INewUser>({ ...initUser });
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const { showAlert } = useAlert()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const result = signUpSchema.safeParse(formData);
        if (!result.success) {
            const errorObj: { [key: string]: string } = {};
            result.error.errors.forEach((error) => {
                errorObj[error.path[0]] = error.message;
            });
            setErrors(errorObj);
            setLoading(false);
            return;
        }
        delete formData['confirmPassword'];
        const res = await signup(formData);
        if (res) {
            setErrors({ error: res })
            setFormData({} as any)
        }
        setLoading(false)
        setIsCodeSent(true)
        return
    };

    const handleVerifyCode = async () => {
        setIsVerifying(true);
        try {
            const response = await fetch('/api/user/signup/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, verificationCode }),
            });

            if (response.ok) {
                await login({ email: formData.email, password: formData.password }, () => undefined);
                setFormData({ ...initUser })
                setIsCodeSent(false)
            } else {
                const errorData = await response.json();
                setErrors({ verificationCode: errorData.message || 'Invalid verification code.' });
            }
        } catch (error) {
            setErrors({ verificationCode: 'Failed to verify code.' });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
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
                setErrors({ email: errorData.message || 'Failed to resend verification code.' });
            }
        } catch (error) {
            setErrors({ email: 'Failed to resend verification code.' });
        } finally {
            setLoading(false);
        }
    };

    if (isCodeSent) {
        return (
            <div className="flex flex-col items-center justify-evenly gap-2 h-[300px]">
                <h2 className="font-amandine text-2xl mb-4">Verification Code</h2>
                <p className='font-light'>You have recieved a verification code to {formData.email}</p>
                <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-2 mb-4 border text-base"
                    placeholder="Enter verification code"
                    required
                />
                <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="w-full p-2 bg-black text-white flex justify-center items-center"
                    disabled={isVerifying}
                >
                    {isVerifying ? <Loader /> : "Verify Code"}
                </button>
                <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-gray-500 flex justify-center items-center"
                    disabled={loading}
                >
                    {loading ? <Loader /> : "Resend Code"}
                </button>
            </div>
        )
    }

    return (
        <form className="flex flex-col gap-3 text-center py-2" onSubmit={handleSubmit}>
            <h2 className="font-amandine text-2xl mb-4">Sign Up</h2>
            {Object.entries(errors).map(([key, value]) => (
                <p key={key} className='text-sm text-red-600'>{value}</p>
            ))}
            <div className='flex justify-between gap-5'>
                <div className="flex flex-col items-start gap-2 w-1/2">
                    <label>First Name</label>
                    <input
                        type="text"
                        value={formData.firstName}
                        name="firstName"
                        onChange={handleInputChange}
                        className="w-full p-2 mb-4 border text-base"
                        required
                    />
                </div>
                <div className="flex flex-col items-start gap-2 w-1/2">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-4 border text-base"
                        required
                    />
                </div>
            </div>
            <div className="flex flex-col items-start gap-2">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border text-base"
                    required
                />
            </div>
            <div className="flex flex-col items-start gap-2">
                <label>Phone number</label>
                <input
                    className="w-full p-2 mb-4 border text-base"
                    name='phoneNumber'
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="flex flex-col items-start gap-2">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border text-base"
                    required
                />
            </div>
            <div className="flex flex-col items-start gap-2">
                <label>Password Confirmation</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-4 border text-base"
                    required
                />
            </div>
            <div className='flex flex-col gap-5 items-start'>
                <label>Date of Birth</label>
                <div className='flex justify-between gap-3'>
                    <input
                        placeholder='Day'
                        onChange={(e) => setFormData((prev) => ({ ...prev, birthday: { ...prev.birthday, day: e.target.value } }))}
                        className="w-full p-2 mb-4 border text-base"
                        required
                    />
                    <input
                        placeholder='Month'
                        onChange={(e) => setFormData((prev) => ({ ...prev, birthday: { ...prev.birthday, month: e.target.value } }))}
                        className="w-full p-2 mb-4 border text-base"
                        required
                    />
                    <input
                        placeholder='Year'
                        onChange={(e) => setFormData((prev) => ({ ...prev, birthday: { ...prev.birthday, year: e.target.value } }))}
                        className="w-full p-2 mb-4 border text-base"
                        required
                    />
                </div>
            </div>

            <button type="submit" className="w-full p-2 bg-black text-white flex justify-center items-center" disabled={isCodeSent || loading}>
                {loading ? <Loader /> : "Submit"}
            </button>
            <a onClick={() => setShowSignin(true)} className="font-light text-sm m-1 cursor-pointer hover:text-blue-800">Already have an account? Sign in</a>
        </form>
    );
};


export default SignUpForm;