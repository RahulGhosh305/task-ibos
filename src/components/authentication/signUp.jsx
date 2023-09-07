import React, { useState } from 'react';
// import Navbar from '../../Shared/Navbar/Navbar';
import { useForm } from "react-hook-form";
import styles from './authStyle.module.css'
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import axios from 'axios';

const SignUp = () => {
    const { Register, sentErrorMessage } = useAuth()
    const [errorMessage, setErrorMessage] = useState("")
    const [imageURL, setImageURl] = useState(null);

    const { register, resetField, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            bio: "",
            password: "",
            retypePassword: ""
        }
    });
    const onSubmit = data => {
        //* Password validation (Basic)
        if (data.password.length && data.retypePassword.length < 6) {
            clearInputField()
            setErrorMessage("Password must be at least 6 characters.")
            return
        }
        if (data.password !== data.retypePassword) {
            clearInputField()
            setErrorMessage("Password not match");
            return
        }
        // console.log(data)
        Register(data.name, data.email, data.bio, data.password, imageURL)
        clearInputField()
        setErrorMessage("")
    }

    //* Input Field Clear
    const clearInputField = () => {
        resetField("name")
        resetField("email")
        resetField("bio")
        resetField("password")
        resetField("retypePassword")
    }

    const navigate = useNavigate()
    const handleSignIn = () => {
        navigate('/signin')
    }


    const handleImageUpload = async (event) => {
        try {
            // console.log(event.target.files[0]);
            const imageData = new FormData();
            imageData.set('key', 'a246b045a78484bd307e45fbf7eb0ee7');
            imageData.append('image', event.target.files[0]);

            const response = await axios.post('https://api.imgbb.com/1/upload', imageData);
            // Handle the response data here
            if (response) {
                setImageURl(response.data.data.display_url);
            }
            // console.log(response.data.data.display_url);
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <>
            {/* <Navbar /> */}
            <div className={styles.signUpWrapper}>
                <div className="container">
                    <div className="row mx-3 d-flex justify-content-center">
                        <div className="col-md-5 card pb-4 mb-3 shadow my-auto">
                            <div className={styles.signUpText}>
                                <h4>Sign-Up</h4>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="d-flex align-items-center mx-1 mb-3">
                                    <input onChange={handleImageUpload} type='file' />
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <input type="text" className="form-control mb-3 border-0 border-bottom" placeholder="Name" {...register("name", { required: true })} />
                                    {/* {errors.name && <span className="text-danger">*Name field is required</span>} */}
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <input type="email" className="form-control mb-3 border-0 border-bottom" placeholder="E-Mail" {...register("email", { required: true })} />
                                    {/* {errors.email && <span className="text-danger">*Email field is required</span>} */}
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <input type="text" className="form-control mb-3 border-0 border-bottom" placeholder="Bio" {...register("bio", { required: true })} />
                                    {/* {errors.bio && <span className="text-danger">*Name field is required</span>} */}
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <input type="password" className="form-control mb-3 border-0 border-bottom" placeholder="Password more than 6 character" {...register("password", { required: true })} />
                                    {/* {errors.password && <span className="text-danger">*Email field is required</span>} */}
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <input type="password" className="form-control mb-3 border-0 border-bottom" placeholder="Re-type Password" {...register("retypePassword", { required: true })} />
                                    {/* {errors.retypePassword && <span className="text-danger">*Email field is required</span>} */}
                                </div>

                                <div className="d-flex justify-content-center">
                                    <input type="submit" className={styles.signUpBtn} />
                                </div>

                                <div className="mt-2 text-danger text-center">{errorMessage}</div>
                                {/* <div className="mt-2 text-center text-danger">{sentErrorMessage()}</div> */}

                            </form>
                            <p onClick={() => handleSignIn()} className={styles.registered}>*Already Registered! <u className="text-primary">Sign-In</u> </p>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;