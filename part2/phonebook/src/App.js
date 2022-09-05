import { useState, useEffect } from 'react'
import personService from './services/persons'
import './App.css'


const App = () => {
  const [persons, setPersons] = useState([])
  const [filterString, setFilterString] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll()
      .then(response => {
        console.log("promise fulfilled")
        setPersons(response);
      })
      .then(() => {
        setNotification({message: "Data fetched from server.", type: "success"})
        setTimeout(() => {setNotification(null)}, 2000)
      })
      .catch(error => {
        setNotification({message: error.message, type: "error"})
        setTimeout(() => {setNotification(null)}, 5000)
      })
  }, []);

  const onFilterChanged = (event) => {
    setFilterString(event.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <h2>filter entries</h2>
      <Filter onFilterChanged={onFilterChanged} />
      <h2>new entry</h2>
      <InputForm persons={persons} setPersons={setPersons} setNotification={setNotification} />
      <h2>Numbers</h2>
      <div>
        <PersonList persons={persons} setPersons={setPersons} filterString={filterString} setNotification={setNotification}/>
      </div>
    </div>
  )
}

const PersonList = (props) => {
  const persons = props.persons;
  const setPersons = props.setPersons;
  const filterString = props.filterString;
  const setNotification = props.setNotification;

  const isPartOf = (query, string) => {
    const regex = new RegExp(query, 'i');
    return regex.test(string);
  }

  const onDeletePerson = (personId, personName) => {
    if (window.confirm(`Really delete ${personName}?`)) {
      personService.deletePerson(personId)
        .then(response => setPersons(persons.filter(person => person.id !== personId)))
        .then(() => {
          setNotification({message: "Person deleted.", type: "success"})
          setTimeout(() => {setNotification(null)}, 2000)
        })
        .catch(error => {
          setNotification({message: error.message, type: "error"})
          setTimeout(() => {setNotification(null)}, 5000)
        })
    }
  }

  return persons.filter(person => isPartOf(filterString, person.name) | isPartOf(filterString, person.number))
    .map(person => <Person key={person.id} personObj={person} onDelete={() => onDeletePerson(person.id, person.name)} />);
}

const InputForm = (props) => {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const persons = props.persons;
  const setPersons = props.setPersons;
  const setNotification = props.setNotification;

  const onNameChanged = (event) => {
    setNewName(event.target.value);
  }

  const onNumberChanged = (event) => {
    setNewNumber(event.target.value);
  }

  const onSubmit = (event) => {
    event.preventDefault();

    // const newId = Math.max(...persons.map(person => person.id)) + 1;

    if (newName === "") {
      alert("name must not be empty");
      return;
    }
    if (newNumber === "") {
      alert("number must not be empty");
      return;
    }

    // Check if value exists for an object attribute in a object list
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook. Change number?`)){
        personService.updatePerson(existingPerson.id, {...existingPerson, number: newNumber})
          .then(updatedPerson => setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson)))
          .then(() => {
            setNotification({message: "Person updated.", type: "success"})
            setTimeout(() => {setNotification(null)}, 2000)
          })
          .catch(error => {
            if (error.response.status === 404) {
              setNotification({message: "Person was deleted by other user", type: "error"})
            } else {
              setNotification({message: error.message, type: "error"})
            }
            setTimeout(() => {setNotification(null)}, 5000)
          });
      }
    }
    else {
      // post new person to json server
      const newPerson = { name: newName, number: newNumber }
      personService.createPerson(newPerson)
        .then(newPerson => {
          console.log(persons.concat(newPerson));
          setPersons(persons.concat(newPerson));
          setNewName('');
          setNewNumber('');
        })
        .then(() => {
          setNotification({message: "Person created.", type: "success"})
          setTimeout(() => {setNotification(null)}, 2000)
        })
        .catch(error => {
          setNotification({message: error.message, type: "error"})
          setTimeout(() => {setNotification(null)}, 5000)
        });
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={onNameChanged} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChanged} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = (props) => {
  const person = props.personObj;
  const onDelete = props.onDelete;
  return (
    <div>
      {person.name} {person.number}
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

const Filter = (props) => {
  const onFilterChanged = props.onFilterChanged;

  return (
    <div>
      filter shown with <input onChange={onFilterChanged} />
    </div>
  );
}

const Notification = (props) => {
  const notification = props.notification;
  if (notification === null) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

export default App