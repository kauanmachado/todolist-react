import './App.css';
import {useState, useEffect} from 'react';
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs';

const API = "http://localhost:5000"
function App() {

  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const loadData = async () => {

      setLoading(true)

      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err))

      setLoading(false)
      setTodos(res)
    }

    loadData()

  }, [])


  const handleSubmit =  async (e) => {
    e.preventDefault();

    console.log(title || "")
    

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    //Envio para API
    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }

    })


    //Mostra tarefa sem precisar carregar a pagina
    setTodos((prevState) => [...prevState, todo])

    setTitle("")
    setTime("")
  }

  const handleDelete = async (id) => {
      await fetch(API + "/todos/" + id, {
      method: "DELETE"
    })

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  }

  const handleEdit = async (todo) => {

    todo.done = !todo.done

    const data = await fetch(API + "/todos/" + todo.id, {
        method: "PUT",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "application/json"
        }
    })

      setTodos((prevState) =>
       prevState.map((t) => (t.id === data.id ? (t = data) : t))
       );
  }
  if(loading) {
     return <h3 className="text-white text-center mt-5">Carregando...</h3>
  }
  return (
    <div className="container">
    <div className="row">
    <div className="App shadow p-5 col-md-9 col-xl-6 col-sm-12 mt-5">
      <div className="todo-header mb-4">
          <h1><img src="logo192.png" className="logo"/> To-do List</h1>
      </div>
      <div className="form-todo mb-3">
        <h3 className="text-center">Insira sua tarefa: </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-controll">
            <label htmlFor="title" className="form-label">Qual a sua tarefa?</label>
            <input
            type="text" 
            name="title"
            className="form-control shadow"
            placeholder="Titulo da tarefa" 
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
            />
          </div>
        </form>
      </div>

      <div className="form-todo mb-3">
        <form onSubmit={handleSubmit}>
          <div className="form-controll">
            <label htmlFor="time" className="form-label">Duração: </label>
            <input
            type="text" 
            name="time"
            className="form-control shadow" 
            placeholder="Tempo estimado (em horas)" 
            onChange={(e) => setTime(e.target.value)}
            value={time}
            required
            />
          </div>
          <input type="submit" value="Adicionar tarefa" className="mt-4"/>
          
        </form>
      </div>

      <div className="list-todo mt-5">
        <h3 className="text-center">Lista de tarefas: </h3>
        {todos.length === 0 && <span className="text-secondary text-center">Não há tarefas</span>}
        {todos.map((todo) => (
          <div className="todo mb-4" key={todo.id}>
            <h5 className={todo.done ? "todo-done" : ""}>{todo.title}</h5>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
    </div>
  );
}

export default App;
