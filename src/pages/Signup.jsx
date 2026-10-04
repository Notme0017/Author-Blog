import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";

export default function Singup (){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    const {signup} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setBusy(true);
        setErr("");

        try{
            await signup(username, password);
            navigate("/dashboard", {replace: true});
        }catch(err){
            setErr(err.message);
        }finally {
            setBusy(false);
        }
    }

    return (
        <div>
            <h2>Create Author Account</h2>
            {err && <p>{err}</p>}

            <form onSubmit={handleSubmit}>
                <label>Username <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /> </label>
                <label>Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /> </label>
                <button type="submit" disabled={busy}>{busy? "Registering..." : "Sign Up"}</button>
            </form>
            <p> Already registered? <Link to="/login">Log in here</Link></p>
        </div>
    )
}