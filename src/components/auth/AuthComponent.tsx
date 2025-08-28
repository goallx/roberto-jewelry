'use client'

import { useAuth } from "@/context/AuthContext"
import SignUpForm from "./SignupForm"
import { Modal } from 'antd'
import SigninForm from "./SigninForm"
import './authComponent.css'

const AuthComponent = () => {
    const { showModal, setShowModal, showSignin, setShowSignin } = useAuth()

    return (
        <Modal
            className="custom-modal"
            footer={null}
            open={showModal}
            onClose={() => setShowModal(false)}
            onCancel={() => {
                setShowModal(false)
                setShowSignin(true)
            }}
        >
            {
                showSignin ? <SigninForm /> : <SignUpForm />
            }
        </Modal>
    )
}

export default AuthComponent