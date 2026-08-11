import { useState } from "react";
import { useProfile } from "../app/store";
import { motion, AnimatePresence } from "framer-motion"
import { delete_profile, update_profile } from "../services/authService";
const shake = {
    x: [0, -10, 10, -8, 8, -5, 5, 0],
    transition: {
        duration: 0.4,
    },
};

const ConfirmPopup = ({ isOpen, onConfirm, onCancel }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold text-zinc-100">
                            Are you sure you want to delete your account?
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={onCancel}
                                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={onConfirm}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                            >
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Field = ({
    id,
    type = "text",
    placeholder,
    value,
    handleChange,
    label,
    isDisabled = false,
    error = null,
}) => {
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="text-sm font-medium text-zinc-300"
            >
                {label}
            </label>

            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={isDisabled}
                className="
                    w-full
                    rounded-xl
                    border border-zinc-700
                    bg-zinc-800
                    px-4
                    py-3
                    text-zinc-100
                    placeholder:text-zinc-500
                    outline-none
                    transition-all
                    duration-200
                    focus:border-red-500
                    focus:ring-2
                    focus:ring-red-500/20
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            />
            {error && <motion.div
                animate={shake}
            >
                <div className="text-sm text-red-500">* {error}</div></motion.div>}
        </div>
    );
};

export const ProfilePage = () => {
    const user = useProfile((state) => state.user);
    const [submit, setSubmit] = useState(false)
    const [isDeleting, setDeleting] = useState(false);
    const [isOpen, setOpen] = useState(false);

    const [data, setData] = useState({
        email: user.email,
        password: "",
        username: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        email: null,
        password: null,
        username: null,
        confirmPassword: null,
    })
    const handleChange = (e) => {
        setErrors((prev) => ({ ...prev, [e.target.id]: null }));
        setData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleSave = async () => {
        if(submit || isDeleting)
            return;

        if (data.password != data.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Password does not match" }));
        }
        try {
            setSubmit(true);
            await update_profile({ data });
        }
        catch (e) {
            console.log(e);
        }finally{
            setSubmit(false);
            setOpen(false);
        }
    }
    const handleDeleteAccount = async() => {
        if(submit || isDeleting)
            return;

        try{
            setDeleting(true);
            await delete_profile();
        }catch(e){
            console.log(e);
        }
        finally{
            setDeleting(false);
        }
    }
    return (
        <div className="min-h-screen bg-zinc-900 px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
                    <h1 className="mb-8 text-3xl font-bold text-zinc-100">
                        Profile
                    </h1>

                    <div className="space-y-6">
                        <Field
                            id="username"
                            placeholder="e.g John Doe"
                            value={data.username}
                            handleChange={handleChange}
                            label="Username"
                            error={errors.username}
                        />

                        <Field
                            id="email"
                            type="email"
                            placeholder="e.g. john.doe@gmail.com"
                            value={data.email}
                            handleChange={handleChange}
                            label="Email"
                            error={errors.email}
                            isDisabled={true}
                        />

                        <Field
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            handleChange={handleChange}
                            label="Password"
                            error={errors.password}
                        />

                        <Field
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={data.confirmPassword}
                            handleChange={handleChange}
                            label="Confirm Password"
                            error={errors.confirmPassword}
                        />

                        <div className="pt-4">
                            <button
                                className="
                                    rounded-xl
                                    bg-blue-600
                                    px-6
                                    py-3
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-blue-500
                                    active:scale-95
                                "
                                onClick={handleSave}
                                disabled={submit}
                            >
                                {submit?"Saving...":"Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl mt-4">
                    <h2 className="mb-8 text-3xl font-bold text-zinc-100">Account Deletion</h2>
                    <button className="
                                    rounded-xl
                                    bg-red-600
                                    px-6
                                    py-3
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-red-500
                                    active:scale-95
                                "
                        onClick={()=>setOpen(true)}
                        disabled={isDeleting}
                    >{isDeleting?"Deleteting...":"Delete Account"}</button>
                </div>

                <ConfirmPopup isOpen={isOpen} onConfirm={delete_profile} onCancel={()=>setOpen(false)}/>
            </div>
        </div>
    );
};