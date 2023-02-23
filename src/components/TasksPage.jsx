import { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from "react-router-dom";
import { uid } from 'uid';
import { set,ref, onValue, remove, update  } from "firebase/database";

const TasksPage = ({ user, setUser }) => {
    const [allTodos, setAllTodos] = useState([]);
    const [ todos, setTodos ] = useState([]);
    const [showForm, setShowForm ] = useState(false);

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
                setUser(user.email)
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

        setShowForm(false)
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


    const handleClick = (e) => {
        console.log(e.target.classList);
        if(e.target.classList[0] === "addtask-form") setShowForm(false)
    }   
    const getTomorrowDate = () => today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+1)
    return (
        <div className="taskpage">
         
         <div className='greeting'>
            <img src='/images/avatar.svg' alt='' />
            <h5>{user}</h5>
         </div>
        <button className='logout' onClick={handleSignOut}>Log Out</button>
        <h3>Your Tasks for</h3>
        <div className='filter-wrapper'>
            <select onChange={filterTasks}>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
            </select>
        </div>
        <h5>{message && message} </h5>
        
        <form onClick={handleClick} className={`addtask-form ${showForm && "show"}`} onSubmit={handleSubmit} key={task} >
            <div className='wrapper'>
                <div>
                    <input type="text" placeholder='Add To Do' value={task.taskName} onChange={handleChange} required/>
                </div>
                <select placeholder='Select Date' value={task.date} onChange={handleDateChange} required>
                    <option>Select Date</option>
                    <option value={getTodayDate()}>Today</option>
                    <option value={getTomorrowDate()}>Tomorrow</option>
                </select>

                <div>
                    <button className='add-task-btn' type='submit'>Add Task</button>
                </div>
            </div>
        </form>
        <div className="tasks-wrapper">
            {
                todos?.map((todo, index) => <Todo key={index} todo={todo} />)
            }
        </div>

        <img onClick={() => setShowForm(true)} src='/images/add-button.svg' className='add-button' />
        </div>
    )
}


export default TasksPage;

const Todo = ({ todo }) => {

    const handleDelete = (uidd) => {
        remove(ref(db, `/${auth.currentUser.uid}/${uidd}`))
    }

    return <div className='task'>
        <h4>{todo.task.taskName}</h4>
        <img className='delete-icon' src='/images/delete-icon.svg' onClick={() => handleDelete(todo.uidd)} />
    </div>

}