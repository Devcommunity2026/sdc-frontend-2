import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const handelLogin = async (e, email, password, login, navigate, redirectTo) => {
    e.preventDefault();

    try {
        const res = await axios.post(
            `${API_URL}/auth/login`,
            { email, password },
            { withCredentials: true }
        );

        if (res.data.success) {
            localStorage.setItem("isLoggedIn", "true");
            login(res.data.user)
            console.log(res.data.user.role)
            if (['admin', 'moderator'].includes(res.data.user.role)) {
                navigate("/admin/user");
            } else if (redirectTo) {
                navigate(redirectTo);
            } else {
                navigate("/");
            }
        }
    } catch (err) {
        alert(err.response?.data?.message || "Login failed");
    }
};

export const checkLogin = (setIsLoggedIn) => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
};

export const handleLogout = async (setIsLoggedIn, setIsOpen, navigate, logout) => {
    try {
        const res = await axios.post(
            `${API_URL}/auth/logout`,
            {},
            { withCredentials: true }
        );
        if (res.data.success) {
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            setIsOpen(false);
            logout();
            navigate("/login");
        } else {
            alert("Logout failed");
        }
    } catch (err) {
        console.log(err)
        alert(err.response?.data?.message || "Logout failed");
    }
};
