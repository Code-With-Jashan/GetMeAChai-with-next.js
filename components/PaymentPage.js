"use client"
import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { fetchuser, fetchpayments, initiate } from '@/actions/useractions'
import { useSession } from 'next-auth/react'
import { useRouter} from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';


const PaymentPage = ({ username }) => {
    const [paymentform, setPaymentform] = useState({
        name: "",
        message: "",
        amount: ""
    })
    const [currentUser, setcurrentUser] = useState({})
    const [payments, setPayments] = useState([])
    const router = useRouter()
    // const { data: session } = useSession()
    const searchParams = useSearchParams()

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if(searchParams.get("paymentdone") == "true" ){
        toast.success('Thanks for your donation!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

        }
        router.push(`/${username}`)
    }, [])


    //  useEffect(() => {


    //         if (!session) {
    //             router.push('/login')
    //         }

    //     }, [router, session])


    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }

    const getData = async () => {
        let u = await fetchuser(username)
        setcurrentUser(u)
        let dbpayments = await fetchpayments(username)
        setPayments(dbpayments)
    }

    const pay = async (amount) => {
        let a = await initiate(amount, username, paymentform)
        let orderId = a.id
        var options = {
            "key": currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
            "amount": amount, // Amount is in currency subunits. 
            "currency": "INR",
            "name": "Get Me A Chai", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": "Gaurav Kumar", //your customer's name
                "email": "gaurav.kumar@example.com",
                "contact": "+919876543210" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }

        }
        var rzp1 = new Razorpay(options);
        rzp1.open();

    }
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>


            <div className='cover w-full bg-red-50 relative'>
                <img className='object-cover w-full  h-[350]' src={currentUser.coverpic} alt="" />
                <div className='absolute -bottom-20 right-[38%] md:right-[42%] lg:right-[46%] sm:right-[43%] xs-max:right-[36%] border-white border-2 overflow-hidden rounded-full size-32'>
                    <img className='rounded-full object-cover size-32 ' width={130} height={130} src={currentUser.profilepic} alt="" />
                </div>
            </div>
            <div className="info flex justify-center items-center my-24  mb-32 flex-col gap-2">

                <div className="font-bold text-lg">
                    @{username}
                </div>
                <div className='text-slate-400'>
                    Lets help {username} get a chai!
                </div>
                <div className='text-slate-400'>
                    {payments.length} Payments . ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
                </div>

                <div className="payment flex gap-3 w-[80%] mt-6 md:mt-11 flex-col md:flex-row">
                    <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-5 md:p-10">
                        {/* Show list of all the supporters as a leaderboard */}
                        <h2 className='text-lg font-bold my-3 md:my-5'> Top 10 Supporters</h2>
                        <ul className='mx-5 text-sm '>
                            {payments.length == 0 && <li>No payments yet</li>}
                            {payments.map((p, i) => {
                                return <li key={i} className='my-4 flex gap-2 items-center'>
                                    <img width={33} src="avatar.gif" alt="user avatar" />
                                    <span>
                                        {p.name} donated <span className='font-bold'>₹{p.amount}</span> with a message 	&quot;{p.message}&quot;
                                    </span>
                                </li>
                            })}

                        </ul>
                    </div>
                    <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-5 md:p-10">
                        <h2 className="text-2xl font-bold my-3 md:my-5">Make a Payment</h2>
                        <div className="flex gap-2 flex-col">
                            {/* input for name and message */}
                            <div>
                                <input onChange={handleChange} value={paymentform.name} name="name" type="text" className='w-full p-3 rounded-lg bg-slate-800 ' placeholder='Enter Name' />

                            </div>

                            <input onChange={handleChange} value={paymentform.message} name="message" type="text" className='w-full p-3 rounded-lg bg-slate-800 ' placeholder='Enter Message' />
                            <input onChange={handleChange} value={paymentform.amount} name="amount" type="text" className='w-full p-3 rounded-lg bg-slate-800 ' placeholder='Enter Amount' />

                            <button onClick={() => pay(paymentform.amount)} type="button" className=" text-white bg-gradient-to-br from-purple-800 to-blue-700 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100 disabled:cursor-not-allowed disabled:opacity-80" disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length < 1}>Pay</button>
                        </div>
                        {/* Or choose from these amounts */}
                        <div className="flex flex-col md:flex-row gap-2 mt-5">
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(10)}>Pay ₹10</button>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(20)}>Pay ₹20</button>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(30)}>Pay ₹30</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default PaymentPage
