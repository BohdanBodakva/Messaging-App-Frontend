import "./Login.css"

function LoginForm({ onSwitch }) {
    return (
        <div className="form-container">
            <h2>Login</h2>
            <form>
                <input type="text" placeholder="Username" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <div className="toggle">
                <button onClick={onSwitch}>Don't have account? Sign up</button>
            </div>
        </div>
    );
}


export default LoginForm;