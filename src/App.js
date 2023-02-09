import './App.css';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Home from './components/home/home';
import NotFound from './components/404/404';
import Login from './components/login/login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Informations from './components/informations/informations';
import Pricing from './components/pricing/pricing';
import CreateEvent from './components/create event/createEvent';
import Dashboard from './components/profile/dashboard';
import Account from './components/profile/account';
import Guests from './components/profile/guests';
import Ticket from './components/tickets/ticket';
import PageCreator from './components/page creator/pageCreator';
import PageEditor from './components/page creator/pageEditor';
import Ticket_Dashboard from './components/profile/ticket-dashboard';

function App() {
  return (
    // normal routes
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<NotFound />} />
        <Route path='login' element={<Login />} />
        <Route path='information/:id' element={<Informations />} />
        <Route path='pricing' element={<Pricing />} />
        <Route path='create-event' element={<CreateEvent />} />
        <Route path='dashboard/ticket/:id' element={<Ticket_Dashboard />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='account' element={<Account />} />
        <Route path='guests' element={<Guests />} />
        <Route path='ticket' element={<Ticket />} />
        <Route path='create-page' element={<PageCreator />} />
        <Route path='edit-page' element={<PageEditor />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export const URL = process.env.REACT_APP_SERVER_URL;

export default App;
