import { BrowserRouter, Routes, Route } from "react-router";
import Providers from "./providers";
import env from "../config/env";
import HomePage from "../pages/HomePage";
const Router = () => {
    console.log(env)
    return (
        <Providers>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                </Routes>
            </BrowserRouter>
        </Providers>
    )
}
export default Router;