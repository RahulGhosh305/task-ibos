import React, { useEffect, useState } from 'react';
import Navbar from '../shared/navbar';
import styles from "./homeStyle.module.css";
import { useNavigate } from 'react-router-dom';
import { addAssignee, deleteTask, getAllTasks, getAllUsers, updateTaskStatus } from '../authentication/IndexedDB';
import { AiOutlineCheck, AiOutlineArrowRight } from 'react-icons/ai';
import { useForm } from "react-hook-form";

const Home = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [addMemberId, setAddMemberId] = useState();
    const addNewTask = () => {
        navigate("/addTask")
    }

    const { register, resetField, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            newAssignee: [],
        }
    });

    const fetchAllTasks = async () => {
        try {
            const tasks = await getAllTasks();
            setTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const updateTasks = () => {
        fetchAllTasks();
    }

    const onSubmit = async data => {
        const task = {
            ...data,
            newAssignee: data.newAssignee,
            id: addMemberId
        }
        // console.log(task)

        try {
            const result = await addAssignee(task);
            resetField("newAssignee")
            alert("Task Updated to IndexedDB")
            updateTasks()
        } catch (error) {
            console.error('Error Updated task to IndexedDB:', error);
        }
    }



    useEffect(() => {
        fetchAllTasks();
    }, []);


    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            updateTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            updateTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    };

    const addMember = (Id) => {
        setAddMemberId(Id)
        fetchAllUsers()
    }

    console.log(tasks);
    return (
        <div>
            <Navbar />
            <div className="container">
                <button onClick={addNewTask} className={`btn mt-3 ${styles.btn}`} >Add New Task</button>
                <div className="row">
                    <table className="mt-5 table table-responsive text-center">
                        <thead>
                            <tr>
                                <th scope="col">Priority</th>
                                <th scope="col">Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Status</th>
                                <th scope="col">Mark</th>
                                <th scope="col">Due Date</th>
                                <th scope="col">Assign</th>
                                <th scope="col">action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tasks?.map((task) => {
                                    return <tr key={task.id}>
                                        <th scope="row">{task?.Priority}</th>
                                        <td>{task?.title}</td>
                                        <td>{task?.description}</td>
                                        <td className='fw-bold'>{task?.status}</td>
                                        <td>
                                            {task?.status === "Complete" && <AiOutlineCheck />}
                                            {task?.status === "In Progress" && <AiOutlineArrowRight />}
                                        </td>
                                        <td>{task?.dueDate}</td>
                                        <td>
                                            {task?.assignedTo?.map(user => {
                                                return <span key={Math.random()}>{user}<br /></span>
                                            })}

                                            <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className='btn btn-sm btn-info mt-3' onClick={() => addMember(task?.id)}>More Assigned</button>
                                        </td>
                                        <td>
                                            {task?.status === "Complete" ? <button className={`me-2 btn btn-sm btn-secondary disabled`} onClick={() => handleTaskStatusChange(task?.id, "In Progress")}>Progress</button> : <button className='me-2 btn btn-sm btn-primary' onClick={() => handleTaskStatusChange(task?.id, "In Progress")}>Progress</button>}

                                            <button className='me-2 btn btn-sm btn-success' onClick={() => handleTaskStatusChange(task?.id, "Complete")}>Completed</button>

                                            <button className='btn btn-sm btn-danger' onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                        </td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Select One</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="d-flex align-items-center mx-1">
                                    <select className="form-control mb-3" {...register("newAssignee")}>
                                        <option>Assign To</option>
                                        {users?.map((user) => {
                                            return <option key={Math.random()} value={user.email}>{user.email}</option>
                                        })}
                                    </select>
                                </div>
                                <input type="submit" data-bs-dismiss="modal" className="btn btn-primary" />

                            </form>
                        </div>

                    </div>
                </div>
            </div>
            {/*  */}
        </div>
    );
};

export default Home;