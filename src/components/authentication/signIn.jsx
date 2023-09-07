import React from 'react';
// import Navbar from '../../Shared/Navbar/Navbar';
import { useForm } from "react-hook-form";
import styles from './authStyle.module.css'
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';


const SignIn = () => {
    const { signIn, sentErrorMessage } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        // console.log(data)
        signIn(data.email, data.password)
    }

    const navigate = useNavigate()
    const handleSignUp = () => {
        navigate('/signup')
    }

    return (
        <>
            {/* <Navbar /> */}
            <div className={styles.loginWrapper}>
                <div className="container">
                    <div className="row mx-3 d-flex justify-content-center">
                        <div className="col-md-5 card pb-4 shadow my-auto">
                            <div className={styles.signInText}>
                                <h4>Sign-In</h4>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="d-flex align-items-center mx-1">
                                    <input className="form-control mb-3 border-0 border-bottom" placeholder="E-Mail" {...register("email", { required: true })} />
                                    {errors.email && <span className="text-danger">*Email field is required</span>}
                                </div>

                                <div className="d-flex align-items-center mx-1">
                                    <input className="form-control mb-3 border-0 border-bottom" placeholder="Password" {...register("password", { required: true })} />
                                    {errors.password && <span className="text-danger">*Email field is required</span>}
                                </div>

                                <div className="d-flex justify-content-center">
                                    <input type="submit" className={styles.signInBtn} />
                                </div>


                            </form>
                            <p onClick={() => handleSignUp()} className={styles.notRegistered}>*Not Register! <u className="text-primary">Sign-Up</u> </p>

                        </div>


                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;