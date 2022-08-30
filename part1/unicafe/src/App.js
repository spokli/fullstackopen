import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good+1);
  const increaseNeutral = () => setNeutral(neutral+1);
  const increaseBad = () => setBad(bad+1);

  return (
    <div>
      <Buttons onClickGood={increaseGood} onClickNeutral={increaseNeutral} onClickBad={increaseBad} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Buttons = (props) => {
  return (
    <>
      <h1>give feedback</h1>
      <Button text="good" onClick={props.onClickGood} />
      <Button text="neutral" onClick={props.onClickNeutral} />
      <Button text="bad" onClick={props.onClickBad} />
    </>
  )
}

const StatisticLine = (props) => {
  const text = props.text;
  const value = props.value;
  return (
    <p>{text} {value}</p>
  )
}

const Statistics = (props) => {
  const good = props.good;
  const neutral = props.neutral;
  const bad = props.bad;
  const all = good + neutral + bad;
  const average = all ? (good - bad) / all : 0;
  const positive = all ? good / all : 0;

  if (!all) {
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    )
  }
  
  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <tr><td><StatisticLine text="good" value={good} /></td></tr>
          <tr><td><StatisticLine text="neutral" value={neutral} /></td></tr>
          <tr><td><StatisticLine text="bad" value={bad} /></td></tr>
          <tr><td><StatisticLine text="all" value={all} /></td></tr>
          <tr><td><StatisticLine text="average" value={average} /></td></tr>
          <tr><td><StatisticLine text="positive" value={positive} /></td></tr>
        </tbody>
      </table>
    </>
  )
}

export default App