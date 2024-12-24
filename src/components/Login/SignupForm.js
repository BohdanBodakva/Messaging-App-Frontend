import "./Login.css"

function SignupForm({ onSwitch }) {
    return (
        <div className="form-container">
            <h2>Sign Up</h2>
            <form>
                <input type="text" placeholder="Name" required/>
                <input type="text" placeholder="Surname" />
                <input type="text" placeholder="Username" required/>
                <input type="password" placeholder="Password" required/>
                <input type="password" placeholder="Repeat password" required/>
                <button type="submit">Sign Up</button>
            </form>
            <div className="toggle">
            <button onClick={onSwitch}>Already have an account? Login</button>
            </div>
        </div>
    );
}

export default SignupForm;