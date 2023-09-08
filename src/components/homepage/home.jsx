import React, { useEffect, useState } from 'react';
import Navbar from '../shared/navbar';
import styles from "./homeStyle.module.css";
import { useNavigate } from 'react-router-dom';
import { addAssignee, deleteTask, getAllTasks, getAllUsers, getTaskByDueDate, getTasksByCustomPriority, getTasksByStatus, updateTaskStatus } from '../authentication/IndexedDB';
import { AiOutlineCheck, AiOutlineArrowRight } from 'react-icons/ai';
import { useForm } from "react-hook-form";

const Home = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [addMemberId, setAddMemberId] = useState();

    const [statusFilter, setStatusFilter] = useState('');
    const [dueDateFilter, setDueDateFilter] = useState('');

    const [statusFilterResult, setStatusFilterResult] = useState([]);
    const [dueDateFilterResult, setDueDateFilterResult] = useState(null);

    const [sort, setSort] = useState('');
    const [sortResult, setSortResult] = useState([]);

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


    const handleFilterTasks = async () => {
        let filteredTasks = [];
        let filteredDate = "";

        if (statusFilter) {
            filteredTasks = await getTasksByStatus(statusFilter);
            setStatusFilterResult(filteredTasks)
            if (!filteredTasks.length) {
                alert("No Filter Data Found")
                setStatusFilter("")
            }
        } else if (dueDateFilter) {
            filteredDate = await getTaskByDueDate(dueDateFilter);
            setDueDateFilterResult(filteredDate)
            if (filteredDate === null) {
                alert("No Date Match")
                setDueDateFilter("")
            }
        }
    };

    const handleSortTasks = async () => {
        let sortData = []
        // console.log(sort);
        if (sort) {
            sortData = await getTasksByCustomPriority(sort);
            setSortResult(sortData)
            if (!sortData.length) {
                alert("No Filter Data Found")
                setSort("")
            }
        }
    };

    // console.log(statusFilterResult);
    // console.log(dueDateFilterResult);
    // console.log(tasks);
    console.log(sortResult);



    return (
        <div>
            <Navbar />
            <div className="container">

                {/* Header Functionality */}
                <button onClick={addNewTask} className={`btn mt-3 ${styles.btn}`} >Add New Task</button>
                <div className='d-flex justify-content-between'>
                    <div className='mt-4'>
                        <div className='d-flex'>
                            <div className='me-5'>
                                Filter by Status
                                <label className='ms-2'>
                                    <select className='form-control' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value="">Filter Status</option>
                                        <option value="Completed">Completed</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <strong className='me-5'>Or</strong> Filter by Due Date
                                <label className='ms-2'>
                                    <input className='form-control' type="date" value={dueDateFilter} onChange={(e) => setDueDateFilter(e.target.value)} />
                                </label>
                            </div>
                        </div>

                        <button className='btn btn-sm btn-primary mt-3' onClick={handleFilterTasks}>Filter</button>

                    </div>


                    <div className='mt-4'>
                        <div className='d-flex'>
                            <label className='ms-2'>
                                <select className='form-control' value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="">Sort Order</option>
                                    <option value="asc">Low - Moderate - Top</option>
                                    <option value="desc">Top - Moderate - Low</option>
                                </select>
                            </label>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <button className='btn btn-sm btn-primary mt-3' onClick={handleSortTasks}>Sort</button>
                        </div>
                    </div>
                </div>


                {/* Table Start */}
                <div className="container">
                    <div className="row mt-5">
                        <table className="table table-responsive text-center">
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
                                {/* Filter By Status */}
                                {
                                    statusFilterResult?.map((task) => {
                                        return <tr key={task.id}>
                                            <th scope="row">{task?.Priority}</th>
                                            <td>{task?.title}</td>
                                            <td>{task?.description}</td>
                                            <td className='fw-bold'>{task?.status}</td>
                                            <td>
                                                {task?.status === "Completed" && <AiOutlineCheck />}
                                                {task?.status === "In Progress" && <AiOutlineArrowRight />}
                                            </td>
                                            <td>{task?.dueDate}</td>
                                            <td>
                                                {task?.assignedTo?.map(user => {
                                                    return <span key={Math.random()}>{user}<br /></span>
                                                })}
                                            </td>
                                            <td>
                                                {task?.status === "Completed" ? <button className={`me-2 btn btn-sm btn-secondary disabled`} onClick={() => handleTaskStatusChange(task?.id, "In Progress")}>Progress</button> : <button className='me-2 btn btn-sm btn-primary' onClick={() => handleTaskStatusChange(task?.id, "In Progress")}>Progress</button>}

                                                <button className='me-2 btn btn-sm btn-success' onClick={() => handleTaskStatusChange(task?.id, "Completed")}>Completed</button>

                                                <button className='btn btn-sm btn-danger' onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    })
                                }

                                {/* Filter By Date */}
                                {
                                    dueDateFilterResult !== null &&
                                    <tr key={dueDateFilterResult?.id}>
                                        <th scope="row">{dueDateFilterResult?.Priority}</th>
                                        <td>{dueDateFilterResult?.title}</td>
                                        <td>{dueDateFilterResult?.description}</td>
                                        <td className='fw-bold'>{dueDateFilterResult?.status}</td>
                                        <td>
                                            {dueDateFilterResult?.status === "Completed" && <AiOutlineCheck />}
                                            {dueDateFilterResult?.status === "In Progress" && <AiOutlineArrowRight />}
                                        </td>
                                        <td>{dueDateFilterResult?.dueDate}</td>
                                        <td>
                                            {dueDateFilterResult?.assignedTo?.map(user => {
                                                return <span key={Math.random()}>{user}<br /></span>
                                            })}
                                        </td>

                                        {
                                            dueDateFilterResult && <td>
                                                {dueDateFilterResult?.status === "Completed" ? <button className={`me-2 btn btn-sm btn-secondary disabled`} onClick={() => handleTaskStatusChange(dueDateFilterResult?.id, "In Progress")}>Progress</button> : <button className='me-2 btn btn-sm btn-primary' onClick={() => handleTaskStatusChange(dueDateFilterResult?.id, "In Progress")}>Progress</button>}

                                                <button className='me-2 btn btn-sm btn-success' onClick={() => handleTaskStatusChange(dueDateFilterResult?.id, "Completed")}>Completed</button>

                                                <button className='btn btn-sm btn-danger' onClick={() => handleDeleteTask(dueDateFilterResult.id)}>Delete</button>
                                            </td>
                                        }
                                    </tr>
                                }

                                {/* Sort Order */}
                                {
                                    sortResult?.map((task) => {
                                        return <tr key={task.id}>
                                            <th scope="row">{task?.Priority}</th>
                                            <td>{task?.title}</td>
                                            <td>{task?.description}</td>
                                            <td className='fw-bold'>{task?.status}</td>
                                            <td>
                                                {task?.status === "Completed" && <AiOutlineCheck />}
                                                {task?.status === "In Progress" && <AiOutlineArrowRight />}
                                            </td>
                                            <td>{task?.dueDate}</td>
                                            <td>
                                                {task?.assignedTo?.map(user => {
                                                    return <span key={Math.random()}>{user}<br /></span>
                                                })}
                                            </td>
                                            <td>
                                                {task?.status === "Completed" ? <button className={`me-2 btn btn-sm btn-secondary disabled`} onClick={() => handleTaskStatusChange(task?.id, "In Progress")}>Progress</button> : <button className='me-2 btn btn-sm btn-primary' onClick={() => handleTaskStatusChange(task?.id, "In Progress")}>Progress</button>}

                                                <button className='me-2 btn btn-sm btn-success' onClick={() => handleTaskStatusChange(task?.id, "Completed")}>Completed</button>

                                                <button className='btn btn-sm btn-danger' onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    })
                                }

                                {/* All Task Form IndexedDb local Machine */}
                                {
                                    statusFilterResult.length == 0 && sortResult.length == 0 && dueDateFilterResult === null && tasks?.map((task) => {
                                        return <tr key={task.id}>
                                            <th scope="row">{task?.Priority}</th>
                                            <td>{task?.title}</td>
                                            <td>{task?.description}</td>
                                            <td className='fw-bold'>{task?.status}</td>
                                            <td>
                                                {task?.status === "Completed" && <AiOutlineCheck />}
                                                {task?.status === "In Progress" && <AiOutlineArrowRight />}
                                            </td>
                                            <td>{task?.dueDate}</td>
                                            <td>
                                                {task?.assignedTo?.map(user => {
                                                    return <span key={Math.random()}>{user}<br /></span>
                                                })}
                                            </td>
                                            <td>
                                                {task?.status === "Completed" ? <button className={`me-2 btn btn-sm btn-secondary disabled`} onClick={() => handleTaskStatusChange(task?.id, "In Progress")}>Progress</button> : <button className='me-2 btn btn-sm btn-primary' onClick={() => handleTaskStatusChange(task?.id, "In Progress")}>Progress</button>}

                                                <button className='me-2 btn btn-sm btn-success' onClick={() => handleTaskStatusChange(task?.id, "Completed")}>Completed</button>

                                                <button className='btn btn-sm btn-danger' onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    })
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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

        </div>
    );
};

export default Home;