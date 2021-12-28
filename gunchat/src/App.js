import React, { useEffect, useState, useReducer } from 'react'

import Gun from 'gun'
import Sea from 'gun'

const gun = Gun({
    peers: [
        'http://localhost:3030/gun'
    ]
})

const initialState = {
    messages: []
}

function reducer(state, message) {
    return{
        messages: [message, ...state.messages]
    }
}

const Messages = (props) => {

    const [formState, setForm] = useState({
        userName: props.uName, userId: props.uId, userDisplayName: props.uDisplayName, userLogo: props.uLogo, message: ''
    })

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        const messages = gun.get('messages')
        messages.map().once(m => {
          dispatch({
            name: m.name,
            message: m.message,
            createdAt: m.createdAt
          })
        })
      }, [])
    
      function saveMessage() {
        const messages = gun.get('messages')
        messages.set({
          userName: formState.userName,
          userId: formState.userId,
          userDisplayName: formState.userDisplayName,
          userLogo: formState.userLogo,
          message: formState.message,
          createdAt: Date.now()
        })
        setForm({
          userName: props.uName, userId: props.uId, userDisplayName: props.uDisplayName, userLogo: props.uLogo, message: ''
        })
      }
    

    function onChange(e) {
        setForm({ ...formState, [e.target.name]: e.target.value })
    }



    return (
        <>
            <div style={{ padding: 30 }}>
                <input
            onChange={onChange}
            placeholder="Message"
            name="message"
            value={formState.message}
        />
        <button onClick={saveMessage}>Send Message</button>
        {
            state.messages.map(message => (
            <div key={message.createdAt}>
                <h2>{message.message}</h2>
                <h3>From: {message.userName}</h3>
                <h3>{message.userDisplayName}</h3>
                <p>Date: {message.createdAt}</p>
                <p>Id: {message.userId}</p>
                <p>Logo: {message.userLogo}</p>
                <br />
                <br />
            </div>
            ))
        }
        </div>
        </>
    );
}

const App = () => {

  const [id, setId] = useState();
  const [uName, setUserName] = useState("");
  const [uDisplayName, setUserDisplayName] = useState("");
  const [uLogo, setUserLogo] = useState();

  function clickHandler(){
    
  }

  return(
    <>
      Enter Values Below:<br />
      <input placeholder='id(int)' onChange={e => {setId(e.target.value);}} /><br />
      <input placeholder='user name' onChange={e => {setUserName(e.target.value);}} /> <br />
      <input placeholder='user display name' onChange={e => {setUserDisplayName(e.target.value);}} /><br />
      <input placeholder='user logo (image url)' onChange={e => {setUserLogo(e.target.value);}} /><br />
      <Messages uName={uName} uId={id} uDisplayName={uDisplayName} uLogo={uLogo} />
    </>
  )
}

export default App;
