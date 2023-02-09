import './header.css';
import logo from '../../images/logo.png';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { userContext } from '../../contexts/userContext';

const Header = () => {
  const navigate = useNavigate();

  // set a user
  const { user, setUser } = useContext(userContext);

  // goes to log in page
  const handleLogin = () => {
    navigate('/login');
  };

  // goes to user account page
  const handleAccount = () => {
    navigate('/account');
  };

  const { pathname } = useLocation();

  const pathName = () => {
    // routes which will not display the header component
    if (
      pathname === '/dashboard' ||
      pathname === '/login' ||
      pathname === '/account' ||
      pathname === '/guests' ||
      pathname === '/page-creator' ||
      pathname === '/page-editor' ||
      pathname.includes('/dashboard/ticket/')
    ) {
      return false;
    } else {
      return true;
    }
  };

  // BEM
  return (
    pathName() && (
      <nav className='header'>
        <div className='header__left'>
          <NavLink to='/'>
            <img src={logo} alt='logo Ticketadnan' loading='lazy' />
          </NavLink>
        </div>

        <div className='header__middle'>
          <NavLink
            className={({ isActive }) => {
              return isActive ? '' : 'header__link';
            }}
            to='/create-event'
          >
            Host an event
          </NavLink>

          <NavLink
            className={({ isActive }) => {
              return isActive ? '' : 'header__link';
            }}
            to='/pricing'
          >
            Pricing and charges
          </NavLink>

          <NavLink
            className={({ isActive }) => {
              return isActive ? '' : 'header__link';
            }}
            to='/information/how-it-works'
          >
            How it works
          </NavLink>
        </div>

        <div className='header__right'>
          {user ? (
            <button className='header__login gradient' onClick={handleAccount}>
              Account
            </button>
          ) : (
            <button className='header__login gradient' onClick={handleLogin}>
              Log in
            </button>
          )}
        </div>
      </nav>
    )
  );
};

export default Header;
