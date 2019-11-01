/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { MDBCard, MDBCardBody, MDBListGroup, MDBBtn } from 'mdbreact';

let socket;

class Chatbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: ''
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  componentDidMount = () => {
    this.scrollToBottom();
    socket = this.props.socket;
    socket.on('message', message => {
      const { messages } = this.state;
      this.setState({
        messages: messages.concat(message)
      });
    });
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  onChangeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  sendMessage() {
    if (this.state.message !== '') {
      socket.emit(
        'sendMessage',
        {
          message: this.state.message
        },
        () => {
          this.setState({ message: '' });
        }
      );
    }
  }

  render() {
    return (
      <MDBCard>
        <div className="scrollable-chat">
          <MDBListGroup className="list-unstyled pl-3 pr-3">
            {this.state.messages.map(message => {
              let className =
                'anchor message-box d-flex text-left justify-content-start';
              if (message.email === this.props.currentUser.email) {
                className =
                  'anchor message-box d-flex text-left justify-content-end';
              }
              return (
                <div className={className} key={message}>
                  <ChatMessage
                    message={message}
                    currentUser={this.props.currentUser}
                  />
                </div>
              );
            })}
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={el => {
                this.messagesEnd = el;
              }}
            />
          </MDBListGroup>
        </div>
        <div className=" basic-textarea">
          <textarea
            className="chat-text form-control"
            id=""
            rows="2"
            placeholder="Type your message here..."
            name="message"
            required
            value={this.state.message}
            onChange={this.onChangeHandler}
          />
          <MDBBtn
            size="sm"
            onClick={() => this.sendMessage()}
            className="rounded-button float-right"
          >
            Send
          </MDBBtn>
        </div>
      </MDBCard>
    );
  }
}

const ChatMessage = ({ message: { user, email, message }, currentUser }) => {
  let color = 'rounded-card';
  if (user === 'admin') {
    color = 'system-box text-white rounded-card';
  } else if (email !== currentUser.email) {
    color = 'opponent-box lighten-3 text-white rounded-card';
  }
  return (
    <li className="chat-message d-flex mb-2">
      <MDBCard className={color}>
        <MDBCardBody>
          <div>
            <p className="mb-0 chat-text">{message}</p>
          </div>
        </MDBCardBody>
      </MDBCard>
    </li>
  );
};

export default Chatbox;
