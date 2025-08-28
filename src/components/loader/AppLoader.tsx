import Image from 'next/image';
import React from 'react';
import './style.css'

const AppLoader = () => (<div className="fixed flex flex-col gap-10 inset-0 items-center justify-center bg-white z-50" >
    <div className="animate-scale-fade">
        <Image
            src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-1.png?alt=media&token=cacc86a9-43aa-4090-99da-9ed54525ee2d"
            alt="Roberto Jewelry Logo"
            width={180}
            height={90}
            priority
            quality={75}
        />
    </div>
    <p className="font-medium text-xl">Loading..</p>
</div >)


export default AppLoader;
