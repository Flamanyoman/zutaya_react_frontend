import './home.css';
import { Link } from 'react-router-dom';
import QrCodeIcon from '@mui/icons-material/QrCode';
import Longcards from '../longcards/longcards';
import chromebar from '../../images/chromebar.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { homeFeatures } from '../../data';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import { states } from '../../data';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Helmet from 'react-helmet';
import LoadingSpin from 'react-loading-spin';
import { userContext } from '../../contexts/userContext';
import PlaceIcon from '@mui/icons-material/Place';
import WatchIcon from '@mui/icons-material/Watch';
import PianoIcon from '@mui/icons-material/Piano';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Buffer } from 'buffer';
import { URL } from '../../App';
import moment from 'moment';

const Home = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

  // user data
  const { user, setUser } = useContext(userContext);

  // page states
  const [pages, setPages] = useState({
    title: 'Ticket Adnan',
    description: null,
    tags: null,

    error: false,
    pending: true,
    refresh: 0,
  });

  const [values, setValues] = useState({
    state: null,
    eventType: null,
    loadMore: 0,

    tickets: [],

    pending2: false,
    pending3: false,

    showMore: false,
  });

  // refresh page function
  const handleRefresh = () => {
    setPages({
      ...pages,
      refresh: pages.refresh + 1,
      pending: true,
      error: false,
    });
  };

  // call data from the api
  useEffect(() => {
    // scroll to top of the page
    window.scrollTo(0, 0);

    // get page seo information
    axios
      .get(`${URL}/`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        // get event information
        const sendData = {
          state: values.state,
          eventType: values.eventType,
          n: 0,
        };

        // get events information
        axios
          .post(`${URL}/events`, sendData, {
            // signal: controller.signal,
            withCredentialss: true,
          })
          .then((event) => {
            setPages({
              ...pages,
              title: data.title,
              description: data.description,
              tags: data.tags,
              pending: false,
            });

            setValues({ ...values, tickets: event.data });
            // controller.abort();
          })
          .catch((err) => {
            setPages({ ...pages, error: true, pending: false });
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
  }, [pages.refresh]);

  const navigate = useNavigate();

  // code block to filter event by state
  const [state, setState] = useState('');

  const handleState = (event) => {
    setState(event.target.value);
    setValues({ ...values, state: event.target.value });
  };

  // code block to filer events by event type
  const [eventType, setEventType] = useState('');

  const handleType = (event) => {
    setEventType(event.target.value);
    setValues({ ...values, eventType: event.target.value });
  };

  // code block to get events when state or event type is changed
  useEffect(() => {
    if (values.state || values.eventType) {
      setValues({ ...values, pending2: true, ticket: [] });

      // get event information
      const sendData = {
        state: values.state,
        eventType: values.eventType,
        n: 0,
      };

      axios
        .post(`${URL}/events`, sendData, {
          // signal: controller.signal,
          withCredentialss: true,
        })
        .then((event) => {
          setValues({ ...values, pending2: false, tickets: event.data });
        })
        .catch((err) =>
          setPages({ ...pages, error: true, pending: false, pending2: false })
        );
    }
  }, [values.state, values.eventType]);

  // to load more tickets
  useEffect(() => {
    if (values.loadMore > 0) {
      setValues({ ...values, pending3: true });

      // get event information
      const sendData = {
        state: values.state,
        eventType: values.eventType,
        n: values.tickets.length,
      };

      axios
        .post(`${URL}/events`, sendData, {
          // signal: controller.signal,
          withCredentialss: true,
        })
        .then((event) => {
          let loaded = [...values.tickets, ...event.data];

          setValues({ ...values, tickets: loaded, pending3: false });
        })
        .catch((err) =>
          setPages({ ...pages, error: true, pending: false, pending3: false })
        );
    }
  }, [values.loadMore]);

  // function when the load more arrow is clickeds
  const handleLoadMore = () => {
    setValues({
      ...values,
      loadMore: values.loadMore + 1,
    });
  };

  return (
    <div>
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

      {pages.description && (
        <div className='home page'>
          {/* meta and SEO information */}
          <Helmet>
            <title>{pages.title}</title>
            <meta name='description' content={pages.description} />
            <meta name='tags' content={pages.tags} />
          </Helmet>

          <div className='home__intro'>
            <div className='home__left'>
              <div className='home__text'>
                <h1>
                  Welcome to <br /> <span>Ticket Adnan</span>
                </h1>

                <p>
                  We are proud to welcome you to the most advanced ticketing
                  platform, we are eager to meet all your needs ranging from
                  publicity, to sales of tickets, to gate and entry control.
                  Take a dive into the wonderful world of online ticketing and
                  allow us take away some of your worries so you can focus on
                  whats most important to your event: the event itself!
                </p>

                <button
                  className='gradient'
                  onClick={() => navigate('/create-event')}
                >
                  Host an event
                </button>
              </div>
            </div>

            <div className='home__right'>
              <div className='box'>
                <div className='home__rightflex'>
                  <div className='home__rightcard gradient shadow-box'>
                    <div className='box'>
                      <div className='home__icon'>
                        <Tooltip title='QR code'>
                          <QrCodeIcon className='home__iconQR' />
                        </Tooltip>
                      </div>
                      <p>
                        Find an event you like? Buy a ticket, you will recieve a
                        reciept in form of a QR code.
                      </p>

                      <Link to='/'>
                        Buy a ticket now
                        <Tooltip title='scroll down'>
                          <ExpandMoreIcon />
                        </Tooltip>
                      </Link>
                    </div>
                  </div>

                  <div className='home__animetext'>
                    <div className='home__animetext-wrapper'>
                      <h2 className='item'>Sell tickets</h2>
                      <h3 className='item'>Manage your events</h3>
                      <h4 className='item'>We bring that publicity</h4>
                      <h4 className='item'>QR code receipts</h4>
                      <h4 className='item'>Online payments</h4>
                    </div>
                  </div>
                </div>

                <div className='home__angletext'>
                  <h2>Ticket</h2>
                  <h2>Adnan</h2>
                </div>
              </div>
            </div>
          </div>

          <div className='box'>
            <div className='home__cards-container'>
              <img src={chromebar} alt='chrome bar' loading='lazy' />
              <div className='box'>
                <div className='home__cards-header'>
                  <div className='home__cards-search'>
                    <div className='home__searchBox'>
                      <input type='text' placeholder='Search ticket name' />
                      <Tooltip title='Search Ticket'>
                        <SearchIcon className='icon__button home__search' />
                      </Tooltip>
                    </div>
                    <span>
                      <div className='home__searchBox'>
                        <Box sx={{ minWidth: 250 }}>
                          <FormControl fullWidth>
                            <InputLabel id='demo-simple-select-label'>
                              Filter by event type
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              value={eventType}
                              label='Whats your event type?'
                              onChange={handleType}
                            >
                              <MenuItem value={'Party'}>Party</MenuItem>
                              <MenuItem value={'Show'}>Show</MenuItem>
                              <MenuItem value={'Get together'}>
                                Get together
                              </MenuItem>
                              <MenuItem value={'Games'}>Games</MenuItem>
                              <MenuItem value={'Corperate'}>Corperate</MenuItem>
                              <MenuItem value={'Concert'}>Concert</MenuItem>
                              <MenuItem value={'Humaniterian'}>
                                Humaniterian
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </div>
                      <div className='home__searchBox'>
                        <Box sx={{ minWidth: 250 }}>
                          <FormControl fullWidth>
                            <InputLabel id='demo-simple-select-label'>
                              Select your state
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              value={state}
                              label='Select your state'
                              onChange={handleState}
                            >
                              {states.map((state, num) => (
                                <MenuItem value={state} key={num}>
                                  {state}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </div>
                    </span>
                  </div>
                </div>

                <div className='home__cards'>
                  {values.pending2 ? (
                    <div className='center'>
                      <LoadingSpin
                        size='45px'
                        width='5.1px'
                        secondaryColor='#007FFF'
                        primaryColor='#e7ebf0'
                      />
                    </div>
                  ) : (
                    values.tickets &&
                    values.tickets.map((ticket, i) => (
                      <div
                        className='shortCards'
                        onClick={() => {
                          navigate(`/ticket/${ticket._id}`);
                        }}
                        key={i}
                      >
                        <img
                          src={`data:${ticket.img.type};base64, ${Buffer.from(
                            ticket.img.data.data
                          ).toString('base64')}`}
                          alt='ticket adnan img'
                          loading='lazy'
                        />

                        <div className='box'>
                          <h3>{ticket.eventName}</h3>

                          <div className='shortCards__points'>
                            <small>
                              <Tooltip title='Location'>
                                <PlaceIcon />
                              </Tooltip>
                              {ticket.state}, {ticket.location}
                            </small>

                            <small>
                              <Tooltip title='Date and Time'>
                                <WatchIcon />
                              </Tooltip>
                              {moment(ticket.dateStamp).format('Do MMMM YYYY')},{' '}
                              {ticket.timeStamp}
                            </small>

                            <small>
                              <Tooltip title='Event Type'>
                                <PianoIcon />
                              </Tooltip>
                              {ticket.eventType}
                            </small>
                          </div>

                          <Link to=''>
                            Purchase <ArrowRightAltIcon />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className='home__cards-more'>
                  {values.pending3 ? (
                    <LoadingSpin
                      size='25px'
                      width='1.7px'
                      secondaryColor='#007FFF'
                      primaryColor='#e7ebf0'
                    />
                  ) : (
                    <Link to=''>
                      <Tooltip title='Load more' onClick={handleLoadMore}>
                        <ExpandMoreIcon />
                      </Tooltip>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='box'>
            <div className='home__features'>
              <h2>Our Features and Services</h2>
              <Longcards features={homeFeatures} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
