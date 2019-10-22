/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBModalFooter
} from 'mdbreact';
import * as actions from '../../actions';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '',
        email: '',
        password: ''
      }
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onChangeHandler(e) {
    const { name, value } = e.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  }

  onSubmitHandler(e) {
    e.preventDefault();
    console.log(this.state);
    const { user } = this.state;

    this.props.register(user);
  }

  render() {
    const { user } = this.props.registration;
    const alertID = user ? '' : 'hidden';
    let message = '';
    if (user) {
      message = user;
    }

    return (
      <div className="centered">
        <form onSubmit={this.onSubmitHandler}>
          <MDBContainer>
            <MDBRow className="justify-content-center">
              <MDBCol md="4">
                <MDBCard>
                  <MDBCardBody className="mx-4">
                    <div className="text-center">
                      <h3 className="dark-grey-text mb-5">
                        <strong>Register</strong>
                      </h3>
                    </div>
                    <MDBInput
                      label="Your name"
                      group
                      type="text"
                      name="name"
                      validate
                      value={this.state.name}
                      onChange={this.onChangeHandler}
                    />
                    <MDBInput
                      label="Your email"
                      group
                      type="email"
                      validate
                      error="wrong"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChangeHandler}
                    />
                    <MDBInput
                      label="Your password"
                      group
                      type="password"
                      validate
                      name="password"
                      containerClass="mb-0"
                      value={this.state.password}
                      onChange={this.onChangeHandler}
                    />
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
                        Sign up
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                  <MDBModalFooter className="mx-5 pt-3 mb-1">
                    <Link to="/">
                      <p className="font-small d-flex justify-content-end blue-text ml-1">
                        Back to Game
                      </p>
                    </Link>
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
    loggingIn: state.authentication,
    registration: state.registration
  };
};

const mapActionToProps = {
  register: actions.registerUser,
  logout: actions.logoutUser
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(Register);
