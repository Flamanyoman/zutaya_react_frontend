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
import CurrencyFormat from 'react-currency-format';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { debounce } from '@mui/material';
import { URL } from '../../App';
import moment from 'moment';

const Dashboard = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

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

  // values of page variables
  const [values, setValues] = useState({
    availableTickets: 0,
    soldTickets: 0,
    ticketPercentage: 0,

    eventsHostedNum: 0,

    expectedGuests: [],
    guestScanned: 0,
    guestPercentage: 0,

    projectedIncome: 0,
    realizedIncome: 0,
    incomePercentage: 0,

    deleteId: '',
    delTicketName: '',
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

  // function to round up numbers
  // gotten from https://stackoverflow.com/questions/5191088/how-to-round-up-a-number-in-javascript
  function roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
  }

  useEffect(() => {
    if (user && user.data.accountType === 'Host') {
      // sum of all available tickets
      // variables for calculations
      let availableTickets = 0;
      let soldTickets = 0;
      let ticketPercentage = 0;
      let guestPercentage = 0;
      let incomePercentages = 0;

      user.data.eventsHosted.map((ticket) => {
        availableTickets += ticket.totalAvailableTickets;
        soldTickets += ticket.totalSoldTickets;
      });

      // if available tickets is above 0
      // prevents js from computing NaN
      if (availableTickets > 0) {
        ticketPercentage = (soldTickets / availableTickets) * 100;
      } else {
        availableTickets = 0;
      }

      // scanned percentage
      // coded soon

      // if user expected income is above 0
      // prevents js from computing NaN
      if (user.data.income.realized > 0) {
        incomePercentages =
          (user.data.income.realized / user.data.income.expected) * 100;
      } else {
        incomePercentages = 0;
      }

      // set page values
      setValues({
        ...values,

        availableTickets,
        soldTickets,
        ticketPercentage,

        expectedGuests: user.data.guestList.length,
        eventsHostedNum: user.data.eventsHosted.length,

        projectedIncome: user.data.income.expected,
        realizedIncome: user.data.income.realized,
        incomePercentage: incomePercentages,
      });
    }
  }, [user]);

  const handleDelete = (event_id, eventName) => {
    setValues({ ...values, deleteId: event_id, delTicketName: eventName });
    setPopup({ ...popup, popup3: true });
  };

  const continueDelete = () => {
    const expected = user.data.income.expected;
    const deleteId = values.deleteId;
    const sendData = { deleteId, expected };
    setPopup({ ...popup, popup3Pending: true });

    axios
      .post(`${URL}/delete-event`, sendData, {
        signal: controller.signal,
        withCredentials: true,
      })
      .then(({ data }) => {
        setUser({ data });
        setValues({ ...values, deleteId: '', delTicketName: '' });
        setPopup({ ...popup, popup3: false, popup3Pending: false });
        controller.abort();
      })
      .catch((err) => {
        setValues({ ...values, deleteId: '', delTicketName: '' });
        setPopup({ ...popup, popup3: false, popup3Pending: false });
      });
  };

  // function to set color code using events
  const status = (event) => {
    // compare the date formates

    if (moment(event.dateStamp).isAfter(new Date(), 'day')) {
      return {
        statusName: 'Pending..',
        statusClass: 'status orange',
      };
    }

    if (moment(event.dateStamp).isSame(new Date(), 'day')) {
      return {
        statusName: 'Ongoing...',
        statusClass: 'status dark',
      };
    }

    if (moment(event.dateStamp).isBefore(new Date(), 'day')) {
      return {
        statusName: 'Review.',
        statusClass: 'status purple',
      };
    }
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
    popup3: false,
    popup3Pending: false,
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
    <div className='dashboard'>
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
              <span>Ticket Adnan</span>
            </h2>
          </div>

          <div className='sidebar-menu'>
            <ul>
              <li>
                <Link to='/dashboard' className='active'>
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
                  Dashboard
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
              <div className='cards'>
                <div className='card'>
                  <div>
                    <small>Tickets</small>
                    <span>Available: {values.availableTickets}</span>
                    <h1>{roundUp(values.ticketPercentage, 1)}%</h1>
                    <span>Sold: {values.soldTickets}</span>
                  </div>
                  <div>
                    <span></span>
                  </div>
                </div>

                <div className='card'>
                  <div>
                    <h1>{values.eventsHostedNum}</h1>
                    <span>Hosted events</span>
                  </div>
                  <div>
                    <span></span>
                  </div>
                </div>

                <div className='card'>
                  <div>
                    <small>Guests</small>
                    <span>Expected: {values.expectedGuests}</span>
                    <h1>{roundUp(values.guestPercentage, 1)}%</h1>
                    <span>Scanned: {values.guestScanned}</span>
                  </div>
                  <div>
                    <span></span>
                  </div>
                </div>

                <div className='card gradient shadow-box'>
                  <div>
                    <small>Income</small>
                    <span>
                      Projected:{' '}
                      <CurrencyFormat
                        value={values.projectedIncome}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'₦'}
                        renderText={(value) => <div>{value}</div>}
                      />
                    </span>
                    <h1>{roundUp(values.incomePercentage, 1)}%</h1>
                    <span>
                      Realized:{' '}
                      <CurrencyFormat
                        value={values.realizedIncome}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'₦'}
                        renderText={(value) => <div>{value}</div>}
                      />
                    </span>
                  </div>
                  <div>
                    <span></span>
                  </div>
                </div>
              </div>
              <div className='recent-grid'>
                <div className='projects'>
                  <div className='grid-card'>
                    <div className='card-header'>
                      <h3>Recent projects</h3>
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
                            {user &&
                              user.data.eventsHosted.map((event) => (
                                <tr
                                  key={event._id}
                                  onClick={() =>
                                    navigate(`/dashboard/ticket/${event._id}`)
                                  }
                                >
                                  <td>{event.eventName}</td>
                                  <td>{event.org && event.org.orgName}</td>
                                  <td>
                                    <span
                                      className={status(event).statusClass}
                                    ></span>
                                    {status(event).statusName}
                                  </td>
                                  <td>
                                    {event.totalSoldTickets < 1 && (
                                      <Tooltip
                                        title='Delete'
                                        onClick={() =>
                                          handleDelete(
                                            event._id,
                                            event.eventName
                                          )
                                        }
                                      >
                                        <DeleteOutlineIcon className='icon__button'></DeleteOutlineIcon>
                                      </Tooltip>
                                    )}
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
                      <h3>Guest list</h3>
                      <button className='gradient'>See all</button>
                    </div>
                    <div className='card-body'>
                      {user.data.guestList
                        .filter((guest, i) => i < 5)
                        .map((guest) => (
                          <div className='costumer' key={guest._id}>
                            <div className='info'>
                              <img
                                src={
                                  guest.profilePic ? guest.profilePic : profile
                                }
                                alt='ticket adnan'
                                width='40px'
                                height='40px'
                                loading='lazy'
                              />

                              <div>
                                <h4>{guest.name}</h4>
                                <small>{guest.accountType}</small>
                              </div>
                            </div>
                            <div className='contact'></div>
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
              To access the dashboard page, we would require some information
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

      {popup.popup3 && (
        <div className='popup__main'>
          <div
            className='popup__hide'
            onClick={() => {
              setPopup({ ...popup, popup3: false, popup3Pending: false });
              setValues({ ...values, deleteId: '', delTicketName: '' });
            }}
          ></div>
          <div className='popup__card shadow-box'>
            <h1 className='login__text'>Delete ticket?</h1>
            <p>
              Ensure you want to delete the tickets for {values.delTicketName}.
              Once deleted these tickets CANNOT be recovered
            </p>

            <div className='popup__buttons'>
              <button
                className='gradient'
                onClick={debounce(continueDelete, 1000, {
                  leading: true,
                  trailing: false,
                })}
              >
                {popup.popup3Pending ? (
                  <LoadingSpin
                    size='15px'
                    width='1.7px'
                    secondaryColor='#007FFF'
                    primaryColor='#e7ebf0'
                  />
                ) : (
                  'Continue'
                )}
              </button>

              <button
                className='error__button'
                onClick={() => {
                  setPopup({ ...popup, popup3: false, popup3Pending: false });
                  setValues({ ...values, deleteId: '', delTicketName: '' });
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

export default Dashboard;
