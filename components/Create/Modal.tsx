import { useState } from "react";
import Spinner from "../Common/Spinner";
import { useData } from "@/contexts/PageContext";
import Image from "next/image";

interface ModalProps {
    showModal: boolean;
    setShowModal: (_: boolean) => void;
    createTokenCallback: (_: number) => void;
    tokenTicker: string;
    tokenImage: string;
    isLoading: boolean;
}

const Modal = ({
    showModal,
    setShowModal,
    createTokenCallback,
    tokenTicker,
    isLoading
}: ModalProps) => {
    const [amount, setAmount] = useState<string>('');

    const handleCreate = () => {
        const _amount = Number(amount)
        createTokenCallback(_amount);
    }

    const { metaData } = useData();

    return (
        <div
            className={`flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none overflow-x-hidden overflow-y-auto transition-all duration-150 ${showModal
                ? 'opacity-100 visible'
                : 'opacity-0 invisible'
                }`}
        >
            <div className="relative w-auto my-6 mx-auto max-w-3xl rounded-[20px] shadow-lg dark:bg-gray-dark dark:shadow-sticky-dark bg-white z-50 border border-gray-1">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                    <div className="relative p-6 flex-auto">
                        <div className="modal-content">
                            <div className="p-5 sm:p-6 md:p-8 w-[300px] sm:w-[350px] md:w-[410px] lg:w-[478px]">
                                <h2
                                    className="text-base sm:text-lg md:text-xl lg:text-[22px] font-semibold mb-5 sm:mb-6 leading-5 sm:leading-6 md:leading-7">
                                    Choose how many [{tokenTicker}] you want to buy (optional)
                                </h2>
                                <div>
                                    <div className="mb-2.5 relative">
                                        <input
                                            value={amount}
                                            type="number"
                                            placeholder="0.0 (optional)"
                                            className="border-main rounded-xl bg-black-2 placeholder:text-gray-7 text-sm md:text-base px-5 py-4 w-full focus:outline-0 leading-5 hide-arrows border"
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                        <div className="absolute right-5 top-[16px] text-sm md:text-base font-normal flex gap-1.5 items-center leading-5">
                                            <div className="flex item-center gap-1 justify-center">
                                                <span className="relative top-[2px] leading-4">ETH</span>
                                                <Image src={`/images/Base_Network_Logo.svg`} width={24} height={24} alt="base logo" />
                                            </div>
                                        </div>
                                        <br /><br />
                                        <div>
                                            <div className="flex gap-5">
                                                <button type="button" className="rounded-lg bg-blue-2 border border-blue-1 hover:bg-blue-1 text-sm sm:text-base md:text-lg p-2 md:p-3 focus:outline-0 leading-6 text-center w-[160px] md:w-[200px]" onClick={() => setShowModal(false)}>
                                                    Cancel
                                                </button>
                                                <button className="rounded-lg bg-primary hover:text-black-3 text-sm sm:text-base md:text-lg p-2 md:p-3 focus:outline-0 leading-6 text-center w-[160px] md:w-[200px] text-white disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden" onClick={handleCreate} disabled={isLoading || metaData?.siteKill}>
                                                    {isLoading ? <Spinner /> : 'Create Coin'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-full absolute opacity-50 bg-black z-40" onClick={() => setShowModal(false)}></div>
        </div>
    )
}

export default Modal;