import { useEffect, useState } from "react";
import Image from "next/image";
import { coinInfo } from "@/types";
import { useSocket } from "@/contexts/SocketContext";
import KingOfHill from "./KingOfHill";

export default function TokenOverview({ token, vlxPrice }: { token: coinInfo, vlxPrice: number }) {
    const [progress, setProgress] = useState<number>(0);
    const { socket } = useSocket();
    const [_token, setToken] = useState<coinInfo>(token);

    useEffect(() => {
        const value = Math.floor((_token.price || 0) * 1_000_000_000 / (token.graduationMarketCap || 5) * 100)
        setProgress(value);
    }, [_token, setProgress]);

    useEffect(() => {
        const handleUpdateBondingCurve = (
            data: {
                tokenId: string,
                price: number,
                reserveTwo: number
            }
        ) => {
            if (_token._id === data.tokenId) {
                const value = Math.floor(((data.price || 0) * 1_000_000_000) / (token.graduationMarketCap || 5) * 100)
                setProgress(value);
                setToken(prevState => ({ 
                    ...prevState, 
                    price: data.price, 
                    reserveTwo: data.reserveTwo
                }))
            }
        }
        const handleGraduatingToDEX = (data: coinInfo) => {
            if (_token._id === data._id) setToken(data);
        }
        socket?.on('update-bonding-curve', handleUpdateBondingCurve);
        socket?.on('graduating-to-dex', handleGraduatingToDEX);
        socket?.on('trading-enabled-on-uniswap', handleGraduatingToDEX);
        return () => {
            socket?.off('update-bonding-curve', handleUpdateBondingCurve);
            socket?.off('graduating-to-dex');
            socket?.off('trading-enabled-on-uniswap');
        }
    }, [socket]);

    return (
        <>
            <div className=" rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 border dark:border-gray-700 border-gray-200">
                <h4 className="text-sm md:text-base font-semibold !leading-none pb-4 md:pb-5">Bonding curve progress : {Math.min(progress, 100)}%</h4>
                <div className="bg-body-color w-full rounded-md h-2 md:h-2.5 mb-4 md:mb-5">
                    <div className="bg-primary rounded-md h-2 md:h-2.5" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <div className="flex flex-col gap-2">
                    {
                        _token.tradingOnUniswap ? (
                            <p className="text-[10px] font-normal leading-normal"> Uniswap pool seeded! View on uniswap <a className="text-primary" href={`https://app.uniswap.org/explore/pools/base/${_token.uniswapPair}`} target="_blank">here</a></p>
                        ) : !_token.tradingPaused ? (
                            <>
                                <p className="text-[10px] font-normal leading-normal"> When the market cap reaches ${(vlxPrice * (_token.graduationMarketCap || 5)).toLocaleString()}, all the liquidity from the bonding curve will be deposited into Uniswap Dex and burned. Progression increases as the price goes up. There is {(_token.reserveTwo / 1_000_000_000_000_000_000).toFixed(3)} ETH in the bonding curve. </p>
                            </>
                        ) : (
                            <p className="text-[10px] font-normal leading-normal">Graduating to uniswap now! This will take 5~20 mins.</p>
                        )
                    }
                </div>
            </div>
            <KingOfHill token={token} vlxPrice={vlxPrice} />
            <div className=" rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 border dark:border-gray-700 border-gray-200">
                <h4 className="text-[15px] md:text-base xl:text-lg font-semibold !leading-none mb-3.5">Overview</h4>
                <div>
                    <div className="flex flex-wrap items-center gap-5 pb-4 sm:pb-5">
                        <Image className="img-fluid w-16 md:w-20 h-16 md:h-20" src={_token.url} alt="coin image" width={80} height={80} />
                        <div className="flex flex-col gap-2.5">
                            <div className="flex flex-col gap-1.5">
                                <p className="text-xs font-normal text-body-color !leading-none">Coin name</p>
                                <p className="text-sm lg:text-base font-medium leading-normal xl:!leading-none">{_token.name}</p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <p className="text-xs font-normal text-body-color !leading-none">Ticker</p>
                                <p className="text-sm lg:text-base font-medium !leading-none">{_token.ticker}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-normal text-body-color !leading-none pb-2">Description</p>
                        <p className="text-xs font-normal">
                            {_token.description}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}