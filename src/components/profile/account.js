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
import { useContext, useEffect, useState } from 'react';
import { ToggleContext } from '../../contexts/toggleContext';
import Helmet from 'react-helmet';
import { userContext } from '../../contexts/userContext';
import axios from 'axios';
import LoadingSpin from 'react-loading-spin';
import { banks } from '../../data';
import { URL } from '../../App';
import moment from 'moment';

const Account = () => {
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
          tags: `${data.name}, ${data.accountType}, Ticket Adnan account`,
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

  // changes the user bank from a number in data base (code) to bank name
  const [userBank, setUserBank] = useState(null);
  useEffect(() => {
    if (user) {
      let userBankName = banks.find((bank) => {
        return bank.code === user.data.bank;
      });
      setUserBank(userBankName);
    }
  }, [user]);

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
  });

  useEffect(() => {
    if (!user) {
      setPopup({ ...popup, popup1: true });
    } else {
      setPopup({ ...popup, popup1: false, popup2: false });
    }
  }, [user]);

  return (
    <div className='account'>
      {/* meta and SEO information */}
      <Helmet>
        <title>{pages.title}</title>
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
                <Link to='/guests'>
                  <Tooltip title='Guests'>
                    <span>
                      <PeopleOutlineIcon></PeopleOutlineIcon>
                    </span>
                  </Tooltip>
                  <span>Guests</span>
                </Link>
              </li>

              <li>
                <Link to='/account' className='active'>
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
                  Account
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
              <div className='account__header'>
                <img
                  src={user.data.profilePic ? user.data.profilePic : profile}
                  alt='profile img'
                  className='shadow-box account__img'
                  width='300px'
                  height='300px'
                />
                <div className='account__list'>
                  <div className='left'>
                    <div className='account__item'>
                      Profile name: {user.data.name}
                    </div>

                    <div className='account__item'>
                      Social Media: {user.data.socialMedia}
                    </div>

                    <div className='account__item'>
                      Account type: {user.data.accountType}
                    </div>
                  </div>

                  <div className='right'>
                    <div className='account__item'>
                      {user.data.accountNumber && userBank
                        ? `account number: ${user.data.accountNumber}, bank: ${userBank.name}`
                        : ''}
                    </div>

                    <div className='account__item'>
                      Joined:{' '}
                      {moment(user.data.createdAt).format('Do MMMM YYYY')}
                    </div>

                    <div className='account__item'>
                      Number of events attended:{' '}
                      {Object.keys(user.data.eventsAttended).length}
                    </div>
                  </div>
                </div>
              </div>

              <div className='recent-grid'>
                <div className='projects'>
                  <div className='grid-card'>
                    <div className='card-header'>
                      <h3>Tickets purchased</h3>
                    </div>

                    <div className='card-body'>
                      <div className='table-responsive shadow-box'>
                        <table width='100%'>
                          <thead>
                            <tr>
                              <td>Event name</td>
                              <td>Organization</td>
                              <td>Status</td>
                            </tr>
                          </thead>
                          <tbody>
                            {user.data.eventsAttended.map((event, i) => (
                              <tr key={i}>
                                <td>UI/UX design</td>
                                <td>UI team</td>
                                <td>
                                  <span className='status purple'></span>Review.
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='costumers'>
                  <div className='grid-card'>
                    <div className='card-header'>
                      <h3>Host list</h3>
                      <button className='gradient'>
                        See All <span className='las la-arrow-right'></span>
                      </button>
                    </div>

                    <div className='card-body'>
                      {user.data.guestList.map((guest, i) => (
                        <div className='costumer' key={i}>
                          <div className='info'>
                            <img
                              src={profile}
                              alt='ticket adnan'
                              width='40px'
                              height='40px'
                              loading='lazy'
                            />

                            <div>
                              <h4>Yound Thug</h4>
                              <small>Host</small>
                            </div>
                          </div>

                          <div className='contact'>
                            <span className='las la-user-circle'></span>
                          </div>
                        </div>
                      ))}
                    </div>
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
    </div>
  );
};

export default Account;
