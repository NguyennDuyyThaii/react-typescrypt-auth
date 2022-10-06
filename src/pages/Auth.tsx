import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { MDBInput } from "mdb-react-ui-kit";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../services/authApi";
import { toast } from "react-toastify";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../features/authSlice";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const Auth = () => {
  const [formValue, setFormValue] = useState(initialState);

  const { firstName, lastName, email, password, confirmPassword } = formValue;
  const [showRegister, setShowRegister] = useState(false);
  const [
    LoginUser,
    {
      data: loginData,
      isSuccess: isLoginSuccess,
      isError: isLoginError,
      error: loginError,
    },
  ] = useLoginUserMutation();

  const [
    RegisterUser,
    {
      data: registerData,
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
      error: registerError,
    },
  ] = useRegisterUserMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleChange = (e: any) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (email && password) {
      await LoginUser({ email, password });
    } else {
      toast.error("Please fill all input field");
    }
  };

  useEffect(() => {
    if (isLoginSuccess) {
      toast.success("User Login Successfully");
      dispatch(
        setUser({ token: loginData.token, name: loginData.result.name })
      );
      navigate("/dashboard");
    }

    if (isRegisterSuccess) {
        toast.success("User Register Successfully");
        dispatch(
          setUser({ token: registerData.token, name: registerData.result.name })
        );
        navigate("/dashboard");
      }
  }, [isLoginSuccess, isRegisterSuccess]);

  const handleLogout = async () => {
    if(password !== confirmPassword){
        return toast.error(`Password don't match`)
    }
    
    if(firstName && lastName && password && email){
        await RegisterUser({email, password, firstName, lastName})
    }
  }

  useEffect(() => {
    if(isLoginError){
        toast.error((isLoginError as any).data.message)
    }

    if(isRegisterError){
        toast.error((isRegisterError as any).data.message)
    }
  }, [isLoginError, isRegisterError])
  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-4 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-8 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-4 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">
                    {!showRegister ? "Login" : "Register"}
                  </h2>

                  <p className="p text-white-50 mb-4">
                    {!showRegister
                      ? "Please enter your Email & Password"
                      : "Please enter User detail"}
                  </p>
                  {showRegister && (
                    <>
                      <div className="form-outline form-white mb-4">
                        <MDBInput
                          type="text"
                          name="firstName"
                          value={firstName}
                          onChange={handleChange}
                          label="First Name"
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div className="form-outline form-white mb-4">
                        <MDBInput
                          type="text"
                          name="lastName"
                          value={lastName}
                          onChange={handleChange}
                          label="Last Name"
                          className="form-control form-control-lg"
                        />
                      </div>
                    </>
                  )}
                  <div className="form-outline form-white mb-4">
                    <MDBInput
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      label="Email"
                      className="form-control form-control-lg"
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <MDBInput
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      label="Password"
                      className="form-control form-control-lg"
                    />
                  </div>

                  {showRegister && (
                    <>
                      <div className="form-outline form-white mb-4">
                        <MDBInput
                          type="password"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={handleChange}
                          label="Confirm Password"
                          className="form-control form-control-lg"
                        />
                      </div>
                    </>
                  )}

                  {!showRegister ? (
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      onClick={() => handleLogin()}
                    >
                      Login
                    </button>
                  ) : (
                    <button className="btn btn-outline-light btn-lg px-5"
                        onClick={() => handleLogout()}
                    >
                      Register
                    </button>
                  )}
                  <div className="mt-5">
                    <div>
                      <h5 className="mb-2">
                        {!showRegister ? (
                          <>
                            Don't have an account ?
                            <p
                              className="text-white-50 fw-bold"
                              style={{ cursor: "pointer" }}
                              onClick={() => setShowRegister(true)}
                            >
                              Sign Up
                            </p>
                          </>
                        ) : (
                          <>
                            Already have an account ?
                            <p
                              className="text-white-50 fw-bold"
                              style={{ cursor: "pointer" }}
                              onClick={() => setShowRegister(false)}
                            >
                              Sign In
                            </p>
                          </>
                        )}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
