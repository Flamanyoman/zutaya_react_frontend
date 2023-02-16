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
import { useParams } from 'react-router-dom';
import { URL } from '../../App';
import LoadingSpin from 'react-loading-spin';
import { Buffer } from 'buffer';
import moment from 'moment';

const Ticket = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

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

  const text = 'Welcome to Ticket Adnan';

  const [qr, setQr] = useState(false);

  const [src, setSrc] = useState('');

  useEffect(() => {
    QRCode.toDataURL(text).then((data) => {
      setSrc(data);
    });
  }, [qr]);

  const handlePurchase = () => {
    setQr(true);
  };

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
                <button className='gradient' onClick={handlePurchase}>
                  Purchase
                </button>
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
    </div>
  );
};

export default Ticket;
