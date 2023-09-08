import React from 'react';
import styles from './aboutStyle.module.css'
import useAuth from '../authentication/useAuth';
import img from "../../assets/hairChange.png"
import Navbar from '../shared/navbar';

const About = () => {
    const { isLoggedIn } = useAuth()

    const { name, bio, email, imageURL } = isLoggedIn
    return (
        <div>
            <Navbar />
            <div className={styles.cardWrapper}>
                <div className="container">
                    <div className="row mx-3 d-flex justify-content-center">
                        <div className="col-md-5 card pb-4 shadow my-auto">
                            <div className='d-flex justify-content-center'>
                                <div className={`p-5 ${styles.circularImage}`}>
                                    <img src={imageURL} className={`card-img-top`} alt="Profile Image" />
                                    <p className='card-text text-center mt-3'>{bio}</p>
                                </div>
                            </div>
                            <div className="card-body">
                                <p className="card-text text-center">{name}</p>
                                <p className="card-text text-center">{email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;