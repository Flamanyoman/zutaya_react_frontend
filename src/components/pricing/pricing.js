import './pricing.css';
import CheckIcon from '@mui/icons-material/Check';
import SpecialCard from '../special card/specialCard';
import { specialCard } from '../../data';
import { useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useState, useEffect, useContext } from 'react';
import LoadingSpin from 'react-loading-spin';
import axios from 'axios';
import { userContext } from '../../contexts/userContext';
import { URL } from '../../App';

const Pricing = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

  // set a user
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

    axios
      .get(`${URL}/pricing`, { withCredentials: true })
      .then(({ data }) => {
        setPages({
          ...pages,
          title: data.title,
          description: data.description,
          tags: data.tags,
          pending: false,
        });

        // get user information
        axios
          .get(`${URL}/auth`, {
            withCredentials: true,
          })
          .then(({ data }) => setUser({ data }))
          .catch((err) => setUser(null));
      })
      .catch((err) => setPages({ ...pages, error: true, pending: false }));
  }, [pages.refresh]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create-event');
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
        <div className='pricing page box'>
          {/* meta and SEO information */}
          <Helmet>
            <title>{pages.title}</title>
            <meta name='description' content={pages.description} />
            <meta name='tags' content={pages.tags} />
          </Helmet>

          <div className='pricing__header'>
            <h1>How Pricy Is Your Entrance Fee?</h1>
            <p>
              At what ever price range you set for your event, we collect a
              small percentage as fees for use of the service.
            </p>
          </div>

          <div className='pricing__div'>
            <div className='price1 shadow-box'>
              <h2>NGN100 - NGN4,900</h2>
              <span>
                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Black
                  QR-code receipt
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Basic price
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> We take a
                  20% commission per Ticket
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Onsite event
                  publicity
                </p>
              </span>

              <button className='gradient' onClick={handleClick}>
                Create an event
              </button>
            </div>

            <div className='price2 gradient shadow-box'>
              <h2>NGN10,000 and Above</h2>
              <span>
                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Gold QR-code
                  receipt
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Premium
                  price
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> We take a
                  12% commission per Ticket
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Onsite event
                  publicity
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Online
                  support
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Social media
                  publicity
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Full
                  representative support
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Event
                  coverage
                </p>
              </span>

              <button className='gradient shadow-box' onClick={handleClick}>
                Create an event
              </button>
            </div>

            <div className='price3 shadow-box'>
              <h2>NGN5,000 - NGN9,900</h2>
              <span>
                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Blue QR-code
                  receipt
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Mid-level
                  price
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> We take a
                  15% commission per Ticket
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Onsite event
                  publicity
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Online
                  support
                </p>

                <p>
                  <CheckIcon className='pricing__icon'></CheckIcon> Social media
                  publicity
                </p>
              </span>

              <button className='gradient' onClick={handleClick}>
                Create an event
              </button>
            </div>
          </div>

          <span className='center'>
            <SpecialCard info={specialCard}></SpecialCard>
          </span>
        </div>
      )}
    </div>
  );
};

export default Pricing;
