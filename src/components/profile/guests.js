import './profile.css';
import logo from '../../images/logo.png';
import profile from '../../images/profile.jpg';
import { Link, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import { useContext, useState, useEffect } from 'react';
import { ToggleContext } from '../../contexts/toggleContext';
import Helmet from 'react-helmet';
import { userContext } from '../../contexts/userContext';
import axios from 'axios';
import LoadingSpin from 'react-loading-spin';
import { URL } from '../../App';

const Guests = () => {
  let navigate = useNavigate();

  // set a user
  const { user, setUser } = useContext(userContext);

  // toggle sidebar
  const { toggle, handleToggle } = useContext(ToggleContext);

  // get user information and pages information
  const [pages, setPages] = useState({
    title: 'Ticket Adnan',
    description: null,
    tags: null,

    user: null,

    error: false,
    pending: true,
    refresh: 0,
  });

  // use effect that gets user data as priority before getting page data
  useEffect(() => {
    // scroll to top of the page
    window.scrollTo(0, 0);

    axios
      .get(`${URL}/auth`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setUser({ data });

        setPages({
          ...pages,
          user: data,
          title: `${data.name} | ticket adnan`,
          description: `${data.name}, ${Object.keys(data.eventsAttended).length}
            } of events AttachEmailRounded, ${
              Object.keys(data.eventsHosted).length
            } events hosted, ${data.accountType}`,
          tags: `${data.name}, ${data.accountType}, Ticket Adnan account, ${data.name} guest list`,
          error: false,
          pending: false,
        });
      })
      .catch((err) => {
        setUser(null);
        setPages({ ...pages, error: true, pending: false });
      });
  }, [pages.refresh]);

  // refresh page function
  const handleRefresh = () => {
    setPages({
      ...pages,
      refresh: pages.refresh + 1,
      pending: true,
      error: false,
    });
  };

  // logout by deleting login credential cookies
  const handleLogout = () => {
    axios
      .get(`${URL}/logout`, { withCredentials: true })
      .then((data) => {
        navigate('/');
        setUser(null);
      })
      .catch((err) => {
        handleRefresh();
      });
  };

  // popup to check user authentication
  const [popup, setPopup] = useState({
    popup1: false,
    popup2: false,
  });

  useEffect(() => {
    if (!user) {
      setPopup({ ...popup, popup1: true });
    } else if (user && user.data.accountType === 'Guest') {
      setPopup({ ...popup, popup2: true });
    } else {
      setPopup({ ...popup, popup1: false, popup2: false });
    }
  }, [user]);

  return (
    <div className='costumers'>
      {/* meta and SEO information */}
      <Helmet>
        <title>Your guests | ticket adnan</title>
        <meta name='description' content={pages.description} />
        <meta name='tags' content={pages.tags} />
      </Helmet>

      {pages.pending && (
        <div className='page center'>
          <LoadingSpin
            size='45px'
            width='5.1px'
            secondaryColor='#007FFF'
            primaryColor='#e7ebf0'
          />
        </div>
      )}

      {pages.error && (
        <div className='page center'>
          <button className='error__button' onClick={handleRefresh}>
            Retry
          </button>
        </div>
      )}

      <div className='profile'>
        {toggle && <input type='checkbox' id='nav-toggle' checked />}

        <div className='profile__sidebar'>
          <div className='sidebar-brand'>
            <h2>
              <span>
                <img
                  src={logo}
                  alt='ticket adnan'
                  onClick={() => navigate('/')}
                  loading='lazy'
                />
              </span>
              <span> Ticket Adnan</span>
            </h2>
          </div>

          <div className='sidebar-menu'>
            <ul>
              <li>
                <Link to='/dashboard'>
                  <Tooltip title='Dashboard'>
                    <span>
                      <DashboardIcon></DashboardIcon>
                    </span>
                  </Tooltip>
                  <span>Dashboard</span>
                </Link>
              </li>

              <li>
                <Link to='/guests' className='active'>
                  <Tooltip title='Guests'>
                    <span>
                      <PeopleOutlineIcon></PeopleOutlineIcon>
                    </span>
                  </Tooltip>
                  <span>Guests</span>
                </Link>
              </li>

              <li>
                <Link to='/account'>
                  <Tooltip title='Account'>
                    <span>
                      <AssignmentIndIcon></AssignmentIndIcon>
                    </span>
                  </Tooltip>
                  <span>Account</span>
                </Link>
              </li>

              <li>
                <Link to='' onClick={handleLogout}>
                  <Tooltip title='Log out'>
                    <span>
                      <PowerSettingsNewIcon></PowerSettingsNewIcon>
                    </span>
                  </Tooltip>
                  <span>Log out</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {pages.user && (
          <div className='profile__main content'>
            <header>
              <h2>
                <label onClick={() => handleToggle()}>
                  <Tooltip title='Menu'>
                    <span>
                      <MenuIcon></MenuIcon>
                    </span>
                  </Tooltip>
                  Guests
                </label>
              </h2>

              <div className='user-wrapper'>
                <img
                  src={user.profilePic ? user.profilePic : profile}
                  alt='ticket adnan'
                  width='40px'
                  height='40px'
                  loading='lazy'
                />
                <div>
                  <h4>{user.data.name}</h4>
                  <small>{user.data.accountType}</small>
                </div>
              </div>
            </header>

            <main className='profile__main'>
              <div className='recent-grid costumer'>
                <div className='projects'>
                  <div className='grid-card'>
                    <div className='card-header'>
                      <h3>Guest list</h3>
                    </div>

                    <div className='card-body'>
                      <div className='table-responsive shadow-box'>
                        <table width='100%'>
                          <thead>
                            <tr>
                              <td>Name</td>
                              <td>Social media</td>
                              <td>Account type</td>
                              <td>Number of tickets</td>
                              <td>Amount spent</td>
                            </tr>
                          </thead>

                          <tbody>
                            {user.data.guestList &&
                              user.data.guestList.map((guest, i) => (
                                <tr key={i}>
                                  <td>Omizegba Imoh</td>
                                  <td>Facebook</td>
                                  <td>Host</td>
                                  <td>Nof tickets</td>
                                  <td>NGN100,000</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <button className='gradient'>Download pdf</button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>

      {/* users that are not logged in  */}
      {popup.popup1 && (
        <div className='popup__main'>
          <div
            className='popup__hide'
            onClick={() => {
              setPopup({ ...popup, popup1: false });
              navigate(-1);
            }}
          ></div>
          <div className='popup__card shadow-box'>
            <h1 className='login__text'>Please Log in</h1>
            <p>
              To access the accounts page, we would require some information
              from you as a user of the platform. Please head to the log in page
              to create an account.
            </p>

            <div className='popup__buttons' onClick={() => navigate('/login')}>
              <button className='gradient'>Log in</button>

              <button
                className='error__button'
                onClick={() => {
                  setPopup({ ...popup, popup1: false });
                  navigate(-1);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* users that are guests  */}
      {popup.popup2 && (
        <div className='popup__main'>
          <div
            className='popup__hide'
            onClick={() => {
              setPopup({ ...popup, popup2: false });
              navigate(-1);
            }}
          ></div>
          <div className='popup__card shadow-box'>
            <h1 className='login__text'>Become a Host!</h1>
            <p>
              To access this page you MUST be a host. To become a host, we
              require some addiitional information, head over to host an event
              page and host an event!
            </p>

            <button
              className='error__button'
              onClick={() => {
                setPopup({ ...popup, popup1: false });
                navigate(-1);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guests;
