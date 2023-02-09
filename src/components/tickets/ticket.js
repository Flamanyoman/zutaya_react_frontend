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
import { useState, useEffect } from 'react';
import CurrencyFormat from 'react-currency-format';
import Helmet from 'react-helmet';

const Ticket = () => {
  const [data, setData] = useState([
    { current: 0, max: 4, price: 10000, total: 100, name: 'vip' },
    { current: 2, max: 10, price: 15000, total: 100, name: 'vvip' },
  ]);

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

  const handleTicketAdd = (max, i) => {};

  const handleTicketsub = (min, i) => {};

  return (
    <div className='tickets'>
      {/* meta and SEO information */}
      <Helmet>
        <title>Capital block party| ticket adnan</title>
        <meta name='description' content='' />
        <meta name='tags' content='' />
      </Helmet>

      <div className='tickets__main'>
        <div className='tickets__img'>
          <div
            style={{
              backgroundImage:
                "url('https://s1.ticketm.net/dam/a/bcb/58c735fc-de2d-427b-90b2-c9ffe9503bcb_1802511_TABLET_LANDSCAPE_LARGE_16_9.jpg?width=450&height=255&fit=crop&auto=webp')",
            }}
          ></div>
          <img
            className='shadow-box'
            src='https://s1.ticketm.net/dam/a/bcb/58c735fc-de2d-427b-90b2-c9ffe9503bcb_1802511_TABLET_LANDSCAPE_LARGE_16_9.jpg?width=450&height=255&fit=crop&auto=webp'
            alt='ticket adnan img'
            loading='lazy'
          />
        </div>

        <div className='tickets__body'>
          <div className='box'>
            <div>
              <h1>Capital Block party</h1>
              <h4>
                <Tooltip title='Location'>
                  <PlaceIcon />
                </Tooltip>
                Bauchi, Multi-purpose hall wunti
              </h4>
              <h4>
                <Tooltip title='Date and Time'>
                  <WatchIcon />
                </Tooltip>
                20th September, 9:00pm
              </h4>
              <h4>
                <Tooltip title='Event type'>
                  <PianoIcon />
                </Tooltip>
                Party
              </h4>
              <h4>
                <Tooltip title='Host'>
                  <PeopleOutlineIcon />
                </Tooltip>
                Imoh
              </h4>
              <h4>
                <Tooltip title='Organization'>
                  <StoreIcon />
                </Tooltip>
                ACADERA Nigeria
              </h4>
            </div>

            <div>
              <p>
                Yippe! Another Edition of PARTY WITH TIMMY is here again, it’s
                the Island Edition which comes with lots of engaging activities
                as usual, get your dancing shoes and sexy wears ready, we are
                about to rave come Saturday, October 29th!!!
              </p>

              <div>
                <h4>
                  <Tooltip title='Ticket type'>
                    <LocalBarIcon />
                  </Tooltip>
                  VIP
                </h4>
                <small>
                  Free champaign and the rest just sha come and enjoy
                </small>
              </div>

              <div>
                <h4>
                  <Tooltip title='Ticket type'>
                    <LocalBarIcon />
                  </Tooltip>
                  VIIP
                </h4>
                <small>
                  Free champaign and the rest just sha come and enjoy
                </small>
              </div>

              <div>
                <h4>
                  <Tooltip title='Ticket type'>
                    <LocalBarIcon />
                  </Tooltip>
                  Table for two
                </h4>
                <small>
                  Free champaign and the rest just sha come and enjoy
                </small>
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
                  {data.map((tickets, i) => (
                    <tr key={i}>
                      <td>{tickets.name}</td>
                      <td>NGN{tickets.price}</td>
                      <td>
                        <Tooltip title='Remove ticket'>
                          <RemoveIcon
                            className='icon__button'
                            onClick={() => handleTicketsub(tickets.current.i)}
                          />
                        </Tooltip>
                        <p>
                          {tickets.current} / {tickets.max}
                        </p>
                        <Tooltip title='Add ticket'>
                          <AddIcon
                            className='icon__button'
                            onClick={() => handleTicketAdd(tickets.max, i)}
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
              value={0}
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
  );
};

export default Ticket;
