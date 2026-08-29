import { useState } from "react";
import { generate_verification_link, login, signup } from "../services/authService"
import { useProfile, useVerification } from "../app/store"
import { useNavigate } from "react-router";
import { toast } from "react-toastify"
import logo from "../assets/edge_stream_logo.png";

const LoginSignUp = ({ isLogin = true }) => {
    const [loginMode, setLoginMode] = useState(isLogin);
    const setUser = useProfile((state) => state.setUser);
    const sendVerification = useVerification((state) => state.sendVerification);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (loginMode) {
            console.log("Login:", formData);
            login(formData).then((data) => {
                setUser(data); navigate("/");
                toast.success("User loggedin successfully");
            }).catch((e) => {
                console.log(e.response.data);
                toast.error(e.response?.data?.message || "Login failed");
            }

            );

        } else {
            console.log("Signup:", formData);
            signup(formData).then((data) => {
                setUser(data);
                // Generate a verification link
                toast.success("User signup successfully");
                sendVerification();
                navigate("/generate-verification-link")

            }).catch((e) => {
                console.log(e);
                console.log(e.response?.data?.message)
                toast.error(e.response?.data?.message || "Signup failed");

            });

        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
            
            <div className="flex items-center gap-3 py-4 sm:py-5 mb-3">
                <img
                    src={logo}
                    alt="Edge Stream"
                    className="
                            h-10 w-10
                            shrink-0
                            rounded-xl
                            object-contain
                            sm:h-12 sm:w-12
                        "
                />

                <div className="min-w-0">
                    <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Edge Stream
                    </h1>
                    <p className="hidden text-xs text-zinc-400 sm:block">
                        Stream. Discover. Enjoy.
                    </p>
                </div>
            </div>

            <div className="max-w-sm md:max-w-md lg:max-w-lg bg-zinc-900 shadow-2xl p-8 rounded-xl border border-zinc-700">

                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
                    {loginMode ? "Login" : "Create Account"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {!loginMode && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-800 outline-none"
                            minLength={1}
                            required
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-800 outline-none"
                        minLength={1}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-800 outline-none"
                        minLength={6}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-3 rounded bg-red-600 hover:bg-red-700 transition"
                    >
                        {loginMode ? "Login" : "Sign Up"}
                    </button>

                </form>


                <p className="mt-5 text-gray-400 text-center">
                    {loginMode
                        ? "Don't have an account?"
                        : "Already have an account?"
                    }

                    <button
                        onClick={() => setLoginMode(!loginMode)}
                        className="ml-2 text-red-500 hover:underline"
                    >
                        {loginMode ? "Sign Up" : "Login"}
                    </button>
                </p>

            </div>
        </div>
    );
};

export default LoginSignUp;