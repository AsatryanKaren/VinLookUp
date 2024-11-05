import './App.css';
import ComingSoon from './components/ComingSoon';
import VinLookup from './components/ComingSoon';
import logo from './icons/carShowroom.png'
function App() {
  return (
    <div className="App">
     <VinLookup />
      <img className="logo" src={logo} />
    </div>
  );
}

export default App;
