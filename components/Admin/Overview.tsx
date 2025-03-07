'use client'
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { getAdminData, getOverview } from "@/utils/api";
import CardDataStats from "./CardDataStats"
import { getContractBalance } from "@/program/VelasFunContractService";
import { useData } from "@/contexts/PageContext";

export type CardDataProps = {
    total: number;
    rate?: number;
    levelUp?: boolean;
    levelDown?: boolean;
}

interface Overview {
    coin: CardDataProps;
    balance: CardDataProps;
    transaction: CardDataProps;
    user: CardDataProps;
}

const Overview = () => {
    const [data, setData] = useState<Overview | null>(null);
    const { setAdminData } = useData()

    const getOverviewMutation = useMutation(getOverview, {
        onSuccess: async (data) => {
            const { user, coin, transaction } = data;
            setData(prev => {
                if (prev) {
                    return {
                        user,
                        coin,
                        transaction,
                        balance: prev.balance,
                    }
                } else {
                    return {
                        user,
                        coin,
                        transaction,
                        balance: {
                            total: 0,
                        }
                    }
                }
            });
        }
    });

    const _getContractBalance = useCallback(async () => {
        const contractBalance = await getContractBalance();
        setData(prev => {
            if (prev) {
                return {
                    ...prev,
                    balance: {
                        total: contractBalance,
                    }
                }
            } else {
                return {
                    coin: {
                        total: 0,
                        rate: 0
                    },
                    transaction: {
                        total: 0,
                        rate: 0
                    },
                    balance: {
                        total: contractBalance,
                    },
                    user: {
                        total: 0,
                        rate: 0
                    }
                }
            }
        });
        const data = await getAdminData()
        setAdminData(data)
    }, [])

    useEffect(() => {
        getOverviewMutation.mutate();
        _getContractBalance()
    }, [])

    const formatNumber = (num: number, digit: number = 0) => {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(3).replace(/\.0$/, '') + 'B';
        } else if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(3).replace(/\.0$/, '') + 'M';
        } else if (num >= 1_000) {
            return (num / 1_000).toFixed(3).replace(/\.0$/, '') + 'K';
        }
        return Number(num).toFixed(digit);
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <CardDataStats
                title="Total Coins"
                data={{
                    total: formatNumber(data?.coin.total || 0),
                    rate: Number(data?.coin.rate || 0).toFixed(2) + '%',
                    levelUp: data?.coin.levelUp,
                    levelDown: data?.coin.levelDown
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    fill="none"
                    height="22px"
                    width="22px"
                    version="1.1"
                    id="Capa_1"
                    viewBox="0 0 59 59" xmlSpace="preserve"
                    className="fill-primary dark:fill-white"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier"> <g> <path d="M6.923,56c-1.545,0-3-2.253-3-4c0-0.552-0.448-1-1-1s-1,0.448-1,1c0,2.774,2.184,6,5,6c0.552,0,1-0.448,1-1 S7.475,56,6.923,56z" /> <path d="M51.492,2c1.498,0,3.43,2.216,3.43,4.57c0,0.552,0.448,1,1,1s1-0.448,1-1c0-3.315-2.69-6.57-5.43-6.57 c-0.552,0-1,0.448-1,1S50.94,2,51.492,2z" /> <path d="M57.923,45c0-0.552-0.448-1-1-1s-1,0.448-1,1c0,5.233-4.29,10-9,10c-0.552,0-1,0.448-1,1s0.448,1,1,1 C52.782,57,57.923,51.393,57.923,45z" /> <path d="M57.923,53c-0.552,0-1,0.448-1,1c0,1.157-1.373,3-3,3c-0.552,0-1,0.448-1,1s0.448,1,1,1c2.693,0,5-2.75,5-5 C58.923,53.448,58.475,53,57.923,53z" /> <path d="M38.171,57.141c1.619-0.605,3.196-1.358,4.717-2.237c0.125-0.042,0.241-0.108,0.344-0.2 c2.301-1.368,4.465-3.034,6.412-4.981c3.114-3.114,5.45-6.683,6.999-10.426c0.019-0.039,0.036-0.075,0.05-0.115 c0.909-2.222,1.539-4.505,1.888-6.79c0.01-0.063,0.027-0.123,0.025-0.186c0.335-2.301,0.383-4.6,0.143-6.844 c0.004-0.076-0.01-0.148-0.024-0.223c-0.606-5.231-2.788-10.134-6.607-13.953c-0.688-0.689-1.433-1.331-2.26-1.963 c-0.605-0.794-1.262-1.558-1.983-2.279C43.49,2.556,37.452,0.14,30.874,0.14c-7.789,0-15.638,3.381-21.534,9.277 C-1.967,20.725-3.077,38.012,6.865,47.955c0.7,0.7,1.456,1.331,2.235,1.928c0.646,0.85,1.303,1.61,2.007,2.314 C15.495,56.584,21.533,59,28.111,59c3.37,0,6.751-0.636,9.98-1.831C38.119,57.159,38.145,57.153,38.171,57.141z M31.262,56.796 l-2.488-2.488c1.513-0.271,3.011-0.665,4.482-1.176l2.661,2.661C34.387,56.265,32.83,56.601,31.262,56.796z M56.841,30.048 l-2.426-2.426c0.025-0.186,0.05-0.371,0.072-0.557c0.054-0.479,0.096-0.958,0.125-1.436c0.017-0.275,0.025-0.548,0.033-0.822 c0.009-0.277,0.013-0.553,0.014-0.829c0-0.116,0.007-0.233,0.006-0.349l2.126,2.126C56.931,27.167,56.947,28.603,56.841,30.048z M55.353,37.045l-2.678-2.678c0.139-0.36,0.273-0.722,0.398-1.085c0.055-0.159,0.105-0.319,0.157-0.479 c0.138-0.426,0.266-0.853,0.385-1.281c0.045-0.163,0.094-0.326,0.136-0.49c0.087-0.336,0.163-0.673,0.237-1.01l2.536,2.536 C56.265,34.063,55.872,35.564,55.353,37.045z M50.623,38.675c0.314-0.546,0.606-1.1,0.884-1.657 c0.059-0.119,0.116-0.238,0.173-0.357c0.05-0.103,0.101-0.206,0.15-0.309l2.724,2.724c-0.419,0.955-0.897,1.894-1.426,2.817 l-2.772-2.772c0.064-0.107,0.13-0.213,0.192-0.321C50.572,38.758,50.599,38.717,50.623,38.675z M48.273,42.203 c0.341-0.446,0.667-0.898,0.981-1.356l2.789,2.789c-0.557,0.832-1.154,1.647-1.805,2.438l-2.811-2.811 c0.27-0.324,0.531-0.653,0.786-0.985C48.233,42.252,48.254,42.228,48.273,42.203z M42.71,52.688l-2.797-2.797 c0.85-0.545,1.679-1.132,2.483-1.76l2.819,2.819C44.404,51.573,43.569,52.154,42.71,52.688z M35.3,52.348 c0.967-0.415,1.917-0.882,2.846-1.396l2.764,2.764c-0.948,0.502-1.918,0.948-2.903,1.339L35.3,52.348z M46.765,49.672l-2.825-2.825 c0.498-0.441,0.989-0.892,1.462-1.366c0.237-0.237,0.463-0.481,0.692-0.723l2.817,2.817c-0.229,0.244-0.441,0.497-0.68,0.735 C47.757,48.783,47.265,49.233,46.765,49.672z M53.396,15.915c1.28,1.962,2.186,4.121,2.766,6.383l-1.71-1.71 c-0.02-0.158-0.047-0.314-0.07-0.47c-0.038-0.26-0.075-0.52-0.121-0.778c-0.084-0.47-0.181-0.936-0.291-1.398 c-0.05-0.207-0.107-0.41-0.162-0.616c-0.095-0.356-0.198-0.71-0.309-1.061C53.461,16.149,53.435,16.03,53.396,15.915z M10.754,10.832c5.523-5.523,12.857-8.691,20.12-8.691c6.044,0,11.58,2.208,15.589,6.217c0.561,0.561,1.082,1.148,1.566,1.757 l0.26,0.344c0.02,0.026,0.039,0.053,0.059,0.079c0.441,0.585,0.847,1.188,1.22,1.808c0.008,0.014,0.016,0.028,0.024,0.042 c0.366,0.612,0.699,1.241,0.999,1.883c0.014,0.029,0.026,0.06,0.039,0.089c0.284,0.614,0.537,1.241,0.761,1.878 c0.019,0.056,0.039,0.111,0.058,0.167c0.195,0.57,0.359,1.15,0.507,1.735c0.034,0.136,0.073,0.27,0.105,0.407 c0.129,0.551,0.229,1.109,0.317,1.67c0.03,0.194,0.063,0.387,0.088,0.583c0.07,0.534,0.118,1.072,0.151,1.613 c0.014,0.221,0.026,0.443,0.034,0.666c0.019,0.535,0.02,1.073,0.004,1.612c-0.007,0.221-0.018,0.441-0.03,0.662 c-0.031,0.553-0.076,1.108-0.143,1.663c-0.023,0.194-0.054,0.388-0.081,0.582c-0.084,0.588-0.181,1.175-0.306,1.761 c-0.029,0.138-0.066,0.275-0.097,0.412c-0.135,0.59-0.286,1.178-0.462,1.764c-0.026,0.088-0.05,0.177-0.077,0.265 c-0.201,0.648-0.43,1.291-0.68,1.93c-0.037,0.096-0.071,0.192-0.11,0.287c-0.258,0.64-0.543,1.273-0.85,1.9 c-0.048,0.098-0.094,0.196-0.143,0.293c-0.314,0.625-0.654,1.242-1.016,1.852c-0.055,0.093-0.111,0.185-0.167,0.277 c-0.373,0.611-0.768,1.213-1.189,1.804c-0.058,0.081-0.118,0.161-0.177,0.242c-0.436,0.599-0.893,1.188-1.378,1.762 c-0.048,0.057-0.099,0.112-0.148,0.169c-0.512,0.597-1.046,1.182-1.612,1.748c-0.345,0.345-0.697,0.681-1.056,1.008 c-5.381,4.896-12.248,7.679-19.053,7.679c-0.215,0-0.425-0.018-0.639-0.024c-0.462-0.012-0.923-0.026-1.378-0.063 c-0.29-0.024-0.574-0.064-0.86-0.098c-0.401-0.048-0.801-0.099-1.196-0.167c-0.271-0.046-0.539-0.101-0.806-0.157 c-0.414-0.087-0.823-0.184-1.229-0.293c-0.237-0.063-0.473-0.126-0.707-0.197c-0.452-0.137-0.895-0.293-1.334-0.458 c-0.18-0.067-0.363-0.127-0.54-0.199c-0.607-0.246-1.202-0.515-1.78-0.814c-0.104-0.054-0.202-0.119-0.305-0.174 c-0.46-0.248-0.912-0.509-1.352-0.79c-0.244-0.157-0.479-0.328-0.717-0.495c-0.977-0.684-1.908-1.434-2.757-2.283 C-0.883,37.378,0.227,21.359,10.754,10.832z M16.374,53.63c0.272,0.084,0.547,0.162,0.823,0.237 c0.432,0.117,0.868,0.22,1.309,0.313c0.107,0.023,0.211,0.055,0.318,0.076l1.382,1.382c-1.539-0.557-2.999-1.277-4.353-2.158 C16.023,53.537,16.201,53.577,16.374,53.63z M24.035,56.64l-1.957-1.957c0.356,0.024,0.716,0.032,1.076,0.042 c0.24,0.006,0.474,0.033,0.715,0.033c0.804,0,1.608-0.045,2.411-0.116l2.345,2.345C28.453,56.99,28.282,57,28.111,57 C26.72,57,25.36,56.869,24.035,56.64z" /> <path d="M12.403,38.39l6.014-1.468c0.043-0.01,0.077-0.055,0.088-0.115l0.209-1.135c-2.145-1.718-3.367-4.104-3.639-7.106 c-1.089-0.791-1.608-2.141-1.309-3.529l0.276-1.28c0.236-1.093,0.983-2.062,1.996-2.622c0.419-1.214,0.958-2.336,1.606-3.339 c0.282-0.437,0.511-0.762,0.698-1.025c0.564-0.798,0.564-0.798,0.547-2.049c-0.007-0.503,0.01-1.016,0.049-1.525 C18.991,12.525,19.569,12,20.255,12c0.407,0,0.784,0.197,1.008,0.528c0.133,0.196,0.417,0.514,1.014,0.918 c1.104,0.746,2.791,1.079,4.705,0.952c0.293-0.02,0.595-0.03,0.902-0.03c9.284,0.009,11.737,4.493,12.083,8.483 c1.344,0.892,2.078,2.279,1.939,3.734l-0.16,1.674c-0.169,1.775-1.599,3.212-3.555,3.644c-1.634,3.323-4.245,5.477-7.604,6.277 l-0.176,1.261c-0.016,0.112,0.05,0.298,0.232,0.438l7.92,6.112c1.417-0.979,2.763-2.094,4.01-3.341 c4.694-4.694,7.547-10.686,8.034-16.874c0.491-6.246-1.483-11.931-5.559-16.006C41.417,6.14,36.383,4.14,30.874,4.14 c-6.736,0-13.554,2.955-18.705,8.106C7.474,16.94,4.621,22.932,4.135,29.12C3.644,35.366,4.846,38.924,8.923,43 C9.392,40.883,10.512,38.944,12.403,38.39z" /> </g> </g>
                </svg>
            </CardDataStats>
            <CardDataStats
                title="Total Balance"
                data={{
                    total: formatNumber(data?.balance.total || 0, 2),
                    levelUp: data?.balance.levelUp,
                    levelDown: data?.balance.levelDown,
                    symbol: 'ETH'
                }}
            >
                <svg className="fill-primary dark:fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 5.25C12.4142 5.25 12.75 5.58579 12.75 6V6.31673C14.3804 6.60867 15.75 7.83361 15.75 9.5C15.75 9.91421 15.4142 10.25 15 10.25C14.5858 10.25 14.25 9.91421 14.25 9.5C14.25 8.65573 13.3765 7.75 12 7.75C10.6235 7.75 9.75 8.65573 9.75 9.5C9.75 10.3443 10.6235 11.25 12 11.25C13.9372 11.25 15.75 12.5828 15.75 14.5C15.75 16.1664 14.3804 17.3913 12.75 17.6833V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V17.6833C9.61957 17.3913 8.25 16.1664 8.25 14.5C8.25 14.0858 8.58579 13.75 9 13.75C9.41421 13.75 9.75 14.0858 9.75 14.5C9.75 15.3443 10.6235 16.25 12 16.25C13.3765 16.25 14.25 15.3443 14.25 14.5C14.25 13.6557 13.3765 12.75 12 12.75C10.0628 12.75 8.25 11.4172 8.25 9.5C8.25 7.83361 9.61957 6.60867 11.25 6.31673V6C11.25 5.58579 11.5858 5.25 12 5.25Z"></path> </g></svg>
            </CardDataStats>
            <CardDataStats
                title="Total Txs"
                data={{
                    total: formatNumber(data?.transaction.total || 0),
                    rate: Number(data?.transaction.rate || 0).toFixed(2) + '%',
                    levelUp: data?.transaction.levelUp,
                    levelDown: data?.transaction.levelDown
                }}
            >
                <svg width="24" height="24" viewBox="0 -1 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-60.000000, -6680.000000)" fill="none" className="fill-primary dark:fill-white"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M19.3436674,6529.90723 L24,6524.929 L19.3436674,6520 L17.8942332,6521.34528 L20.314609,6523.93938 L4,6523.93938 L4,6525.94876 L20.314609,6525.94876 L17.8942332,6528.51474 L19.3436674,6529.90723 Z M10.1057668,6536.63061 L7.68638788,6533.98627 L23.9371978,6533.98627 L23.9371978,6531.97689 L7.68638788,6531.97689 L10.1057668,6529.46115 L8.65633255,6528.11286 L4,6533.0931 L8.65633255,6538 L10.1057668,6536.63061 Z"> </path> </g> </g> </g> </g></svg>
            </CardDataStats>
            <CardDataStats
                title="Total Users"
                data={{
                    total: formatNumber(data?.user.total || 0),
                    rate: Number(data?.user.rate || 0).toFixed(2) + '%',
                    levelDown: data?.user.levelDown,
                    levelUp: data?.user.levelUp
                }}
            >
                <svg
                    className="fill-primary dark:fill-white"
                    width="22"
                    height="18"
                    viewBox="0 0 22 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                        fill=""
                    />
                    <path
                        d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                        fill=""
                    />
                    <path
                        d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                        fill=""
                    />
                </svg>
            </CardDataStats>
        </div >
    )
}

export default Overview;