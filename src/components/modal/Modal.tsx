'use client'

import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import styles from './Modal.module.css'
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface ModalProps {
    onClose: () => void,
    children: ReactNode
}

const Modal = ({ onClose, children }: ModalProps) => {

    return (
        <motion.div
            className={styles.modalContainer}
            initial={{ opacity: 0 }
            }
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className={styles.modal}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
            >
                <Button className={styles.closeBtn} onClick={onClose} shape="circle" icon={<CloseOutlined />} />
                {children}
            </motion.div>
        </motion.div>
    )
}

export default Modal