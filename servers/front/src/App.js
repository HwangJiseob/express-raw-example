import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';

import Home from './pages/Home'
import About from './pages/About'

function App(props) {
  return (
   <>
   <Router>
     <Switch>
      <Route path="/" exact={true} component={Home} />
      <Route path="/about" exact={true} component={About} />
     </Switch>
   </Router>
   </>
  );
}

export default App;
