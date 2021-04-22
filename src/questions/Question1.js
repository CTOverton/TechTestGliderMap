import React, { useState, useEffect } from 'react';

export default function Question1 (props) {
  // Situation: The TestForm component was written by a junior developer who needs some help getting it to function.
  // Please modify the TestForm component such that it will correctly use hooks to validate and post to the endpoint.
  // Feel free to use any (or no) external libraries you feel appropriate.
  // Endpoint docs: https://jsonplaceholder.typicode.com/guide/

  const [state, setState] = useState({
    title: '',
    body: '',
    userId: 1337,
  })
  const [errormessage, setErrormessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setErrormessage(state.title.length === 0 ? "You need to enter a title!" : '')
  }, [state.title]);

  const handleSubmit = () => {
    console.log(JSON.stringify(state))

    if (errormessage === '') {
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'post',
        data: JSON.stringify(state),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
          .then(response => response.json())
          .then(json => console.log(json))
          .then(() => setSuccessMessage('Submitted!'))
    }
    else {
      setErrormessage('You need to enter a title before you can submit.')
    }
  }

  const handleInput = (e) => {
    setSuccessMessage('')
    const {name, value} = e.target
    setState({...state, [name]: value})
  }

  return (
    <div>
      <div>
        <div>
          Title:
        </div>
        <input name={'title'} onChange={handleInput}/>
      </div>

      <div>
        <div>
          Body:
        </div>
        <input name={'body'} onChange={handleInput}/>
      </div>

      <div>
        <div>
          UserId:
        </div>
        <select name={'userId'} onChange={handleInput}>
          <option>1337</option>
          <option>1234</option>
          <option>1066</option>
        </select>
      </div>

      <div>
        {errormessage}
      </div>

      <button onClick={handleSubmit} style={{margin: 10}}>Submit</button>

      <div>
        {successMessage}
      </div>
    </div>

  )
}
