/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { createContext, useState, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { errorAlert, txViewAlert } from "@/components/ToastGroup";
import { coinInfo, userInfo } from "@/types";
import Link from "next/link";

interface Context {
    socket?: Socket;
    counter?: number;
    randValue?: number;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setRandValue?: Function;
    userArr?: unknown[];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setUserArr?: Function;
    playerNumber?: number;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setPlayerNumber?: Function;
    isLoading?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setIsLoading?: Function;
    isShowModal?: string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setIsShowModal?: Function;
    currentDepositAmount?: number;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setCurrentDepositAmount?: Function;
    numberDecimals?: number;
    alertState?: AlertState;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setAlertState?: Function;
}

const initialAlertState = {
    open: false,
    user: null,
    coin: null,
    amount: 0,
    severity: undefined,
}

const context = createContext<Context>({});

export const useSocket = () => useContext(context);

const SocketProvider = (props: React.PropsWithChildren) => {
    const [socket, setSocket] = useState<Socket>();
    const [counter, setCounter] = useState<number>(1);
    const [randValue, setRandValue] = useState<number>(0);
    const [userArr, setUserArr] = useState<unknown[]>();
    const [playerNumber, setPlayerNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowModal, setIsShowModal] = useState('');
    const [currentDepositAmount, setCurrentDepositAmount] = useState(0);
    const numberDecimals = 3;
    const [alertState, setAlertState] = useState<AlertState>(initialAlertState)

    const router = useRouter();

    const connectionUpdatedHandler = (data: number) => {
        setCounter(data);
    };

    const createSuccessHandler = (data: { user: userInfo, coin: coinInfo, txHash: string }) => {
        setAlertState({
            open: true,
            user: data.user,
            coin: data.coin,
            amount: undefined,
            severity: 'info'
        });
        txViewAlert(
            <div className="flex gap-4 items-center justify-between">
                <div>
                    <p className='font-semibold'>Created new coin</p>
                    <p>Click to view it</p>
                </div>
                <Link
                    href={`/coin/${data.coin._id}`}
                    className="rounded-md bg-primary text-center w-[110px] py-2 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                >
                    View
                </Link>
            </div>
        );
        txViewAlert(
            <div className="flex gap-4 items-center justify-between">
                <div>
                    <p className='font-semibold'>Create coin called {data.coin.name}[{data.coin.ticker}]</p>
                    <p>Transaction confirmed</p>
                </div>
                <a
                    href={`${process.env.NEXT_PUBLIC_TRANSACTION_EXPLORER_URL}${data.txHash}`}
                    target="_blank"
                    className="rounded-md bg-primary text-center py-2 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80 w-[110px]"
                >
                    View tx
                </a>
            </div>
        );
        
        const resetTimeout = setTimeout(() => {
            setAlertState(initialAlertState);
        }, 10000);
    
        return () => clearTimeout(resetTimeout);
    }

    const createFailedHandler = (name: string, mint: string) => {
        console.log("Failed Create Token Name:", name)
        errorAlert(`Failed Create token: ${name} \n ${mint}`)
        setIsLoading(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createTransactionHandler = (data: any) => {
        setAlertState({
            open: true,
            user: data.user,
            coin: data.token,
            amount: data.isBuy === 2 ? Number(data.ethAmount) : Number(data.tokenAmount) / 1_000_000,
            severity: data.isBuy === 2 ? 'success' : 'error'
        });
        txViewAlert(
            <div className="flex gap-4 items-center justify-between">
                <div>
                    <p className='font-semibold'>{`${data.user.name} ${data.isBuy === 2 ? `bought ` : `sold ${data.tokenAmount / 1_000_000}`} ${data.isBuy === 2 ? `the worth of ${data.ticker} for ${data.ethAmount} ETH` : data.ticker}`}</p>
                    <p>Transaction confirmed</p>
                </div>
                <a
                    href={`${process.env.NEXT_PUBLIC_TRANSACTION_EXPLORER_URL}${data.tx}`}
                    target="_blank"
                    className="rounded-md bg-primary text-center py-2 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80 w-[110px]"
                >
                    View tx
                </a>
            </div>
        );
        const resetTimeout = setTimeout(() => {
            setAlertState(initialAlertState);
        }, 10000);
    
        return () => clearTimeout(resetTimeout);
    }

    useEffect(() => {

        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            transports: ["websocket"],
        });
        socket.on("connect", async () => {
            console.log(" --@ connected to backend", socket.id);
        });
        socket.on("disconnect", () => {
            console.log(" --@ disconnected from backend", socket.id);
        });
        setSocket(socket);


        return () => {
            socket.off("connect");
            socket.off("disconnect");
            setSocket(undefined);
        };
    }, [router]);

    useEffect(() => {
        socket?.on("connectionUpdated", async (counter: number) => {
            console.log("--------@ Connection Updated: ", counter);

            connectionUpdatedHandler(counter)
        });

        socket?.on("Creation", () => {
            console.log("--------@ Token Creation: ");

        });
        socket?.on("TokenCreated", async (data: { user: userInfo, coin: coinInfo, txHash: string }) => {
            console.log("--------@ Token Created!: ", name);

            createSuccessHandler(data);
        });

        socket?.on('transaction', (data) => {
            createTransactionHandler(data);
        })

        socket?.on(`price-update-0x5efBe42b9fd908AF232105EFfAB0Aac53964656B`, (priceUpdate) => {
            console.log("priceUpdate", priceUpdate)
        })

        // socket?.on("TokenNotCreated", async (name: string, mint: string) => {
        //     console.log("--------@ Token Not Created: ", name);

        //     createFailedHandler(name, mint);
        // });

        return () => {
            socket?.off("Creation", createSuccessHandler);
            socket?.off("TokenCreated", createSuccessHandler);
            socket?.off("TokenNotCreated", createFailedHandler);
            socket?.off("price-update-0x5efBe42b9fd908AF232105EFfAB0Aac53964656B");
            socket?.disconnect();
        };
    }, [socket]);

    return (
        <context.Provider
            value={{
                socket,
                counter,
                randValue,
                setRandValue,
                userArr,
                setUserArr,
                playerNumber,
                setPlayerNumber,
                isLoading,
                setIsLoading,
                isShowModal,
                setIsShowModal,
                currentDepositAmount,
                setCurrentDepositAmount,
                numberDecimals,
                alertState,
                setAlertState
            }}
        >
            {props.children}
        </context.Provider>
    );
};

export interface AlertState {
    open: boolean
    user: userInfo | null,
    coin: coinInfo | null,
    amount?: number,
    severity?: 'success' | 'info' | 'warning' | 'error'
}

export default SocketProvider;