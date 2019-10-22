/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBModalFooter
} from 'mdbreact';
import * as actions from '../../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.props.logout();
    this.state = {
      email: '',
      password: ''
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onChangeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.value);
  }

  onSubmitHandler(e) {
    e.preventDefault();
    console.log(this.state);
    const { email, password } = this.state;
    this.props.login(email, password);
  }

  render() {
    const { user } = this.props.loggingIn;
    const alertID = user ? '' : 'hidden';
    let message = '';
    if (user) {
      message = user.message;
    }

    return (
      <div className="centered">
        <form onSubmit={this.onSubmitHandler}>
          <MDBContainer>
            <MDBRow className="justify-content-center">
              <MDBCol md="4.5">
                <MDBCard>
                  <MDBCardBody className="mx-4">
                    <div className="text-center">
                      <h3 className="dark-grey-text mb-5">
                        <strong>Sign in</strong>
                      </h3>
                    </div>
                    <MDBInput
                      label="Your email"
                      group
                      type="email"
                      validate
                      error="wrong"
                      success="right"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChangeHandler}
                    />
                    <MDBInput
                      label="Your password"
                      group
                      type="password"
                      validate
                      containerClass="mb-0"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChangeHandler}
                    />
                    <p className="font-small blue-text d-flex justify-content-end pb-3">
                      <a href="#!" className="blue-text ml-1">
                        Forgot Password?
                      </a>
                    </p>
                    <div id={alertID} className="danger-alert">
                      {message}
                    </div>
                    <div className="text-center mb-3">
                      <MDBBtn
                        type="submit"
                        gradient="blue"
                        rounded
                        className="btn-block z-depth-1a rounded-button"
                      >
                        Sign in
                      </MDBBtn>
                    </div>

                    <p className="font-small dark-grey-text text-right d-flex justify-content-center mb-3 pt-2">
                      or Sign in with:
                    </p>
                    <div className="row my-3 d-flex justify-content-center">
                      <MDBBtn
                        type="button"
                        color="white"
                        rounded
                        className="mr-md-3 z-depth-1a rounded-button"
                      >
                        <MDBIcon
                          fab
                          icon="facebook-f"
                          className="blue-text text-center"
                        />
                      </MDBBtn>
                      <MDBBtn
                        type="button"
                        color="white"
                        rounded
                        className="mr-md-3 z-depth-1a rounded-button"
                      >
                        <MDBIcon fab icon="twitter" className="blue-text" />
                      </MDBBtn>
                      <MDBBtn
                        type="button"
                        color="white"
                        rounded
                        className="z-depth-1a rounded-button"
                      >
                        <MDBIcon
                          fab
                          icon="google-plus-g"
                          className="blue-text"
                        />
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                  <MDBModalFooter className="mx-5 pt-3 mb-1">
                    <p className="font-small grey-text d-flex justify-content-end">
                      Not a member?
                      <a href="#!" className="blue-text ml-1">
                        Sign Up
                      </a>
                    </p>
                  </MDBModalFooter>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    history: state.history,
    step: state.step,
    loggingIn: state.authentication
  };
};

const mapActionToProps = {
  login: actions.loginUser,
  logout: actions.logoutUser
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(Login);
