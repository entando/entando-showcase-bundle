import React from 'react';
import './AnotherMfeConfig.css';
import ReactLogo from './ReactLogo';

class AnotherMfeConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      description: '',
    };
  }

  handleChangeUsername(value) {
    this.setState(prevState => ({
      ...prevState,
      username: value,
    }));
  }

  handleChangeDescription(value) {
    this.setState(prevState => ({
      ...prevState,
      description: value,
    }));
  }

  render() {
    const { username, description } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <ReactLogo className="App-logo" />
          MFE Form
        </header>
          <div><label htmlFor="username">Username:</label> <input id="username" name="username" onChange={e => this.handleChangeUsername(e.target.value)} defaultValue={username} /></div>
          <div><label htmlFor="description">Description:</label> <input id="description" name="description" onChange={e => this.handleChangeDescription(e.target.value)} defaultValue={description} /></div>
      </div>
    );
  }
}

export default AnotherMfeConfig;
