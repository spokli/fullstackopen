const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  const parts = props.parts;
  // map over an array of dictionaries
  return parts.map(listitem => <Part key={listitem.name} name={listitem.name} exercises={listitem.exercises} />);
}

const Part = (props) => {
  const name = props.name;
  const exercises = props.exercises;
  return (
    <p> {name} {exercises} </p>
  )
}

const Total = (props) => {
  const parts = props.parts;
  // sum over an attribute in a dictionary
  const total_number_exercises = parts.reduce((acc, curr) => {
    return acc + curr.exercises
  }, 0)
  return (
    <p>Number of exercises: {total_number_exercises}</p>
  )
}

export default App