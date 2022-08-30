import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const getRandomIndex = () => parseInt(Math.random() * anecdotes.length);
  
  const [selected, setSelected] = useState(getRandomIndex())
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const onClickNext = () => setSelected(getRandomIndex())
  const onClickVote = () => {
    const votes_copy = [...votes];
    votes_copy[selected] += 1;
    setVotes(votes_copy);
  }

  const current_votes = votes[selected]
  
  // find index of max element
  const max_index = votes.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br/>
      <p>has {current_votes} votes</p>
      <button onClick={onClickVote}>vote</button>
      <button onClick={onClickNext}>next anecdote</button>
      <br/>
      <h1>Anecdote with most votes</h1>
      {anecdotes[max_index]}
      <p>has {votes[max_index]} votes</p>
    </div>
  )
}

export default App