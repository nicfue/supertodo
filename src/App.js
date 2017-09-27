import React, { Component } from 'react'
import firebase, { provider } from './firebase.js'
import { LoginFormEmail } from './components/LoginForm/LoginFormEmail'
import { LoginFormPassword } from './components/LoginForm/LoginFormPassword'


class App extends Component {
      state = {
        items: [],
        currentItem: '',
        username: '',
        password: ''
        }

      componentDidMount() {
          firebase.auth()
          .onAuthStateChanged((user) => {
            if(user) {
              this.setState({ user: user });
            }else{
              this.setState({ user: ''})
            }
          })


      firebase.database().ref('items').on('value', (itemSnap) => {
        let items = itemSnap.val();
        let newState = [];
        for (let item in items) {
          newState.push({
            id: item,
            title: items[item].title,
            user: items[item].user,
            completed: items[item].completed
          });
        }
        this.setState({
          items: newState,
          completed: this.state.completed || false
        });
      });
  }

    onSubmit = e => {
      e.preventDefault();
      firebase.auth()
        .createUserWithEmailAndPassword(this.state.username, this.state.password)
        .then(user => console.log("Created user", user))
        .catch(function(error) {
          var errorCode = error.code;
          if (errorCode === 'auth/invalid-email') {
            alert('Var god kontrollera epostadressen!');
          }else if (errorCode === 'auth/weak-password') {
            alert('Lösenordet måste innehålla minst 6 tecken');
          }else
            alert('Epostadressen är redan upptagen, ange ett nytt.');
            console.log(error);
        })
    };

    signIn = () => {
      firebase.auth()
        .signInWithEmailAndPassword(this.state.username, this.state.password)
        .then((result) => {
          const user = result.user;
          window.location.reload();
          this.setState({
            user
          })
        })
        .catch(error => console.log(error));
        this.setState({
          errorMessage: "Var god fyll i era uppggifter"
        })
    }

    login = () => {
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      window.location.reload();
      const user = result.user;
      this.setState({
        user
      });
    });
}

    logout = () => {
  firebase.auth().signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
}

signOut = () => {
  firebase.auth().signOut();
}

onChange = e => this.setState({ [e.target.name]: e.target.value });


handleChange =(e) => {
  this.setState({
    [e.target.name]: e.target.value
  });
}

  addTodo =(e) => {
      e.preventDefault();
        const item = {
          title: this.state.currentItem,
          user: this.state.user.displayName || this.state.user.email,
          completed: false
        }

        firebase.database().ref('items').push(item);
        console.log(item);
        this.setState({
          currentItem: '',
          username: '',
          errorMessage: ''
        });

        const user = {
          userId: this.state.user.uid
        }

        firebase.database().ref('user').push(user);
        console.log(user);
        this.setState({
          id: ''
        });
    }

handleEmptyTodo =(e) => {
  e.preventDefault()
  this.setState({
    errorMessage: "Snälla, skriv in en todo."
  })
}

handleEmptySubmit =(e) => {
  e.preventDefault()
  this.setState({
    errorMessage: "Var god fyll i era uppggifter"
  })
}

removeItem = (itemId) => {
  firebase.database().ref(`items/${itemId}`).remove();
}

toggleCompleted = (item) => {
  firebase.database().ref(`items/${item.id}/completed`)
    .set(!item.completed);
}

handleCompleted = (bool) => {
  this.setState({
    completed: bool
  })
}

render() {

const submitHandler = this.state.currentItem ? this.addTodo : this.handleEmptyTodo

  return (
    <div>
      <header>
      <div className='jumbotron'>
        <main className="text-center" id="loginForm">
          {this.state.user ? null
            :
            <a className="btn btn-primary m-3" onClick={this.login}>Logga in med Google-konto</a>
          }
          <form onSubmit={this.onSubmit}>
            <header>
              <h1>Välkommen! { this.state.user && this.state.user.email }</h1>
            </header>
            <LoginFormEmail
              value={this.state.username}
              onChange={this.onChange} />
            <LoginFormPassword
              value={this.state.password}
              onChange={this.onChange} />
          { !this.state.user && <button className="btn btn-primary" onClick={this.signIn}> Logga in </button> }
          { this.state.user && <button className="btn btn-secondary" onClick={this.signOut}> Logga ut </button> }
          <input type="submit" value="Registrera" className="btn btn-success m-3" />
        </form>
        </main>
      </div>
    </header>
      {this.state.user ?
        <div>
          <div className="container">
            <section className='add-item'>
              <form onSubmit={submitHandler}>
                {this.state.errorMessage && <span className="error">{this.state.errorMessage}</span>}
                  <input className="form-control input" type="text" name="username" value={this.state.user.displayName ||    this.state.user.email} onChange={this.handleChange}/>
                  <input className="form-control" type="text" name="currentItem" placeholder="Lägg till en todo" onChange={this.handleChange} value={this.state.currentItem}/>
                  <button className="btn btn-primary">Lägg till</button>
              </form>
                <br/>
                  <div className="active-done-btn">
                      <button className="btn btn-success" onClick={() => this.handleCompleted(false)}>Aktiva</button>
                      <button className="btn btn-success" onClick={() => this.handleCompleted(true)}>Klara</button>
                  </div>
            </section>
            </div>
            <div>
              <section className="wrapper">
               <div className="display-item">
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      item.completed === this.state.completed
                      ?<li key={item.id}>
                        <h2>{item.title}</h2>
                        <p>Todo av: {item.user}
                          {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                            <button className="btn btn-secondary" onClick={() => this.removeItem(item.id)}>Ta bort</button> : null}
                            <button className="btn btn-primary" onClick={() => { this.toggleCompleted(item)}}>
                            {item.completed === true ? "Ångra" : "Klar"} </button>
                        </p>
                      </li>
                      : null
                      )
                    })}
                </ul>
              </div>
            </section>
          </div>
          </div>
            :
            <div>
              <h3>Du måste vara inloggad för att kunna se listan med todos och kunna lägga till listan.</h3>
            </div>
            }
          </div>
        );
      }
}

export default App;
