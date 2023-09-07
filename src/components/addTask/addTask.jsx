import React, { useEffect, useState } from 'react';
import Navbar from '../shared/navbar';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import styles from "./style.module.css"
import { addTask, getAllUsers } from '../authentication/IndexedDB';

const AddTask = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate('/')
    }
    const { register, resetField, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            title: '',
            description: '',
            dueDate: '',
            priority: '',
            assignedTo: [],
            status: 'Pending',
        }
    });

    const onSubmit = async data => {
        // console.log(data)
        const task = {
            ...data,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            Priority: data.Priority,
            assignedTo: [data.assignedTo],
            status: data.status
        }
        // console.log(task)
        try {
            const result = await addTask(task);
            clearInputField()
            alert("Task added to IndexedDB")
            handleNavigate()
            console.log('Task added to IndexedDB with ID:', result);
        } catch (error) {
            console.error('Error adding task to IndexedDB:', error);
        }
    }

    //* Input Field Clear
    const clearInputField = () => {
        resetField("title")
        resetField("description")
        resetField("dueDate")
        resetField("Priority")
        resetField("assignedTo")
    }

    const fetchAllUsers = async () => {
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    };

    // Fetch all users when the component mounts
    useEffect(() => {
        fetchAllUsers();
    }, []);



    return (
        <>
            <Navbar />
            <div className="">
                <div className="container">
                    <div className="row d-flex justify-content-center mt-5 mx-3">
                        <div className="col-md-5 card pb-4 mb-3 shadow my-auto">
                            <div className={styles.wrapper}>
                                <h4>Add Task</h4>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="d-flex align-items-center mx-1">
                                    <input type="text" className="form-control mb-3 border-0 border-bottom" placeholder="Title" {...register("title", { required: true })} />
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <input type="text" className="form-control mb-3 border-0 border-bottom" placeholder="Description" {...register("description", { required: true })} />
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <input type="date" className="form-control mb-3 border-0 border-bottom" placeholder="Due Date" {...register("dueDate", { required: true })} />
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <select className="form-control mb-3 border-0 border-bottom" {...register("Priority")}>
                                        <option defaultValue>Select Priority</option>
                                        <option value="Top">Top</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <select className="form-control mb-3 border-0 border-bottom" {...register("assignedTo")}>
                                        <option>Assign To</option>
                                        {users?.map((user) => {
                                            return <option key={Math.random()} value={user.email}>{user.email}</option>
                                        })}
                                    </select>
                                </div>

                                <div className="d-flex justify-content-center">
                                    <input type="submit" className={styles.btn} />
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddTask;