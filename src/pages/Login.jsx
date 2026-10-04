import { useState } from "react";
import { useAuth } from "../utils/Auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setBusy(true);
        setErr("");

        try{
            await login(username, password);
            navigate(location.state?.from?.pathname || "/dashboard", {replace: true});
        }catch(err){
            setErr(err.message);
        }finally{
            setBusy(false);
        }
    };

    return (
        <div>
            <h2>Log In</h2>
            {err && <p>{err}</p>}
            <form onSubmit={handleSubmit}>
                    <label>Username <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
                    <label>Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/></label>
                    <button type="submit" disabled= {busy}>{busy?"Loggin in..." : "Log in"}</button>
            </form>
            <p>Don't have an account? <Link to="/signup">Sign up here!</Link></p>
        </div>
    );
}