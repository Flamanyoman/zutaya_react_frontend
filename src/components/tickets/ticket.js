import './ticket.css';
import { Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StoreIcon from '@mui/icons-material/Store';
import PlaceIcon from '@mui/icons-material/Place';
import WatchIcon from '@mui/icons-material/Watch';
import PianoIcon from '@mui/icons-material/Piano';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import QRCode from 'qrcode';
import { useState, useEffect, useContext } from 'react';
import CurrencyFormat from 'react-currency-format';
import Helmet from 'react-helmet';
import { userContext } from '../../contexts/userContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { URL } from '../../App';
import LoadingSpin from 'react-loading-spin';
import { Buffer } from 'buffer';
import moment from 'moment';
import { debounce } from 'lodash';

const Ticket = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

  // initialize use navigate hook
  const navigate = useNavigate();

  // user data
  const { user, setUser } = useContext(userContext);

  // meta data and dom data displayed on the page
  const [pages, setPages] = useState({
    title: 'Ticket Adnan',
    description: null,
    tags: null,

    error: false,
    pending: true,
    refresh: 0,
  });

  const [values, setValues] = useState({
    id: '',
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
    availableTickets: '',
    soldTickets: '',

    tickets: null,

    img: null,

    // errors which occur in the process of ticket purchase
    purchaseErr: false,
    purchaseErrMsg: '',

    purchasePending: false,
  });

  const [popup, setPopup] = useState({
    popup1: false,
  });

  // get the end url from the terminal ie information/:id
  const { id } = useParams();

  // call data from the api
  useEffect(() => {
    // scroll to top of the page
    window.scrollTo(0, 0);

    // get page seo information
    axios
      .get(`${URL}/ticket/${id}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setValues({
          ...values,
          id: data._id,
          name: data.eventName,
          state: data.state,
          location: data.location,
          date: data.dateStamp,
          time: data.timeStamp,
          type: data.eventType,
          host: data.host.hostName,
          org: data.org.orgName,
          hype: data.hype,
          tickets: data.tickets,
          tickets: data.tickets,

          // convert image from buffer to regular image from
          // https://stackoverflow.com/questions/70076193/how-to-convert-mongodb-buffer-to-image-in-react-node-express
          img: `data:${data.img.type};base64, ${Buffer.from(
            data.img.data.data
          ).toString('base64')}`,
        });

        setPages({
          ...pages,
          title: `${data.eventName} | ticket adnan`,
          description: data.hype,
          tags: `${data.eventName},  ${data.state}, ${data.org}, zutayah.com, `,

          error: false,
          pending: false,
        });

        // check if user is logged in
        axios
          .get(`${URL}/auth`, {
            withCredentials: true,
          })
          .then(({ data }) => setUser({ data }))
          .catch((err) => {
            setUser(null);
          });
      })
      .catch((err) => {
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

  // variables for number of tickets you want to buy
  const [ticketNum, setTicketNum] = useState([]);

  useEffect(() => {
    let arr = [];

    if (values.tickets) {
      // create an array for the number of tickets selected
      values.tickets[0].map(() => {
        arr.push(0);

        setTicketNum(arr);
      });
    }
  }, [id, values.tickets]);

  // check how many tickets are available for purchase
  const howManyTickets = (i) => {
    let ticketDifference =
      parseInt(values.tickets[0][i].quantity) - values.tickets[0][i].sold;

    if (ticketDifference < parseInt(values.tickets[0][i].number)) {
      return ticketDifference;
    } else {
      return values.tickets[0][i].number;
    }
  };

  // functions to add and increase purchased
  // if tickets purchased is less than max available tickets per user
  const [subTotal, setSubTotal] = useState(0);

  const handleAddTicket = (number, i, price) => {
    if (howManyTickets(i) > ticketNum[i]) {
      let arr = [...ticketNum];
      arr[i] = arr[i] + 1;

      setSubTotal(subTotal + parseInt(price));

      setTicketNum(arr);
    }
  };

  // functions to subtract and remove purchased
  // if tickets purchased is greater than 0 available tickets per user
  const handleSubTicket = (i, price) => {
    if (ticketNum[i] > 0) {
      let arr = [...ticketNum];
      arr[i] = arr[i] - 1;

      setSubTotal(subTotal - parseInt(price));

      setTicketNum(arr);
    }
  };

  // function to set if ticket can be purchased using events date
  const status = (event) => {
    // compare the date formates

    // if today is after event day, prevent purchase
    if (moment(event).isBefore(new Date(), 'day')) {
      return false;
    }
    if (moment(event).isSameOrAfter(new Date(), 'day')) {
      return true;
    }
  };

  // code block to handle when the user clicks to purchase an event ticket
  const handlePurchase = () => {
    if (subTotal === 0) {
      setValues({
        ...values,
        purchaseErr: true,
        purchaseErrMsg: 'Please select the number of tickets to purchase',
      });
    } else if (!user) {
      setPopup({ ...popup, popup1: true });
    } else {
      setValues({
        ...values,
        purchaseErr: false,
        purchaseErrMsg: '',

        purchasePending: true,
      });

      // create an id for user ticket
      // function gotten from https://stackoverflow.com/questions/48006903/react-unique-id-generation
      function guidGenerator() {
        var S4 = function () {
          return (((1 + Math.random()) * 0x10000) | 0)
            .toString(16)
            .substring(1);
        };
        return S4() + S4() + '-' + 'zutayah';
      }
      // axios to send user information to the database
      const sendData = {
        _id: values.id,
        amount: subTotal,
        ticket: ticketNum,
        secret: guidGenerator(),
      };

      axios
        .post(`${URL}/ticket/purchase`, sendData, {
          signal: controller.signal,
          withCredentials: true,
        })
        .then((data) => {
          setUser({ data });

          controller.abort();
        })
        .catch((err) => {
          setValues({
            ...values,
            purchaseErr: true,
            purchaseErrMsg: 'Error occured! Refresh the page and try again',
            purchasePending: false,
          });
        });
    }
  };

  const [src, setSrc] = useState('');
  const [qr, setQr] = useState(false);

  useEffect(() => {
    // allow qr code to

    if (user) {
      let qrInfo = user.data.eventsAttended.find((event) => {
        return event.id.eventName === values.name;
      });

      if (qrInfo) {
        if (status) setQr(true);

        const text = qrInfo.secret;

        QRCode.toDataURL(text).then((data) => {
          setSrc(data);
        });
      }
    }
  }, [user]);

  return (
    <div className='tickets'>
      {/* meta and SEO information */}
      <Helmet>
        <title> {pages.title}</title>
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

      {values.tickets && (
        <div className='wrapper'>
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
                    {moment(values.date).format('Do MMMM YYYY')}, {values.time}{' '}
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

          <div className='tickets__side'>
            {!qr && (
              <div className='tickets__purchase'>
                <div className='shadow-box'>
                  <table width='100%'>
                    <thead>
                      <tr>
                        <td>Ticket</td>
                        <td>Price</td>
                        <td></td>
                      </tr>
                    </thead>

                    <tbody>
                      {values.tickets[0] &&
                        values.tickets[0].map((ticket, i) => (
                          <tr key={i}>
                            <td>{ticket.name}</td>
                            <td>
                              <CurrencyFormat
                                value={ticket.price}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'₦'}
                                renderText={(value) => <div>{value}</div>}
                              />{' '}
                            </td>
                            <td>
                              <Tooltip title='Remove ticket'>
                                <RemoveIcon
                                  className='icon__button'
                                  onClick={() =>
                                    handleSubTicket(i, ticket.price)
                                  }
                                />
                              </Tooltip>
                              <p>
                                {ticketNum[i]} / {howManyTickets(i)}
                              </p>
                              <Tooltip title='Add ticket'>
                                <AddIcon
                                  className='icon__button'
                                  onClick={() =>
                                    handleAddTicket(
                                      ticket.number,
                                      i,
                                      ticket.price
                                    )
                                  }
                                />
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <br />
                Total purchase:
                <CurrencyFormat
                  value={subTotal}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'₦'}
                  renderText={(value) => <p>{value}</p>}
                />
                <br />
                {status(values.date) && (
                  <button
                    className='gradient'
                    onClick={debounce(handlePurchase, 1000, {
                      leading: true,
                      trailing: false,
                    })}
                  >
                    {values.purchasePending ? (
                      <LoadingSpin
                        size='15px'
                        width='1.7px'
                        secondaryColor='#007FFF'
                        primaryColor='#e7ebf0'
                      />
                    ) : (
                      'Purchase'
                    )}
                  </button>
                )}
                {values.purchaseErr && (
                  <small className='error'>{values.purchaseErrMsg}</small>
                )}
              </div>
            )}

            {qr && (
              <div className='ticktets__qr'>
                <img src={src} alt='Ticket Adnan QR' />
              </div>
            )}
          </div>
        </div>
      )}

      {/* users that are not logged in  */}
      {popup.popup1 && (
        <div className='popup__main'>
          <div
            className='popup__hide'
            onClick={() => {
              setPopup({ ...popup, popup1: false });
            }}
          ></div>
          <div className='popup__card shadow-box'>
            <h1 className='login__text'>Please Log in</h1>
            <p>
              To purchase a ticket, you have to register on the platform as a
              guest by creating an account. Please head over to the log in page
              to create an account
            </p>

            <div className='popup__buttons'>
              <button className='gradient' onClick={() => navigate('/login')}>
                Log in
              </button>

              <button
                className='error__button'
                onClick={() => {
                  setPopup({ ...popup, popup1: false });
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

export default Ticket;
