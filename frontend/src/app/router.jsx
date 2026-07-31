import { BrowserRouter, Routes, Route } from "react-router";
import Providers from "./providers";
const Router = () => {
    return (
        <Providers>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<div>Hello World</div>} />
                </Routes>
            </BrowserRouter>
        </Providers>
    )
}
export default Router;