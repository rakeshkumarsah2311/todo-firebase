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
    return <div>
        {formType === "LOGIN" ? <div>
            <h3>Login</h3>
            <h5>{error && error}</h5>
            <form onSubmit={handleLogin} autoComplete="off">
                <input placeholder="email" type="email"  autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)}  />
                <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>

            <p>No Account? Register <span onClick={() => setFormType("REGISTER")}>Here</span></p>
        </div> : 
        <div>
            <h3>SignUp</h3>
            <h5>{error && error}</h5>
            <form onSubmit={handleSignUp} autoComplete="off">
                <input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="false"/>
                <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Submit</button>
            </form>

            <p>Have an Account? Login <span onClick={() => setFormType("LOGIN")}>Here</span></p>

        </div> 
        }
    

    </div>
}

export default Welcome