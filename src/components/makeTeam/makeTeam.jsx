import React, { useEffect, useState } from 'react';
import Navbar from '../shared/navbar';
import { useForm } from "react-hook-form";
import { addTeam, addTeamAssignee, deleteTeam, getAllTasks, getAllTeams, getAllUsers, updateTeamTask } from '../authentication/IndexedDB';



const MakeTeam = () => {
    const [selectedFruits, setSelectedFruits] = useState([]);
    const [selectedFruit, setSelectedFruit] = useState("");
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [addMemberId, setAddMemberId] = useState();

    const { register, resetField, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            teamName: "",
            allMembers: [],
        }
    });
    const handleFruitChange = (e) => {
        const fruit = e.target.value;
        setSelectedFruit(fruit);
    };

    const handleAddFruit = () => {
        if (selectedFruit && !selectedFruits.includes(selectedFruit)) {
            setSelectedFruits([...selectedFruits, selectedFruit]);
            setSelectedFruit("");
        }
    };

    const updateTeams = () => {
        fetchAllTeams();
    }

    const onSubmit = async data => {
        const team = {
            ...data,
            teamName: data.teamName,
            allMembers: selectedFruits,
        }
        console.log(team)
        try {
            const result = await addTeam(team);
            alert("Task added to IndexedDB")
            resetField("teamName")
            resetField("allMembers")
            updateTeams()
            setSelectedFruits([])
            console.log('Team added to IndexedDB with ID:', result);
        } catch (error) {
            console.error('Error adding team to IndexedDB:', error);
        }

    }

    const fetchAllUsers = async () => {
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    };

    const fetchAllTeams = async () => {
        try {
            const teams = await getAllTeams();
            setTeams(teams);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const fetchAllTasks = async () => {
        try {
            const tasks = await getAllTasks();
            setTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchAllUsers();
        fetchAllTeams();
        fetchAllTasks();
    }, []);

    // console.log(tasks);

    const updateTasks = () => {
        fetchAllTeams();
    }

    const handleTaskChange = async (e, id) => {
        // console.log(id);
        const assignTask = e.target.value

        try {
            const result = await updateTeamTask(id, assignTask);
            alert("Task Updated to IndexedDB")
            updateTasks()
            console.log('Task Updated to IndexedDB with ID:', result);
        } catch (error) {
            console.error('Error Updated task to IndexedDB:', error);
        }
    };

    const onModelSubmit = async data => {
        console.log(data);
        const newData = {
            ...data,
            newAssignee: data.newAssignee,
            id: addMemberId
        }
        console.log(newData)

        try {
            const result = await addTeamAssignee(newData);
            resetField("newAssignee")
            alert("Task Updated to IndexedDB")
            updateTasks()
        } catch (error) {
            console.error('Error Updated task to IndexedDB:', error);
        }
    }

    const addMember = (Id) => {
        setAddMemberId(Id)
        // fetchAllUsers()
    }

    const handleDeleteTask = async (taskId) => {
        console.log(taskId);
        try {
            // await deleteTask(taskId);
            await deleteTeam(taskId);
            updateTeams();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className='row'>
                    <h4>Make Team</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="d-flex align-items-center mx-1">
                            <input type="text" className="form-control mb-3 border-0 border-bottom" {...register("teamName")} placeholder="Team Name" />
                        </div>

                        <div className='d-flex justify-content-center'>
                            <select {...register("allMembers")} className='form-control me-3' value={selectedFruit} onChange={handleFruitChange}>
                                <option value="">Select a Member</option>
                                {users?.map((user, index) => (
                                    <option key={index} value={user?.email}>
                                        {user?.email}
                                    </option>
                                ))}
                            </select>
                            <button className='btn  btn-primary' type="button" onClick={handleAddFruit}>
                                Select Member
                            </button>
                        </div>
                        <br />



                        <p>Selected Members:</p>
                        <ul>
                            {selectedFruits.map((fruit, index) => (
                                <li key={index}>{fruit}</li>
                            ))}
                        </ul>

                        <input type="submit" data-bs-dismiss="modal" className="btn btn-primary" />
                    </form>

                    <h4 className='mt-5'>All Teams</h4>
                    <table className="table table-responsive text-center">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Team Name</th>
                                <th scope="col">Team Members</th>
                                <th scope="col">Task Assign</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams?.map((team) => {
                                return (
                                    <tr className='align-items-center' key={Math.random()}>
                                        <th scope="row">{team.teams}</th>
                                        <td>{team?.teamName}</td>
                                        <td>
                                            {team?.allMembers?.map((item) => <p key={Math.random()}>{item}</p>)}

                                            <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className='btn btn-sm btn-info mt-3' onClick={() => addMember(team?.teams)}>More Assigned</button>
                                        </td>
                                        <td>
                                            {team?.selectedTask}
                                            {!team?.selectedTask && <select className='form-control' value={tasks.title} onChange={(e) => handleTaskChange(e, team.teams)}>
                                                <option value="">Select a Task</option>
                                                {tasks?.map((task) => (
                                                    <option key={task.id} value={task.title}>
                                                        {task.title}
                                                    </option>
                                                ))}
                                            </select>}
                                        </td>

                                        <td>
                                            <button className='btn btn-sm btn-danger' onClick={() => handleDeleteTask(team.teams)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
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
                            <form onSubmit={handleSubmit(onModelSubmit)}>
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

export default MakeTeam;
