import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, replace } from "react-router";
import api from "../api/axios";

const VerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setResult("Invalid verification link.");
                setSuccess(false);
                setLoading(false);
                return;
            }

            try {
                const response = await api.post(
                    `user/verify-email/?token=${encodeURIComponent(token)}`
                );

                setResult(
                    response?.data?.message || "Your email has been verified successfully."
                );
                setSuccess(true);
            } catch (error) {
                setResult(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Verification failed."
                );
                setSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />

                    <h2 className="text-xl font-semibold text-white">
                        Verifying your email
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                        Please wait while we verify your email address...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl sm:p-10">

                {/* Icon */}
                <div
                    className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${
                        success
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                    }`}
                >
                    {success ? (
                        <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    )}
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    {success
                        ? "Email Verified!"
                        : "Verification Failed"}
                </h1>

                {/* Message */}
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {result}
                </p>

                {/* Button */}
                {success && (
                    <button
                        onClick={() => navigate("/login", {replace:true})}
                        className="mt-8 w-full rounded-lg bg-white px-4 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-200 active:scale-[0.98]"
                    >
                        Continue to Login
                    </button>
                )}

                {!success && (
                    <button
                        onClick={() => navigate("/signup", {replace:true})}
                        className="mt-8 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.98]"
                    >
                        Back to Sign Up
                    </button>
                )}

            </div>
        </div>
    );
};

export default VerificationPage;