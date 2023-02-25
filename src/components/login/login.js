import { Link, useNavigate } from 'react-router-dom';
import './login.css';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import { FaTiktok } from 'react-icons/fa';
import Helmet from 'react-helmet';
import { useState, useEffect } from 'react';
import LoadingSpin from 'react-loading-spin';
import axios from 'axios';
import { useContext } from 'react';
import { userContext } from '../../contexts/userContext';
import { debounce } from 'lodash';
import { URL } from '../../App';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Login = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

  const navigate = useNavigate();

  // popup window
  const [popup, setPopup] = useState(false);

  // set a user
  const { user, setUser } = useContext(userContext);

  // page states
  const [pages, setPages] = useState({
    title: 'Ticket Adnan',
    description: null,
    tags: null,

    pending: true,
    refresh: 0,

    emailError: false,
    emailErrorMsg: '',
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
      .get(`${URL}/login`, { withCredentials: true })
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

  // values for log in
  const [values, setValues] = useState({
    // name input field
    name: '',
    nameErr: false,
    nameErrMsg: '',

    // email input field
    email: '',
    emailErr: false,
    emailErrMsg: '',

    // password input field
    password: '',
    passwordErr: false,
    passwordErrMsg: '',

    showPassword: false,

    newAccount: false,
    existingAccount: true,

    loginErr: false,
    loginErrMsg: '',
    signupErr: false,
    signupErrMsg: '',

    pending1: false,
    pending2: false,
  });

  // function to hide or show password
  const handleShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  // function to switch from login form to signup form
  const handleNewAccount = () => {
    setValues({ ...values, newAccount: true, existingAccount: false });
    setPopup(false);
  };

  // function to switch from signup form to login form
  const handleExistingAccount = () => {
    setValues({ ...values, existingAccount: true, newAccount: false });
  };

  // code block to check for errors in input fields
  // name error checker
  const nameBlur = () => {
    if (values.name.length < 3) {
      setValues({
        ...values,
        nameErr: true,
        nameErrMsg: 'Name must have more than 3 characters',
      });
    } else {
      setValues({ ...values, nameErr: false, nameErrMsg: '' });
    }
  };

  // email error checker
  const emailBlur = () => {
    if (values.email.length < 4) {
      setValues({
        ...values,
        emailErr: true,
        emailErrMsg: 'Please type in your email',
      });
    } else if (
      // regex to ensure user is inputing an email
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      )
    ) {
      setValues({
        ...values,
        emailErr: true,
        emailErrMsg: 'Please ensure your email is correct',
      });
    } else {
      setValues({ ...values, emailErr: false, emailErrMsg: '' });
    }
  };

  // password error checker
  const passwordBlur = () => {
    if (values.password.length < 5) {
      setValues({
        ...values,
        passwordErr: true,
        passwordErrMsg: 'password must contain 5 or more characters',
      });
    } else {
      setValues({ ...values, passwordErr: false, passwordErrMsg: '' });
    }
  };

  // function to log in
  const handleLogin = (e) => {
    e.preventDefault();

    setValues({ ...values, showPassword: false });

    emailBlur();
    passwordBlur();

    if (!values.emailErr && !values.passwordErr) {
      setValues({ ...values, pending1: true });
      const sendData = { email: values.email, password: values.password };

      axios
        .post(`${URL}/login`, sendData, {
          signal: controller.signal,
          withCredentials: true,
        })
        .then(({ data }) => {
          setUser(data);
          navigate(-1);

          setValues({ ...values, pending1: false, email: '' });
          controller.abort();
        })
        .catch((err) => {
          setValues({
            ...values,
            pending1: false,
            loginErr: true,
            loginErrMsg: err.response.data.message,
          });
        });
    }
  };

  // section for sign up
  const handleSignup = (e) => {
    e.preventDefault();
    const sendData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    setValues({ ...values, showPassword: false });
    nameBlur();
    emailBlur();
    passwordBlur();

    if ((!values.nameErr, !values.emailErr, !values.passwordErr)) {
      setValues({ ...values, pending2: true });

      axios
        .post(`${URL}/signup`, sendData, {
          signal: controller.signal,
          withCredentials: true,
        })
        .then(({ data }) => {
          setValues({ ...values, pending2: false });
          setUser(data.data);
          navigate('/');

          controller.abort();
        })
        .catch((err) => {
          setValues({
            ...values,
            pending2: false,
            signupErr: true,
            signupErrMsg: err.response.data.message,
          });
        });
    }
  };

  // let navigate = useNavigate();

  // const handleClick = () => {
  //   navigate('/dashboard');
  // };

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
        <div className='login page'>
          {/* meta and SEO information */}
          <Helmet>
            <title>{pages.title}</title>
            <meta name='description' content={pages.description} />
            <meta name='tags' content={pages.tags} />
          </Helmet>

          <div className='login__box box'>
            <div className='login__text'>
              <h1>Ticket Adnan</h1>
              <p>
                Please read and accept our privacy policy before proceeding to
                log in using your social media handle.
                <br />
                <br />
                <span>
                  I have read and accepted{' '}
                  <Link to='/information/privacy-policy'>privacy policy</Link>{' '}
                  and
                  <Link to='/information/terms-of-use'> terms of use </Link>
                  hence will proceed with this app
                </span>
              </p>
            </div>

            <div className='login__buttons'>
              {values.existingAccount && !values.newAccount && (
                <form
                  className='login__form'
                  onSubmit={debounce(handleLogin, 1000, {
                    leading: true,
                    trailing: false,
                  })}
                >
                  {/* user email  */}
                  <input
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    type='email'
                    placeholder='Login with E-mail'
                    required
                    onBlur={emailBlur}
                    value={values.email}
                  />
                  {values.emailErr && (
                    <small className='error'>{values.emailErrMsg}</small>
                  )}

                  {/* user password */}
                  <input
                    type={values.showPassword ? 'text' : 'password'}
                    placeHolder='Type in password'
                    required
                    value={values.password}
                    onBlur={passwordBlur}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                  />
                  {values.passwordErr && (
                    <small className='error'>{values.passwordErrMsg}</small>
                  )}

                  {/* check box to determine if event is single or reoccuring */}
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox onClick={handleShowPassword} />}
                      label={
                        values.showPassword
                          ? 'Hide password?'
                          : 'Show password?'
                      }
                    />
                  </FormGroup>

                  <button type='submit' className='gradient'>
                    {values.pending1 ? (
                      <LoadingSpin
                        size='15px'
                        width='1.7px'
                        secondaryColor='#007FFF'
                        primaryColor='#e7ebf0'
                      />
                    ) : (
                      'Log in'
                    )}
                  </button>

                  {values.loginErr && (
                    <small className='error'>{values.loginErrMsg}</small>
                  )}

                  <br />
                  <span className='login__text'>
                    <p>
                      <span>
                        Not registered?{' '}
                        <Link to='' onClick={handleNewAccount}>
                          Create an account
                        </Link>
                      </span>
                    </p>
                  </span>
                </form>
              )}

              {/* sign up form  */}
              {values.newAccount && !values.existingAccount && (
                <form
                  className='login__form'
                  onSubmit={debounce(handleSignup, 1000, {
                    leading: true,
                    trailing: false,
                  })}
                >
                  {/* user email  */}
                  <input
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    type='text'
                    placeholder='Type in your name'
                    required
                    onBlur={nameBlur}
                    value={values.name}
                  />
                  {values.nameErr && (
                    <small className='error'>{values.nameErrMsg}</small>
                  )}

                  {/* user email  */}
                  <input
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    type='email'
                    placeholder='Login with E-mail'
                    required
                    onBlur={emailBlur}
                    value={values.email}
                  />
                  {values.emailErr && (
                    <small className='error'>{values.emailErrMsg}</small>
                  )}

                  {/* user password */}
                  <input
                    type={values.showPassword ? 'text' : 'password'}
                    placeHolder='Type in password'
                    required
                    value={values.password}
                    onBlur={passwordBlur}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                  />
                  {values.passwordErr && (
                    <small className='error'>{values.passwordErrMsg}</small>
                  )}

                  {/* check box to determine if event is single or reoccuring */}
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox onClick={handleShowPassword} />}
                      label={
                        values.showPassword
                          ? 'Hide password?'
                          : 'Show password?'
                      }
                    />
                  </FormGroup>

                  <button type='submit' className='gradient'>
                    {values.pending2 ? (
                      <LoadingSpin
                        size='15px'
                        width='1.7px'
                        secondaryColor='#007FFF'
                        primaryColor='#e7ebf0'
                      />
                    ) : (
                      'Sign up'
                    )}
                  </button>

                  {values.signupErr && (
                    <small className='error'>{values.signupErrMsg}</small>
                  )}

                  <br />
                  <span className='login__text'>
                    <p>
                      <span>
                        Already have an account?{' '}
                        <Link to='' onClick={handleExistingAccount}>
                          Log in
                        </Link>
                      </span>
                    </p>
                  </span>
                </form>
              )}

              {/* <button className='login__facebook' onClick={handleClick}>
                <FacebookIcon /> Login with Facebook
              </button>

              <button className='login__instagram'>
                <InstagramIcon /> Login with Instagram
              </button>

              <button className='login__twitter'>
                <TwitterIcon /> Login with Twitter
              </button>

              <button className='login__tiktok'>
                <FaTiktok />
                Login with TikTok
              </button> */}
            </div>
          </div>
        </div>
      )}

      {popup && (
        <div className='popup__main'>
          <div className='popup__hide' onClick={() => setPopup(false)}></div>
          <div className='popup__card shadow-box'>
            <h1 className='login__text'>Account not found</h1>
            <p>
              This account{' '}
              <span className='popup__important'>{values.email}</span> is not
              registered on our website. To join the platform click on sign up
              and a new account would be created, or cancel and recheck your
              details
            </p>

            <div className='popup__buttons'>
              <button className='gradient' onClick={handleNewAccount}>
                Sign up
              </button>

              <button className='error__button' onClick={() => setPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
