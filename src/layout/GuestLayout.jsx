import { Outlet } from "react-router-dom"
import Header from "../components/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const GuestLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <ToastContainer
                position="bottom-right"
                autoClose={1000}
                hideProgressBar={false}
                theme="light"
            />
        </>
    )
}

export default GuestLayout;