import React, { useState, useEffect } from 'react';
import '../../scss/app.scss';

let socket;
/* ------------ currentRoom needs to be updated to a string of both users names-------------*/

/* ------------ then in theory, each user would have a DB storage of all rooms -------------*/

const Chat = ({ currentRoom, userEmail }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  // const [room, setRoom] = useState('')
  const ENDPOINT = 'localhost:4000';
  const name = userEmail; // should change this to userFirstName
  const room = currentRoom; // default rooom passed down from App, all others from Messages

  useEffect(() => {
    // const name = props.userEmail;
    socket = io(ENDPOINT);
    console.log('newROOM joined');
    // upon connection to socket.io, emit 'join' event to server
    socket.emit('join', { name, room }, ({ error }) => {
      console.log('error');
    });
    // on disconnectioning from socket or leaving the current room
    return () => {
      socket.emit('disconnect'); // emit 'disconnect' event
      socket.off(); // turn socket off
      // clear messages in state - had to do this to force the app to clear the messages displays
      setMessages([]);
    };
  }, [ENDPOINT, currentRoom]);

  useEffect(() => {
    // listen for 'message' event from server
    socket.on('message', (message) => {
      console.log('message received on client', message);
      // update messages state
      setMessages([...messages, message]); // *message is an object with 'user' and 'text' props
    });
  }, [messages]);

  const sendMessage = (event) => {
    // onClick event of 'Send Message' button
    event.preventDefault();
    console.log('message in sendmsg', message);
    socket.emit('sendMessage', message, () => setMessage(''));
  };

  // track text input in state
  const handleChange = (e) => setMessage(e.target.value);

  return (
    <div className="container chatContainer">
      <div className="row chatRow" style={{ height: '45vh', width: '100%' }} />
      {messages.map((message, index) => {
        console.log('message.name:', message.user);
        console.log('name', name);

        // if you are the sender, render your message
        if (message.user === name) {
          return (
            <div
              key={index}
              className="row"
              style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', margin: '0px' }}
            >
              <p>{message.text}</p>
            </div>
          );
        }
        // if someone else is the sender, render their message
        return (
          <div
            key={index}
            className="row"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              backgroundColor: 'whitesmoke',
              margin: '0px',
            }}
          >
            <p>{message.text}</p>
          </div>
        );
      })}

      <form>
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1" />
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={message}
            onChange={handleChange}
          />
        </div>
        <button
          className="btn btn-primary w-100 appButton loginAndSignUpBtn"
          type="submit"
          onClick={sendMessage}
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Chat;
