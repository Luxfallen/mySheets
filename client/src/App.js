import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as helper from './helper.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page || '/login',
    }
    helper.getToken().then((token) => {
      this.setState({csrf: token,});
    });
    this.handleNav = this.handleNav.bind(this);
    this.render = this.render.bind(this);
  }

  handleComponentChange(e) {
    this.setState({page: window.page,});
  }

  handleNav(e) {
    // Async may forget 'e', so save it
    const { target } = e; // <= Object destructuring(?) same as target=e.target 
    
    // Gotta make a promise because it may take a bit to get the response back
    helper.getToken()
      .then((token) => {
        console.log(token);
        this.setState({
          page: target.getAttribute('data-dest'),
          csrf: token,
        }, () => console.log(this.state.csrf));
      });
  }

  componentDidMount(e) {
    window.addEventListener('page', this.handleComponentChange);
  }

  componentWillUnmount(e) {
    window.removeEventListener('page', this.handleComponentChange);
  }

  /** ADD:
   * Need conditional rendering in 'content'
   * Need conditional rendering of <nav>
   * How do we keep the user from trying to log in
   * if they're already logged in?
   * How do we redirect the page?!
   */

  render() {
    let toDisplay;
    switch (this.state.page) {
      case '/login':
        toDisplay = <Login csrf={this.state.csrf} />;
        break;
      case '/signup':
        toDisplay = <Signup csrf={this.state.csrf} />;
        break;
      case '/changePass':
        toDisplay = <ChangePass csrf={this.state.csrf} />;
        break;
      case '/app':
        toDisplay = <CharacterSheet csrf={this.state.csrf} />
        break;
      case '/calc': 
        toDisplay = <EncounterCalc />
        break;
      case '/donate':
        toDisplay = <Donate />
        break;
      default:
        toDisplay = <Login csrf={this.state.csrf} />;
        break;
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">mySheets</h1>
          <nav>
            <div className="navlink" onClick={this.handleNav} data-dest="/login">Login</div>
            <div className="navlink" onClick={this.handleNav} data-dest="/signup">Sign Up</div>
            <div className="navlink" onClick={this.handleNav} data-dest="/changePass">Change Password</div>
            <div className="navlink" onClick={this.handleNav} data-dest="#">Character "Sheets"</div>
            <div className="navlink" onClick={this.handleNav} data-dest="#">Encalculator</div>
            <div className="navlink" onClick={this.handleNav} data-dest="#">Donate</div>
          </nav>
        </header>
        <p className="App-intro">
          
        </p>
        <div id="content">
          {toDisplay}
        </div>
        <div id="errorDiv">
          <p id="errorMessage">Lorem Ipsum</p>
        </div>
      </div>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csrf: props.csrf,
    };
    this.handleLogin = this.handleLogin.bind(this);
  }
  
  handleLogin(e) {
    e.preventDefault();
    if (document.querySelector('#user').value === '' || document.querySelector('#pass').value === '') {
      helper.handleError('Both username and password are required.');
      return false;
    }
    helper.sendAjax('POST', document.querySelector('#loginForm').getAttribute('action'),
      document.querySelector('#loginForm'));  // .then(()=>{change appstate})
    return false;
  }

  render() {
    return(
      <form id="loginForm" name="loginForm" onSubmit={this.handleLogin} action="/login" method="POST" className="form">
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="Username"/><br/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="Password"/>
        <input type="hidden" name="_csrf" value={this.state.csrf}/><br/>
        <input className="formSubmit" type="submit" value="Log In"/>
      </form>
    );
  }
}

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csrf: props.csrf,
    };
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleSignup(e) {
    e.preventDefault();
  
    // Check for empty fields
    if (document.querySelector('#user').value === '' ||
    document.querySelector('#pass1').value === '' ||
    document.querySelector('#pass2').value === '') {
      helper.handleError('Please fill in all fields');
      return false;
    }
    // Check if the two passwords match
    if (document.querySelector('#pass1').value !== document.querySelector('#pass2').value) {
      helper.handleError('The passwords do not match');
      return false;
    }
    // Send
    helper.sendAjax('POST', document.querySelector('#signupForm').getAttribute('action'),
      document.querySelector('#signupForm')); // .then(()=>{change appstate})
    return true;
  }

  render() {
    return(
    <form id="signupForm" name="signupForm" onSubmit={this.handleSignup} action="/signup" method="POST" className="form">
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="Username"/><br/>
      <label htmlFor="pass1">Password: </label>
      <input id="pass1" type="password" name="pass1" placeholder="Password"/><br/>
      <label htmlFor="pass2">Confirm Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="Confirm Password"/>
      <input type="hidden" name="_csrf" value={this.state.csrf}/><br/>
      <input className="formSubmit" type="submit" value="Sign Up"/>
    </form>
    );
  }
}

class ChangePass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csrf: props.csrf,
    }
    this.handleChangePass = this.handleChangePass.bind(this);
  }

  handleChangePass(e) {
    e.preventDefault();
  
    // Check passwords
    if (document.querySelector('#pass').value === '' ||
    document.querySelector('#diffPass1').value === '' ||
    document.querySelector('#diffPass2').value === '') {
      helper.handleError('Please fill in all fields');
      return false;
    }
    if (document.querySelector('#diffPass1').value !== document.querySelector('#diffPass2').value) {
      helper.handleError('Your new passwords do not match');
      return false;
    }
    // Cannot check password / password match on client-side
    helper.sendAjax('POST', document.querySelector('#changePassForm').getAttribute('action'),
      document.querySelector('#changePassForm'));
    return false;
  }

  render(){
    return (
    <form id="changePassForm" name="changePassForm" onSubmit={this.handleChangePass} action="/changePass" method="POST" className="form">
      <label htmlFor="pass">Old Password: </label>
      <input id="pass" type="password" name="pass" placeholder="Old Password"/><br/>
      <label htmlFor="diffPass1">New Password: </label>
      <input id="diffPass1" type="password" name="diffPass1" placeholder="New Password"/><br/>
      <label htmlFor="diffPass2">Confirm Password: </label>
      <input id="diffPass2" type="password" name="diffPass2" placeholder="Confirm Password"/><br/>
      <input type="hidden" name="_csrf" value={this.state.csrf}/>
      <input className="formSubmit" type="submit" value="Change Password"/>
    </form>
    );
  }
}

