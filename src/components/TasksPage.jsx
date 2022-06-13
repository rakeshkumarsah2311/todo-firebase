import { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from "react-router-dom";
import { uid } from 'uid';
import { set,ref, onValue, remove, update  } from "firebase/database";

const TasksPage = ({ user, setUser }) => {
    const [allTodos, setAllTodos] = useState([]);
    const [ todos, setTodos ] = useState([]);

    const [message, setMessage ] = useState(null)
    const navigate = useNavigate()
    const [task, setTask ] = useState({
        taskName : "",
        date : ""
    })

    const [ date, setDate ] = useState()
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(!user) {
                setUser(null)
                navigate("/")
            }

            if(user) {
                onValue(ref(db, `/${auth.currentUser.uid}`), snapshot => {
                    setTodos([])
                    const data = snapshot.val()
                    if(data) {
                        let temp = []
                        Object.values(data).map(todo => {
                            temp.push(todo)
                        })
                        setAllTodos(temp)
                    }
                })
            }
        })
    },[])

    const handleSignOut = () => {
        signOut(auth).then(() => {
            setUser(null)
            navigate("/")
        }).catch(err => console.log("error", err.message))
    }

    
    const writeToDatabase = () => {
        const uidd = uid();
        set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
            task: task,
            uidd: uidd
        })
        console.log("tasas", task);
        setTask({taskName : "", date : "" })

    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if(!task.taskName) {
        setMessage("Please Enter Task");
        return
        } 

        if(!task.date){
        setMessage("Please Enter Date")
        return
        }

        writeToDatabase()
    }

    const handleChange = (e) => {
        setTask({...task, taskName : e.target.value})
    }

    const handleDateChange = (e) => {
        setTask({...task, date : e.target.value})
    };

    const today = new Date();

    const getTodayDate = () => {
        return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    }

    const filterTasks = (e) => {
        if(e.target.value === "tomorrow") setTodos(allTodos.filter(todo => todo.task.date === getTomorrowDate()))
        if(e.target.value === "today") setTodos(allTodos.filter(todo => todo.task.date === getTodayDate()))
        if(e.target.value === "Show Tasks for") setTodos([])
    }

    useEffect(() => {
        if(allTodos) {
            setTodos(allTodos.filter(todo => todo.task.date === getTodayDate()))
        }
    },[allTodos])

    const getTomorrowDate = () => today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+1)
    return (
        <div className="App">
        <h1>Hello {user}</h1>
        <button onClick={handleSignOut}>Log Out</button>
        <h3>TODOS</h3>
        <div>
            <select onChange={filterTasks}>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
            </select>
        </div>
        <h5>{message && message} </h5>
        
        <form onSubmit={handleSubmit} key={task} >
            <input type="text" placeholder='Add To Do' value={task.taskName} onChange={handleChange} required/>
            <select placeholder='Select Date' value={task.date} onChange={handleDateChange} required>
                <option>Select Date</option>
                <option value={getTodayDate()}>Today</option>
                <option value={getTomorrowDate()}>Tomorrow</option>
            </select>

            <button type='submit'>Add Task</button>
        </form>
        {
        todos?.map((todo, index) => <Todo key={index} todo={todo} />)
        }
        </div>
    )
}


export default TasksPage;

const Todo = ({ todo }) => {

    const handleDelete = (uidd) => {
        remove(ref(db, `/${auth.currentUser.uid}/${uidd}`))
    }

    return <div>
        <h3>{todo.task.taskName}</h3>
        <button onClick={() => handleDelete(todo.uidd)}>delete</button>
    </div>

}