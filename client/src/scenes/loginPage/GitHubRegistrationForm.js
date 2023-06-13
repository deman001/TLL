import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/actions";

const GitHubRegistrationForm = () => {
    const { userId, firstName, lastName, email } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Set up state for form values
    const [formValues, setFormValues] = React.useState({
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Dispatch the registerUser action with the form values
        dispatch(registerUser(formValues));

        // Redirect to the home page
        navigate("/home");
    };

    return (
        <Box mt={2}>
            <Typography variant="h4" align="center">
                Complete Your Registration
            </Typography>
            <form onSubmit={handleFormSubmit}>
                <TextField
                    name="firstName"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formValues.firstName}
                    onChange={handleInputChange}
                />
                <TextField
                    name="lastName"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formValues.lastName}
                    onChange={handleInputChange}
                />
                <TextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formValues.email}
                    onChange={handleInputChange}
                />
                <TextField
                    name="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                >
                    Register
                </Button>
            </form>
        </Box>
    );
};

export default GitHubRegistrationForm;
