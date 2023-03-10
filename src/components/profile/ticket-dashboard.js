import './profile.css';
import logo from '../../images/logo.png';
import profile from '../../images/profile.jpg';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import { useContext, useEffect, useState, useRef } from 'react';
import { ToggleContext } from '../../contexts/toggleContext';
import Helmet from 'react-helmet';
import { userContext } from '../../contexts/userContext';
import axios from 'axios';
import LoadingSpin from 'react-loading-spin';
import CurrencyFormat from 'react-currency-format';
import StoreIcon from '@mui/icons-material/Store';
import PlaceIcon from '@mui/icons-material/Place';
import WatchIcon from '@mui/icons-material/Watch';
import PianoIcon from '@mui/icons-material/Piano';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { Buffer } from 'buffer';
import { URL } from '../../App';
import moment from 'moment';
import { QrReader } from 'react-qr-reader';

const Ticket_Dashboard = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

  let navigate = useNavigate();

  //   use params to get page ID from terminal
  const { id } = useParams();

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
    name: '',
    state: '',
    location: '',
    date: '',
    time: '',
    type: '',
    host: '',
    org: '',
    hype: '',
    expectedIncome: '',
    realizedIncome: '',
    guests: [],

    tickets: null,
    img: null,

    availableTickets: 0,
    soldTickets: 0,
    ticketPercentage: 0,

    eventsHostedNum: 0,

    expectedGuests: 0,
    guestScanned: 0,
    guestPercentage: 0,

    projectedIncome: 0,
    realizedIncome: 0,
    incomePercentage: 0,

    startScan: false,
  });

  // use effect that gets user data as priority before getting page data
  //   if user ID is not id on created event page, send error message
  // redirect to 404 page
  useEffect(() => {
    // scroll to top of the page
    window.scrollTo(0, 0);

    axios
      .get(`${URL}/auth`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        // set user data
        setUser({ data });

        axios
          .get(`${URL}/dashboard/ticket/${id}`, {
            withCredentials: true,
          })
          .then((ticket) => {
            setValues({
              ...values,
              name: ticket.data.data.eventName,
              state: ticket.data.data.state,
              location: ticket.data.data.location,
              date: ticket.data.data.dateStamp,
              time: ticket.data.data.timeStamp,
              type: ticket.data.data.eventType,
              host: ticket.data.data.host.hostName,
              org: ticket.data.data.org.orgName,
              hype: ticket.data.data.hype,
              tickets: ticket.data.data.tickets,
              guests: ticket.data.data.guests,
              expectedIncome: ticket.data.data.income.expected,
              realizedIncome: ticket.data.data.income.realized,
              availableTickets: ticket.data.data.totalAvailableTickets,
              soldTickets: ticket.data.data.totalSoldTickets,
              expectedGuests: ticket.data.data.guests.length,

              // convert image from buffer to regular image from
              // https://stackoverflow.com/questions/70076193/how-to-convert-mongodb-buffer-to-image-in-react-node-express
              img: `data:${ticket.data.data.img.type};base64, ${Buffer.from(
                ticket.data.data.img.data.data
              ).toString('base64')}`,
            });

            setPages({
              ...pages,
              user: data,
              title: `${ticket.data.data.eventName} | ticket adnan`,
              description: `${ticket.data.data.hype}, ${
                Object.keys(data.eventsAttended).length
              }
                } of events AttachEmailRounded, ${
                  Object.keys(data.eventsHosted).length
                } events hosted, ${data.accountType}`,
              tags: `${data.name}, ${data.accountType}, ${ticket.data.data.eventName}, Ticket Adnan account`,

              error: false,
              pending: false,
            });
          })
          .catch((err) => {
            if (err.response.data.message === 'Not a host') {
              navigate('/404');
            }
          });
      })
      .catch((err) => {
        setUser(null);
        setPages({ ...pages, error: true, pending: false });
      });
  }, [pages.refresh, id]);

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
    if (user && user.data.accountType === 'Host' && values.tickets) {
      // sum of all available tickets
      // variables for calculations
      let availableTickets = 0;
      let soldTickets = 0;
      let ticketPercentage = 0;
      let guestPercentage = 0;
      let incomePercentage = 0;

      // if available tickets is above 0
      // prevents js from computing NaN
      if (values.availableTickets > 0) {
        ticketPercentage = (values.soldTickets / values.availableTickets) * 100;
      } else {
        ticketPercentage = 0;
      }

      // scanned percentage
      // coded soon

      // if user expected income is above 0
      // prevents js from computing NaN
      if (values.expectedIncome > 0) {
        incomePercentage =
          (values.realizedIncome / values.expectedIncome) * 100;
      } else {
        incomePercentage = 0;
      }

      // set page values
      setValues({
        ...values,

        eventsHostedNum: 1,

        projectedIncome: values.expectedIncome,
        realizedIncome: values.realizedIncome,
        incomePercentage,
        ticketPercentage,
      });
    }
  }, [user, values.tickets]);

  // function to set scanning using events date
  const status = (event) => {
    // compare the date formates

    // if date of event === today, prevent scanning
    if (moment(event).isAfter(new Date(), 'day')) {
      return false;
    }
    if (moment(event).isSameOrBefore(new Date(), 'day')) {
      return true;
    }
  };

  // code block to scan qr codes
  // if scan button is available, show the scan section
  const handleStartScan = () => {
    // scroll to top of the page
    setValues({ ...values, startScan: true });

    window.scrollTo(0, 0);
  };

  const handleQrErr = (err) => {
    if (err) {
      console.log(err);
    }
  };

  const handleQrResult = (result) => {
    if (result) {
      console.log(result);
    }
  };

  useEffect(() => {
    if (values.startScan === true) {
    }
  }, [values.startScan]);

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

        {values.tickets && (
          <div className='profile__main content'>
            <header>
              <h2>
                <label onClick={() => handleToggle()}>
                  <Tooltip title='Menu'>
                    <span>
                      <MenuIcon></MenuIcon>
                    </span>
                  </Tooltip>
                  {values.name}
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
              {!values.startScan && (
                <div>
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
                        <span>Event</span>
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
                      <div className='tickets__main'>
                        <div className='tickets__img'>
                          <div
                            style={{
                              backgroundImage: `url('${values.img}')`,
                            }}
                          ></div>
                          <img
                            className='shadow-box'
                            src={values.img}
                            alt='ticket adnan img'
                            loading='lazy'
                          />
                        </div>

                        <div className='tickets__body'>
                          <div className='box'>
                            <div>
                              <h1>{values.name}</h1>
                              <h4>
                                <Tooltip title='Location'>
                                  <PlaceIcon />
                                </Tooltip>
                                {values.state}, {values.location}
                              </h4>
                              <h4>
                                <Tooltip title='Date and Time'>
                                  <WatchIcon />
                                </Tooltip>
                                {moment(values.date).format('Do MMMM YYYY')},{' '}
                                {values.time}
                              </h4>
                              <h4>
                                <Tooltip title='Event type'>
                                  <PianoIcon />
                                </Tooltip>
                                {values.type}
                              </h4>
                              <h4>
                                <Tooltip title='Host'>
                                  <PeopleOutlineIcon />
                                </Tooltip>
                                {values.host}
                              </h4>
                              <h4>
                                <Tooltip title='Organization'>
                                  <StoreIcon />
                                </Tooltip>
                                {values.org}
                              </h4>
                            </div>

                            <div>
                              <p>{values.hype}</p>

                              <div>
                                {values.tickets[0].map((ticket, i) => (
                                  <div key={i}>
                                    <h4>
                                      <Tooltip title='Ticket type'>
                                        <LocalBarIcon />
                                      </Tooltip>
                                      {ticket.name}
                                    </h4>
                                    <small>{ticket.description}</small>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='grid-card'>
                        <div className='card-header'>
                          <h3>Tickets information</h3>
                        </div>

                        <div className='card-body'>
                          <div className='table-responsive shadow-box'>
                            <table width='100%'>
                              <thead>
                                <tr>
                                  <td>Ticket name</td>
                                  <td>Calculated price</td>
                                  <td>Quantity</td>
                                  <td>Sold</td>
                                </tr>
                              </thead>

                              <tbody>
                                {values.tickets[0].map((ticket, i) => (
                                  <tr key={i}>
                                    <td>{ticket.name}</td>
                                    <td>
                                      <CurrencyFormat
                                        value={ticket.calculatedPrice}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'₦'}
                                        renderText={(value) => (
                                          <div>{value}</div>
                                        )}
                                      />
                                    </td>
                                    <td>{ticket.quantity}</td>
                                    <td>{ticket.sold}</td>
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
                          {/* show only 5 guests  */}
                          {values.guests
                            .filter((guest, i) => i < 5)
                            .map((guest) => (
                              <div className='costumer' key={guest.id._id}>
                                <div className='info'>
                                  <img
                                    src={
                                      guest.id.profilePic
                                        ? guest.id.profilePic
                                        : profile
                                    }
                                    alt='ticket adnan'
                                    width='40px'
                                    height='40px'
                                    loading='lazy'
                                  />

                                  <div>
                                    <h4>{guest.id.name}</h4>
                                    <small>{guest.id.accountType}</small>
                                  </div>
                                </div>
                                <div className='contact'></div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      {status(values.date) === false && (
                        <span className='profile__scan-buttons'>
                          <button className='error__button'>Pending</button>
                          <p>
                            You can only scan tickets of events on event day
                          </p>
                        </span>
                      )}

                      {status(values.date) === true && (
                        <span className='profile__scan-buttons'>
                          <button
                            className='gradient'
                            onClick={handleStartScan}
                          >
                            Scan QR
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {values.startScan && (
                <div className='profile__scan-qr'>
                  <QrReader
                    delay={300}
                    onError={handleQrErr}
                    onResult={handleQrResult}
                    ViewFinder={() => {
                      return (
                        <div
                          className='view_finder'
                          style={{
                            width: '50%',
                            top: '25%',
                            left: '25%',
                            margin: 'auto',
                            height: '50%',
                            border: '3px double #007FFF',
                            position: 'absolute',
                            backgroundColor: 'rgba(10, 10, 10, 0.5)',
                            zIndex: '999',
                          }}
                        ></div>
                      );
                    }}
                    style={{
                      height: '40vh',
                      marginTop: '0',
                    }}
                    constraints={{ facingMode: { ideal: 'environment' } }}
                    className='video'
                  />
                </div>
              )}
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
    </div>
  );
};

export default Ticket_Dashboard;
