/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
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
import browserHistory from '../../helpers/history';
import { storage } from '../../helpers/Firebase';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      image: '',
      imageFile: null
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onImageUpload = this.onImageUpload.bind(this);
  }

  componentWillMount() {
    const currentUser = this.props.loggingIn.user;
    if (currentUser && currentUser.token) {
      // if (currentUser.user.token) {
      this.setState({
        name: currentUser.user.name,
        email: currentUser.user.email,
        image: currentUser.user.image
      });
    } else {
      browserHistory.push('/');
    }
  }

  onChangeHandler(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  onImageUpload(e) {
    if (e.target.files[0]) {
      const imageFile = e.target.files[0];
      this.setState({ imageFile });
    }
  }

  onSubmitHandler(e) {
    e.preventDefault();
    const { name, email, password } = this.state;
    let { image } = this.state;
    if (image === '') {
      image = 'https://image.flaticon.com/icons/svg/206/206879.svg';
      this.setState({ image });
    }

    this.props.requestUser();

    const { imageFile } = this.state;
    if (imageFile) {
      const uploadImage = storage
        .ref(`images/${imageFile.name}`)
        .put(imageFile);
      uploadImage.on(
        'state_changed',
        () => {
          // console.log(snapshot);
        },
        error => {
          console.log(error);
        },
        async () => {
          const imageURL = await storage
            .ref('images')
            .child(imageFile.name)
            .getDownloadURL();

          this.setState({ image: imageURL });
          this.props.updateUser({ name, email, password, image: imageURL });
        }
      );
    } else {
      this.props.updateUser({ name, email, password, image });
    }
  }

  render() {
    const { loading } = this.props.updating;
    const { user } = this.props.updating;
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
                <LoadingOverlay
                  active={loading}
                  spinner
                  text="Loading..."
                  styles={{
                    overlay: base => ({
                      ...base,
                      background: 'rgba(255, 255, 255, 0.5)',
                      color: 'black'
                    }),
                    spinner: base => ({
                      ...base,
                      width: '100px',
                      '& svg circle': {
                        stroke: 'rgba(255, 0, 0, 0.5)'
                      }
                    })
                  }}
                >
                  <MDBCard>
                    <MDBCardBody className="mx-4">
                      <div className="text-center">
                        <h3 className="dark-grey-text mb-5">
                          <strong>Update Profile</strong>
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
                      <MDBInput
                        label="Your image URL"
                        group
                        type="text"
                        name="image"
                        value={this.state.image}
                        onChange={this.onChangeHandler}
                      />
                      <div>Or choose a file</div>
                      <div className="mt-2 mb-4">
                        <input
                          group
                          type="file"
                          validate
                          name="imageUploader"
                          onChange={this.onImageUpload}
                        />
                      </div>
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
                          Confirm
                        </MDBBtn>
                      </div>
                    </MDBCardBody>
                    <MDBModalFooter className="mx-5 pt-3 mb-1">
                      <Link to="/">
                        <button
                          type="button"
                          className="font-small d-flex justify-content-end blue-text ml-1"
                        >
                          Back to Game
                        </button>
                      </Link>
                    </MDBModalFooter>
                  </MDBCard>
                </LoadingOverlay>
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
    updating: state.userInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: user => {
      dispatch(actions.updateUser(user));
    },
    requestUser: () => {
      dispatch(actions.requestUser());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
