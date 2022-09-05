const Course = (props) => {
    const course = props.course;
    console.log(course);

    return (
        <>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}

const Header = (props) => {
    return (
        <h2>{props.name}</h2>
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
        <p style={{fontWeight: 'bold'}}>total of {total_number_exercises} exercises</p>
    )
}

export default Course;