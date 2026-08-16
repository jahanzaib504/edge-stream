import { useState } from "react";
import {generate_verification_link, login, signup} from "../services/authService"
import {useProfile, useVerification} from "../app/store"
import { useNavigate } from "react-router";
const LoginSignUp = ({ isLogin = true }) => {
    const [loginMode, setLoginMode] = useState(isLogin);
    const setUser = useProfile((state)=>state.setUser);
    const sendVerification = useVerification((state)=>state.sendVerification);
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

    const handleSubmit =  (e) => {
        e.preventDefault();

        if (loginMode) {
            console.log("Login:", formData);
            login(formData).then((data)=>{ setUser(data); navigate("/")}).catch((e)=>console.log(e));
            
        } else {
            console.log("Signup:", formData);
            signup(formData).then((data)=> {
                setUser(data);
                // Generate a verification link
                sendVerification();
                navigate("/generate-verification-link")
                
            }).catch((e)=>console.log(e));
            
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">

                <h1 className="text-3xl font-bold mb-6">
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
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-800 outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-800 outline-none"
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