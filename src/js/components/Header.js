import React, { Component } from 'react';
import logoImg from 'images/logo.svg';
import appStore from '../appStore';
// import { density } from ''

// function select(state) {
//   return state.some.deep.property
// }

// let currentValue
// function handleChange() {
//   let previousValue = currentValue
//   currentValue = select(store.getState())

//   if (previousValue !== currentValue) {
//     console.log(
//       'Some deep nested property changed from',
//       previousValue,
//       'to',
//       currentValue
//     )
//   }
// }

// const unsubscribe = store.subscribe(handleChange)
// unsubscribe()

// var flyToTheMoon = function()
// {
//   alert("Zoom! Zoom! Zoom!");
// }
// flyToTheMoon();

export default class Header extends Component {
  // displayName: 'Header';

  constructor(props) {
    super(props);
    this.state = {
      popDensity: 0,
    };
    appStore.subscribe(() => { 
      console.log('subscribe fired!');
      this.setState( appStore.getState());
    });
  }

  render () {
    const {title, subtitle} = this.props;

    console.log(this.state);

    return (
      <div className='app-header'>
        <h1 className='app-title'>{title}</h1>
        <h2 className='app-subtitle'>{subtitle}</h2>
        <img className="app-logo" src={logoImg} alt="app-logo" />
       { this.state.popDensity > 200 && <span>"Density is over 200!"</span> }
      </div>
    );
  }
}
