import './footer.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Tooltip from '@mui/material/Tooltip';
import LoadingSpin from 'react-loading-spin';
import { debounce } from 'lodash';

const Footer = () => {
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const year = new Date().getFullYear();
  const formRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    setPending(true);

    emailjs
      .sendForm(
        'service_fd5la6o',
        'template_wqv4ul7',
        formRef.current,
        'l3cjsL3BBCszFiedu'
      )
      .then(
        (result) => {
          setPending(false);
          setEmail('');
          setSubject('');
          setMessage('');
        },
        (error) => {}
      );
  };

  const { pathname } = useLocation();

  const pathName = () => {
    // routes which will not display the footer component
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
      <div className='footer page'>
        <div className='footer__left'>
          <div className='footer__bg'></div>

          <div className='footer__links'>
            <div className='footer__links-top'>
              <div className='footer__links-left'>
                <h3>Information</h3>
                <Link to='/information/about-us'>About us</Link>
                <Link to='/information/how-it-works'>How it works</Link>
                <Link to='/pricing'>Pricing and charges</Link>
                <Link to='/information/features'>Features</Link>
                <Link to='/information/history'>History</Link>
                <Link to='/information/affiliates'>Affiliates</Link>
                <Link to='/information/about-our-ceo'>About our CEO</Link>
                <Link to='/information/other-services'>Other services</Link>
              </div>
              <div className='footer__links-right'>
                <h3>Legal</h3>
                <Link to='/information/privacy-policy'>Privacy Policy</Link>
                <Link to='/information/terms-of-use'>Terms of use</Link>
                <Link to='/information/terms-of-colaboration'>
                  Terms of colaboration
                </Link>
              </div>
            </div>

            <div className='footer__social'>
              <h3>Follow us on social media</h3>
              <div className='footer__social-button'>
                <Tooltip title='Facebook'>
                  <a
                    href='https://web.facebook.com/profile.php?id=100090252542534'
                    target='_blank'
                  >
                    <FacebookIcon className='icon__button' />
                  </a>
                </Tooltip>

                <Tooltip title='Instagram'>
                  <a
                    href='https://www.instagram.com/zutayanigeria/'
                    target='_blank'
                  >
                    <InstagramIcon className='icon__button' />
                  </a>
                </Tooltip>

                <Tooltip title='Twitter'>
                  <a href='https://twitter.com/ZutayaNG' target='_blank'>
                    <TwitterIcon className='icon__button' />
                  </a>
                </Tooltip>
              </div>
            </div>
            <div className='footer__copyright'>
              <span>Ticket Adnan </span> &copy; {year}
            </div>
          </div>
        </div>

        <div className='footer__right'>
          <h2>Do you want to become a partner?</h2>
          <p>
            You can work directly with us, simply send us an email as we are
            eager to form a mutually beneficial relationship
          </p>

          <form
            ref={formRef}
            onSubmit={debounce(handleSubmit, 1000, {
              leading: true,
              trailing: false,
            })}
          >
            <input
              type='email'
              name='user_email'
              id=''
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Type in your official E-mail'
              required
            />

            <input
              type='text'
              name='user_subject'
              id=''
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder='Title of event or project to colaborate on'
              required
            />

            <textarea
              name='message'
              id=''
              cols='30'
              rows='5'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Details about the proposed event'
              required
            ></textarea>

            <button className='gradient' value='Submit'>
              {pending ? (
                <LoadingSpin
                  size='15px'
                  width='1.7px'
                  secondaryColor='#007FFF'
                  primaryColor='#e7ebf0'
                />
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default Footer;
