import React, { useEffect, useState } from 'react';
import Navbar from '../shared/navbar';
import { useForm } from "react-hook-form";
import { addTeam, getAllTeams, getAllUsers } from '../authentication/IndexedDB';



const MakeTeam = () => {
    const [selectedFruits, setSelectedFruits] = useState([]);
    const [selectedFruit, setSelectedFruit] = useState("");
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);

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

    useEffect(() => {
        fetchAllUsers();
        fetchAllTeams();
    }, []);

    // console.log(teams);

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

                        <input type="submit" data-bs-dismiss="modal" className="btn btn-primary" />


                        <p>Selected Members:</p>
                        <ul>
                            {selectedFruits.map((fruit, index) => (
                                <li key={index}>{fruit}</li>
                            ))}
                        </ul>
                    </form>

                    <h4 className='mt-5'>All Teams</h4>
                    <table className="table table-responsive text-center">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Team Name</th>
                                <th scope="col">Team Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams?.map((team) => {
                                return (
                                    <tr className='align-items-center' key={Math.random()}>
                                        <th scope="row">{team.teams}</th>
                                        <td>{team?.teamName}</td>
                                        <td>{team?.allMembers?.map((item) => <p key={Math.random()}>{item}</p>)}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MakeTeam;