// User can fill out fields that reflect their character
/** Planning
 * ---------------------- Fields ------------------------------------
 * Name, String
 * Level, [Number]
 * Class, [String]
 * Stats, [Number] ie: STR, DEX, CON, INT, WIS, CHA
 * Health, [Number] ie: Current Health, Temporary Health, Max Health
 * Inventory, [String] ie: item1, item2, item3, item 4...
 * ---------------------- Methods -----------------------------------
 * add/delete character
 * * new character
 * add/delete inventory
 * add/subtract HP ( w/ restore to max button? )
 * display ALL the data
 */
class CharacterSheet extends Component{
  constructor(props){
    super(props);
    // Will be storing all relevant information in state
    // which can then be saved to the account
    this.state = {
      newChar: false,
      csrf: props.csrf,
      characterInfo: {},
    }
    // Any 'this' dependant methods need to be bound
    // ----
    this.charForm = this.charForm.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
    // ----
  }

  handleGenerate(e) {
    e.preventDefault();

    const inputHealth = document.querySelector('#maxHealth').value;
    const tempForm = document.querySelector('#charForm');

    this.state.characterInfo = {
      name: document.querySelector('#charName').value,
      level: document.querySelector('#level').value,
      class: document.querySelector('#class').value,
      stats: document.querySelectorAll('.stat').value,
      health: [inputHealth,0,inputHealth],
      inventory: [],
    }
    helper.sendAjax(tempForm.getAttribute('method'), tempForm.getAttribute('action'), tempForm);
  }

  charForm() {
    return (
      <form id="charForm" name="charForm" onSubmit={this.handleGenerate} action="/new" method="POST" className="form">
        <label htmlFor="charName">Name: </label>
        <input id="charName" type="text" name="charName" placeholder="Name"/><br/>
        <label htmlFor="level">Level: </label>
        <input id="level" type="number" name="level" placeholder="0" min="1" max="25"/><br/>
        <label htmlFor="class">Class: </label>
        <input id="class" type="text" name="class" placeholder="Fighter (Champion)" /><br/>
        <label htmlFor="str">STR: </label>
        <input className="stat" type="number" name="str" placeholder="10" min="1" max="30"/><br/>
        <label htmlFor="dex">DEX: </label>
        <input className="stat" type="number" name="dex" placeholder="10" min="1" max="30"/><br/>
        <label htmlFor="con">CON: </label>
        <input className="stat" type="number" name="con" placeholder="10" min="1" max="30"/><br/>
        <label htmlFor="int">INT: </label>
        <input className="stat" type="number" name="int" placeholder="10" min="1" max="30"/><br/>
        <label htmlFor="wis">WIS: </label>
        <input className="stat" type="number" name="wis" placeholder="10" min="1" max="30"/><br/>
        <label htmlFor="cha">CHA: </label>
        <input className="stat" type="number" name="cha" placeholder="10" min="1" max="30"/><br/>
        <label htmlFor="maxHealth">Max Health: </label>
        <input className="health" type="number" name="maxHealth" placeholder="0" min="1" /><br/>
        <input className="formSubmit" type="submit" value="Generate Character"/>
      </form>
    );
  }

  render() {
    let toRender;
    if(this.state.newChar === true){
      toRender = this.charForm();
    } else {
      // toRender = <EditForm csrf = {this.state.csrf} />
    }
    return toRender;
  }
}

// A collection of characters that the user has made
/** Planning
 * ---------------------- Fields ------------------------------------
 * # of Characters
 * ---------------------- Methods -----------------------------------
 * handleCharacters (use list of characters)
 */
class CharacterList extends Component{
  constructor(props){
    super(props);
    // Will be storing all relevant information in state
    // which can then be saved to the account
    this.state = {

    };
    // Any 'this' dependant methods need to be bound
    // ----
    //
    // ----
  }
}

/** Planning
 * ---------------------- Fields ------------------------------------
 * need to display name, level, class
 * delete button
 * ---------------------- Methods -----------------------------------
 * select the character (which will make it display on the sheet)
 * delete the character (burn the pain away)
 */
class CharacterItem extends Component{
  constructor(props){
    super(props);
    // Will be storing all relevant information in state
    // which can then be saved to the account
    this.state = {
      // Shouldn't have to fuck w/ this @all
    };
    // Any 'this' dependant methods need to be bound
    // ----
    //
    // ----
  }
}

// Calculates difficulty based on
// # & CR of enemies vs. # & lvl of party
/** Planning
 * need to be able to mix CR, ie: more than 1 row
 * * add diff CR
 * need to be able to add party members
 * * parties may be of mixed levels, so need additional rows too
 */
class EncounterCalc extends Component{
  constructor(props){
    super(props);
    this.state = {

    };
    // Any 'this' dependant methods need to be bound
    // ----
    //
    // ----
  }
}

// Ask for money & thank the user
// (don't actually let them give me money)
class Donate extends Component{
  constructor(props){
    super(props);
    this.state = {

    };
    // Any 'this' dependant methods need to be bound
    // ----
    //
    // ----
  }
}

export default App;
