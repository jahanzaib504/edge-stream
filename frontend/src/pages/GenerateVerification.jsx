import { useEffect, useState } from "react";
import api from "../api/axios";
import { useVerification } from "../app/store";

const GenerateVerification = () => {
    const loading = useVerification((state)=>state.loading);
    const setLoading = useVerification((state)=>state.setLoading);
    const error = useVerification((state)=>state.error);
    const sendVerification = useVerification((state)=>state.sendVerification);

    const [message, setMessage] = useState(
        "A verification email has been sent to your email address. Please check your inbox and spam folder."
    );

    const resendEmail = () => {
        sendVerification();
    };
    useEffect(()=>{
        
    }, [])
    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md rounded-xl bg-zinc-900 p-8 text-center shadow-lg">
                <div className="mb-6 text-5xl">📧</div>

                <h1 className="text-2xl font-bold text-white">
                    Verify Your Email
                </h1>

                <p className="mt-4 text-zinc-400">
                    {error || message}
                </p>

                <button
                    onClick={resendEmail}
                    disabled={loading}
                    className="mt-8 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Sending..." : "Resend Email"}
                </button>
            </div>
        </div>
    );
};

export default GenerateVerification;