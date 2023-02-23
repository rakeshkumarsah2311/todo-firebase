import { useEffect, useState } from "react"
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, onAuthStateChanged  } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";


const Welcome = ({ setUser }) => {

    const auth = getAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [formType, setFormType ] = useState("LOGIN")
    const [error, setError ] = useState(false)

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user) {
                setUser(user.email)
                navigate("/mytasks")
            }
        })
    },[onAuthStateChanged])

    const handleLogin = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password).then((resp) => {
            console.log("resp", resp);
            setUser(resp.user.email)
            navigate("/mytasks")
        }).catch(err => setError(err.message))
    }



    const handleSignUp = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password).then((resp) => {
            setUser(resp.user.email)
        }).catch(err => setError(err.message))
    }

    useEffect(() => {
        let id = setTimeout(() => {
            setError(null)
        }, 2000)
        return () => clearInterval(id)
    },[error])
    return <div className="welcome">

        <img src="/images/illustration.svg" alt="" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#e7ba66" fill-opacity="1" d="M0,64L48,58.7C96,53,192,43,288,64C384,85,480,139,576,154.7C672,171,768,149,864,165.3C960,181,1056,235,1152,240C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>

        {formType === "LOGIN" ? <div className="form-wrapper">
            <h3>Login</h3>
            <h5>{error && error}</h5>
            <form onSubmit={handleLogin} autoComplete="off">
                <div className="input-wrapper">
                    <input placeholder="email" type="email"  autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)}  />
                </div>
                <div className="input-wrapper">
                    <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="primary" type="submit">Submit</button>
            </form>

            <p>No Account? <span onClick={() => setFormType("REGISTER")}> Register Here</span></p>
        </div> : 
        <div className="form-wrapper">
            <h3>SignUp</h3>
            <h5>{error && error}</h5>
            <form onSubmit={handleSignUp} autoComplete="off">
                <div className="input-wrapper">
                <input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="false"/>

                </div>

                <div className="input-wrapper">
                    <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                </div>
                <button className="primary" type="submit">Submit</button>
            </form>

            <p>Have an Account?  <span onClick={() => setFormType("LOGIN")}> Login Here</span></p>

        </div> 
        }
    

    </div>
}

export default Welcome