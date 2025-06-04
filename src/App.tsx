import './App.scss';
import './styles/main.scss';
import GoogleCalendar from './components/googleCalendar/GoogleCalendar';
import SideCalendar from './components/sideCalendar/SideCalendar';
import Header from './components/header/Header';

function App() {
  return (
    <div className="app-container">
      <Header/>
      <div className="main-layout">
        <SideCalendar />
        <GoogleCalendar />
      </div>
    </div>
  );
}

export default App;
