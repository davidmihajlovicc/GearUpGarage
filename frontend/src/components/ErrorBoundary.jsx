
import { Component } from 'react';
export default class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { error:null }; }
  static getDerivedStateFromError(error){ return { error }; }
  componentDidCatch(error, info){ console.error('React error boundary:', error, info); }
  render(){
    if(this.state.error){
      return (
        <div className="error-box">
          <h2>Došlo je do greške u aplikaciji</h2>
          <pre className="error-msg">
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
