import './createEvent.css';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { banks, states, time } from '../../data';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Helmet from 'react-helmet';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import LoadingSpin from 'react-loading-spin';
import { userContext } from '../../contexts/userContext';
import { debounce } from 'lodash';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tooltip from '@mui/material/Tooltip';
import NotesIcon from '@mui/icons-material/Notes';
import formData from 'form-data';
import { URL as backEndURL } from '../../App';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const CreateEvent = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

  // page states
  const [pages, setPages] = useState({
    title: 'Ticket Adnan',
    description: null,
    tags: null,

    error: false,
    pending: true,
    refresh: 0,
  });

  // set a user
  const { user, setUser } = useContext(userContext);

  const handleRefresh = () => {
    setPages({
      ...pages,
      refresh: pages.refresh + 1,
      pending: true,
      error: false,
    });
  };

  // get page information as priority, then userinformation
  useEffect(() => {
    // scroll to top of the page
    window.scrollTo(0, 0);

    axios
      .get(`${backEndURL}/create-event`, { withCredentials: true })
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
          .get(`${backEndURL}/auth`, {
            withCredentials: true,
          })
          .then(({ data }) => {
            setUser({ data });
          })
          .catch((err) => setUser(null));
      })
      .catch((err) => setPages({ ...pages, error: true, pending: false }));
  }, [pages.refresh]);

  // initialize use navigate hook
  const navigate = useNavigate();

  // Values for the create event page
  const [values, setValues] = useState({
    // code block for the event name
    eventName: '',
    eventNameErr: false,
    eventNameErrMsg: '',

    // // code block to handle date and time pickers
    date: '',
    dateErr: false,
    dateErrMsg: '',

    // code block to see if event is reoccuring
    reoccuring: false,

    // handles the repeat dropdown with the default being Single
    repeat: 'Single',
    repeatErr: false,
    repeatErrMsg: '',

    // code block to handle event time
    time: '',
    timeErr: false,
    timeErrMsg: '',

    // code block for inputting venue
    venue: '',
    venueErr: false,
    venueErrMsg: '',

    // code block to input event brand
    eventBrand: '',
    eventBrandErr: false,
    eventBrandErrMsg: '',

    // code block to input host email
    email: '',
    emailErr: false,
    emailErrMsg: '',

    // code block for inputting selected img into the webpage
    img: null,
    imgErr: false,
    imgErrMsg: '',

    // code block for inputing account number into the webpage
    accountNumber: '',
    accountNumberErr: false,
    accountNumberErrMsg: '',

    // block for choosing bank
    bank: '',
    bankErr: false,
    bankErrMsg: '',

    // block to see if account number is verfied
    varified: false,
    varifiedName: '',

    varificationBlurMsg: '',

    // state of event
    state: '',
    stateErr: false,
    stateErrMsg: '',

    // type of event being hosted
    eventType: '',
    eventTypeErr: false,
    eventTypeErrMsg: '',

    // description of event
    description: '',
    descriptionErr: false,
    descriptionErrMsg: '',

    // bank information for personal account
    personalBank: '',
    personalBankErr: false,
    personalBankErrMsg: '',

    // personal account number
    personalAccount: '',
    personalAccountErr: false,
    personalAccountErrMsg: '',

    // ticket form error
    ticketFormErr: false,
    ticketFormErrMsg: '',

    // form success
    ticketFormSuccess: false,
    ticketFormSuccessMsg: '',

    ticketFormPending: false,
  });

  // use state specifically for image files to be uploaded to database
  const [file, setFile] = useState(null);

  // code block for the event name
  const handleEventname = (e) => {
    setValues({ ...values, eventName: e.target.value });
  };

  // code block to handle date
  const handleChange = (newValue) => {
    setValues({ ...values, date: newValue });
  };

  const minDate = new Date();

  // add 3 days to today
  minDate.setDate(new Date().getDate() + 1);

  // code block to set if user says event is reoccuring
  const handleCheckBox = () => {
    setValues({
      ...values,
      reoccuring: !values.reoccuring,
      repeat: 'Single',
      repeatErr: false,
      repeatErrMsg: '',
    });
  };

  const handleEventRepeat = (e) => {
    setValues({ ...values, repeat: e.target.value });
  };

  const handleTime = (e) => {
    setValues({ ...values, time: e.target.value });
  };

  const handleVenue = (e) => {
    setValues({ ...values, venue: e.target.value });
  };

  // inputting event brand
  const handleEventBrand = (e) => {
    setValues({ ...values, eventBrand: e.target.value });
  };

  // inputting host email
  const handleEmail = (e) => {
    setValues({ ...values, email: e.target.value });
  };
  // code block for inputting selected img into the webpage
  const onImageChange = (e) => {
    const [file] = e.target.files;

    file.size > 2097152
      ? setValues({
          ...values,
          imgErr: true,
          imgErrMsg: 'Images must be 2mb or less',
          img: '',
        })
      : setValues({
          ...values,
          imgErr: false,
          imgErrMsg: '',
          img: URL.createObjectURL(file),
        });

    setFile(file);
  };

  const handleAccountNumber = (e) => {
    setValues({ ...values, accountNumber: e.target.value });
  };

  // block for choosing bank
  const handleBank = (e) => {
    setValues({ ...values, bank: e.target.value });
  };

  // block to handle personal bank
  const handlePersonalbank = (e) => {
    setValues({ ...values, personalBank: e.target.value });
  };

  // block for choosing statte event is occuring
  const handleState = (e) => {
    setValues({ ...values, state: e.target.value });
  };

  // block for setting type of event
  const handleType = (e) => {
    setValues({ ...values, eventType: e.target.value });
  };

  // block for choosing setting description text
  const handleDescription = (e) => {
    setValues({ ...values, description: e.target.value });
  };

  // function to fetch account name of user from free nuban api
  // https://maylancer.org/api/nuban/
  useEffect(() => {
    if (
      values.accountNumber &&
      values.accountNumber.length === 10 &&
      values.bank
    ) {
      axios
        .get(
          `https://maylancer.org/api/nuban/api.php?account_number=${values.accountNumber}&bank_code=${values.bank}`
        )
        .then((response) => {
          if (response.data.account_name) {
            setValues({
              ...values,
              varified: true,
              verificationBlurMsg: '',
              varifiedName: response.data.account_name,
            });
          } else {
            setValues({
              ...values,
              varified: false,
              varifiedName: '',
              varificationBlurMsg: response.data.message,
            });
          }
        })
        .catch((err) =>
          setValues({
            ...values,
            varified: false,
            varifiedName: '',
            varificationBlurMsg:
              'Please make sure your account details are correct or check your connection',
          })
        );
    }
  }, [values.accountNumber, values.bank]);

  // *
  // function for ticket type and number selection
  // add a new object to the tickets array
  const num = {
    name: '',
    price: '',
    quantity: '',
    number: '',
    description: '',
    sold: 0,
    calculatedPrice: '',
  };

  // tickets array
  const [createdTickets, setCreatedTickets] = useState([
    {
      name: '',
      price: '',
      quantity: '',
      number: '',
      description: '',
      sold: 0,
      calculatedPrice: '',
    },
  ]);

  // adds a new ticket with a max ticket number of 7
  const handleAdd = () => {
    if (createdTickets.length < 7) {
      setCreatedTickets([...createdTickets, num]);
    }
  };

  // removes text in ticket description field
  const handleTicketDescription = (e, i) => {
    e.target.parentNode.parentNode.parentNode.classList.toggle('hideDesc');
    let array = [...createdTickets];
    array[i].description = '';
    setCreatedTickets(array);
  };

  // deletes a ticket if there is atleast 1 ticket
  const handleDelete = (i) => {
    if (createdTickets.length > 1) {
      setCreatedTickets(createdTickets.filter((value, index) => i !== index));
    }
  };

  // sets the name field of the ticket
  const changeName = (e, i) => {
    let array = [...createdTickets];
    array[i].name = e.target.value;
    setCreatedTickets(array);
  };

  // sets the price field of the ticket
  const changePrice = (e, i) => {
    let array = [...createdTickets];
    array[i].price = e.target.value;
    setCreatedTickets(array);

    // removing 20% percent of income for less than 4900
    if (array[i].price <= 4900) {
      array[i].calculatedPrice = e.target.value - 0.2 * e.target.value;
      setCreatedTickets(array);
    }

    // removing 15% percent of income for less than 9900
    if (array[i].price > 4900 && array[i].price <= 9900) {
      array[i].calculatedPrice = e.target.value - 0.15 * e.target.value;
      setCreatedTickets(array);
    }

    // removing 12% percent of income for greater than 9900
    if (array[i].price > 9900) {
      array[i].calculatedPrice = e.target.value - 0.12 * e.target.value;
      setCreatedTickets(array);
    }
  };

  // sets the quantity field of the ticket
  const changeQuantity = (e, i) => {
    let array = [...createdTickets];
    array[i].quantity = e.target.value;
    setCreatedTickets(array);
  };

  // sets the number field of the ticket
  const changeNumber = (e, i) => {
    let array = [...createdTickets];
    array[i].number = e.target.value;
    setCreatedTickets(array);
  };

  // sets the description field of the ticket
  const changeDescription = (e, i) => {
    let array = [...createdTickets];
    array[i].description = e.target.value;
    setCreatedTickets(array);
  };

  // form input error handlersva
  // name input field error
  const eventNameBlur = () => {
    if (values.eventName.length < 1) {
      setValues({
        ...values,
        eventNameErr: true,
        eventNameErrMsg: 'Please type in your event name',
      });
    } else {
      setValues({ ...values, eventNameErr: false, eventNameErrMsg: '' });
    }
  };

  // date input field error
  const dateBlur = () => {
    if (values.date.length < 3) {
      setValues({
        ...values,
        dateErr: true,
        dateErrMsg: 'Select the date of your event',
      });
    } else if (values.date < new Date(Date.now() + 1000 * 60 * 60 * 24)) {
      setValues({
        ...values,
        dateErr: true,
        dateErrMsg:
          'An event can only be created minumum of one day in advance',
      });
    } else {
      setValues({ ...values, dateErr: false, dateErrMsg: '' });
    }
  };

  const eventRepeatBlur = () => {
    if (values.repeat === 'Single') {
      setValues({
        ...values,
        repeatErr: true,
        repeatErrMsg: 'Select how requent your event occurs',
      });
    } else {
      setValues({ ...values, repeatErr: false, repeatErrMsg: '' });
    }
  };

  const timeBlur = () => {
    if (values.time.length < 1) {
      setValues({
        ...values,
        timeErr: true,
        timeErrMsg: 'Please choose event time',
      });
    } else {
      setValues({ ...values, timeErr: false, timeErrMsg: '' });
    }
  };

  const venueBlur = () => {
    if (values.venue.length < 3) {
      setValues({
        ...values,
        venueErr: true,
        venueErrMsg: 'Please type in your event venue',
      });
    } else {
      setValues({ ...values, venueErr: false, venueErrMsg: '' });
    }
  };

  const eventBrandBlur = () => {
    if (values.eventBrand.length < 1) {
      setValues({
        ...values,
        eventBrandErr: true,
        eventBrandErrMsg: 'Please type in your organization name',
      });
    } else {
      setValues({ ...values, eventBrandErr: false, eventBrandErrMsg: '' });
    }
  };

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

  const accountNumberBlur = () => {
    if (values.accountNumber.length !== 10) {
      setValues({
        ...values,
        accountNumberErr: true,
        accountNumberErrMsg: 'Your account number should contain 10 characters',
      });
    } else {
      setValues({
        ...values,
        accountNumberErr: false,
        accountNumberErrMsg: '',
      });
    }
  };

  const bankBlur = () => {
    if (values.bank.length < 3) {
      setValues({
        ...values,
        bankErr: true,
        bankErrMsg: 'Please select a bank',
      });
    } else {
      setValues({ ...values, bankErr: false, bankErrMsg: '' });
    }
  };

  const stateBlur = () => {
    if (values.state.length < 3) {
      setValues({
        ...values,
        stateErr: true,
        stateErrMsg: 'Please choose a state',
      });
    } else {
      setValues({ ...values, stateErr: false, stateErrMsg: '' });
    }
  };

  const eventTypeBlur = () => {
    if (values.eventType.length < 3) {
      setValues({
        ...values,
        eventTypeErr: true,
        eventTypeErrMsg: 'Choose the type of event you are hosting',
      });
    } else {
      setValues({ ...values, eventTypeErr: false, eventTypeErrMsg: '' });
    }
  };

  const descriptionBlur = () => {
    if (values.description.length < 3) {
      setValues({
        ...values,
        descriptionErr: true,
        descriptionErrMsg: 'Describe your event with at least 3 words',
      });
    } else {
      setValues({ ...values, descriptionErr: false, descriptionErrMsg: '' });
    }
  };

  const checkForm = () => {
    eventNameBlur();
    dateBlur();
    eventRepeatBlur();
    timeBlur();
    venueBlur();
    eventBrandBlur();
    emailBlur();
    accountNumberBlur();
    bankBlur();
    stateBlur();
    eventTypeBlur();
    descriptionBlur();
  };

  // *
  // function for form submission of ticket information
  const checkSubmit = (e) => {
    e.preventDefault();

    // check for errors in input fields
    if (
      values.eventName.length < 1 ||
      values.eventNameErr ||
      values.date.length < 1 ||
      values.dateErr ||
      values.time.length < 1 ||
      values.timeErr ||
      values.venue.length < 1 ||
      values.venueErr ||
      values.eventBrand.length < 1 ||
      values.eventBrandErr ||
      values.length < 1 ||
      values.emailErr ||
      values.email.length < 1 ||
      values.accountNumberErr ||
      values.accountNumber.length < 1 ||
      values.bankErr ||
      values.state.length < 1 ||
      values.stateErr ||
      values.eventType.length < 1 ||
      values.eventTypeErr ||
      values.description.length < 1 ||
      values.descriptionErr ||
      values.varified === false ||
      values.imgErr
    ) {
      checkForm();

      setValues({
        ...values,
        ticketFormSuccess: false,
        ticketFormSuccessMsg: '',
        ticketFormErr: true,
        ticketFormErrMsg: 'Make sure all fields are filled correctly!',
      });
    } else {
      setValues({
        ...values,
        ticketFormSuccess: false,
        ticketFormSuccessMsg: '',
        ticketFormErr: false,
        ticketFormErrMsg: '',
      });

      setPopup({ ...popup, popup3: true });
    }
  };

  const continueSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, ticketFormPending: true });

    // initializing and using form data to send images from the front end to the server
    const form = new formData();

    // calculate total number of tickets available
    // calculate the amount on income expected
    let totalAvailableTickets = 0;
    let preIncome = 0;

    createdTickets.map((ticket) => {
      totalAvailableTickets += parseInt(ticket.quantity);
      preIncome += parseInt(ticket.quantity) * parseInt(ticket.calculatedPrice);
    });

    // sum of previous account income information and new ticket created summed income
    const income = preIncome + user.data.income.expected;

    // convert created ticket array to json formart so it can be sent with formData
    const formArr = JSON.stringify(createdTickets);

    // appending various data into form data
    // due to the nature of form-data package, all data must be sent individually
    form.append('eventName', values.eventName);
    form.append('date', values.date);
    form.append('repeat', values.repeat);
    form.append('time', values.time);
    form.append('venue', values.venue);
    form.append('eventBrand', values.eventBrand);
    form.append('email', values.email);
    form.append('accountNumber', values.accountNumber);
    form.append('bank', values.bank);
    form.append('state', values.state);
    form.append('eventType', values.eventType);
    form.append('description', values.description);
    form.append('createdTickets', formArr);
    form.append('totalAvailableTickets', totalAvailableTickets);
    form.append('income', income);
    form.append('preIncome', preIncome);
    form.append('event-image', file);

    // form data to pass image files to backend using axios
    axios
      .post(`${backEndURL}/create-event`, form, {
        signal: controller.signal,
        withCredentials: true,
      })
      .then(({ data }) => {
        setValues({
          ...values,
          ticketFormErr: false,
          ticketFormErrMsg: '',
          ticketFormPending: false,
          ticketFormSuccess: true,
          ticketFormSuccessMsg: 'Created!',

          // clear form inputs
          eventName: '',
          repeat: '',
          time: '',
          venue: '',
          eventBrand: '',
          email: '',
          img: null,
          accountNumber: '',
          bank: '',
          varified: false,
          varifiedName: '',
          verificationBlurMsg: '',
          state: '',
          eventType: '',
          description: '',
        });

        setFile(null);

        setCreatedTickets([
          {
            name: '',
            price: '',
            quantity: '',
            number: '',
            description: '',
          },
        ]);

        setPopup({ ...popup, popup3: false });
        controller.abort();

        setTimeout(navigate(`/dashboard/ticket/${data.ticketId}`), 5000);
      })
      .catch((err) => {
        setValues({
          ...values,
          ticketFormErr: true,
          ticketFormErrMsg: err.response.data.message,
          ticketFormPending: false,
          ticketFormSuccess: false,
          ticketFormSuccessMsg: '',
        });
        setPopup({ ...popup, popup3: false });

        if (err.response.data.formErr) {
          checkForm();
        }
      });
  };

  const [popup, setPopup] = useState({
    popup1: false,
    popup2: false,
    popup3: false,

    pending2: false,
    error2: false,

    personalAccountErr: '',

    personalBankErr: '',

    verificationBlurMsg: '',
    varified: false,
    varifiedName: '',

    popup2Err: '',
  });

  // function to fetch account name of user from free nuban api
  // https://maylancer.org/api/nuban/
  // useEffect(() => {
  //   if (
  //     values.personalAccount &&
  //     values.personalAccount.length === 10 &&
  //     values.personalBank
  //   ) {
  //     axios
  //       .get(
  //         `https://maylancer.org/api/nuban/api.php?account_number=${values.personalAccount}&bank_code=${values.personalBank}`
  //       )
  //       .then((response) => {
  //         if (response.data.account_name) {
  //           setValues({
  //             ...popup,
  //             varified: true,
  //             verificationBlurMsg: '',
  //             varifiedName: response.data.account_name,
  //           });
  //         } else {
  //           setValues({
  //             ...popup,
  //             varified: false,
  //             varifiedName: '',
  //             varificationBlurMsg: response.data.message,
  //           });
  //         }
  //       })
  //       .catch((err) =>
  //         setValues({
  //           ...popup,
  //           varified: false,
  //           varifiedName: '',
  //           varificationBlurMsg:
  //             'Please make sure your account details are correct or check your connection',
  //         })
  //       );
  //   }
  // }, [values.personalAccount, values.personalBank]);

  // function of submition of user host data
  const handlePopupSubmit = (e) => {
    e.preventDefault();

    handlePersonalBankBlur();

    if (popup.error2 === false) {
      setPopup({ ...popup, pending2: true });

      const sendData = {
        accountNumber: values.personalAccount,
        bank: values.personalBank,
        id: user.data._id,
      };

      if (values.personalAccount && values.personalBank && user.data._id) {
        axios
          .post(`${backEndURL}/host`, sendData, {
            signal: controller.signal,
            withCredentials: true,
          })
          .then((data) => {
            setPopup({ ...popup, pending2: false });
            setUser(data);

            controller.abort();
          })
          .catch((err) => {
            setPopup({ ...popup, error2: true });
          });
      }
    }
  };

  const handlePersonalaccount = (e) => {
    setValues({ ...values, personalAccount: e.target.value });
  };

  // personal bank blur event
  const handlePersonalBankBlur = () => {
    if (values.personalBank.length < 1) {
      setPopup({ ...popup, personalBankErr: 'Select a bank', error2: true });
    } else {
      setPopup({ ...popup, personalBankErr: '', error2: false });
    }
  };

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
        <div className='createEvent page box'>
          {/* meta and SEO information */}
          <Helmet>
            <title>{pages.title}</title>
            <meta name='description' content={pages.description} />
            <meta name='tags' content={pages.tags} />
          </Helmet>

          <h1>
            Want to create an event? Please provide us with some basic
            information. It might look complex but it is really easy!
          </h1>

          <form
            encType='multipart/form-data'
            onSubmit={debounce(continueSubmit, 1000, {
              leading: true,
              trailing: false,
            })}
          >
            <div className='createEvent__flex'>
              {/* name of the event */}
              <div className='createEvent__left'>
                <div className='box'>
                  <input
                    type='text'
                    value={values.eventName}
                    onChange={handleEventname}
                    onBlur={eventNameBlur}
                    name='event_name'
                    placeholder='Name of your event'
                    required
                  />
                  {values.eventNameErr && (
                    <small className='error'>{values.eventNameErrMsg}</small>
                  )}

                  <div>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <Stack spacing={3}>
                        {/* Date */}
                        <MobileDatePicker
                          orientation='landscape'
                          minDate={minDate}
                          label='Event Date'
                          inputFormat='DD/MM/YYYY'
                          required
                          value={values.date}
                          onChange={handleChange}
                          onBlur={dateBlur}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{ gridColumn: 'span 4' }}
                            />
                          )}
                        />

                        {values.dateErr && (
                          <small className='error'>{values.dateErrMsg}</small>
                        )}

                        {/* check box to determine if event is single or reoccuring */}
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox onClick={handleCheckBox} />}
                            label='Reoccuring event?'
                          />
                        </FormGroup>

                        {/* drop down to select how often event reoccures */}
                        {values.reoccuring && (
                          <Box sx={{ minWidth: 250 }}>
                            <FormControl fullWidth>
                              <InputLabel id='demo-simple-select-label'>
                                Event repeats?
                              </InputLabel>
                              <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                value={values.repeat}
                                label='Select your state'
                                onChange={handleEventRepeat}
                                onBlur={eventRepeatBlur}
                              >
                                <MenuItem value={'Weekly'}>Weekly</MenuItem>
                                <MenuItem value={'Monthly'}>Monthly</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        )}

                        {values.reoccuring && values.repeatErr && (
                          <small className='error'>{values.repeatErrMsg}</small>
                        )}

                        {/* start time */}
                        <Box sx={{ minWidth: 250 }}>
                          <FormControl fullWidth>
                            <InputLabel id='demo-simple-select-label'>
                              Choose event time
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              value={values.time}
                              label='Select your state'
                              onChange={handleTime}
                              onBlur={timeBlur}
                            >
                              {time.map((time, num) => (
                                <MenuItem value={time} key={num}>
                                  {time}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        {values.timeErr && (
                          <small className='error'>{values.timeErrMsg}</small>
                        )}
                      </Stack>
                    </LocalizationProvider>
                  </div>

                  {/* Venue */}
                  <input
                    type='text'
                    name='event_venue'
                    placeholder='Type in the address of event center'
                    required
                    value={values.venue}
                    onChange={handleVenue}
                    onBlur={venueBlur}
                  />
                  {values.venueErr && (
                    <small className='error'>{values.venueErrMsg}</small>
                  )}

                  {/* brand name  */}
                  <input
                    type='text'
                    name='event_brand'
                    placeholder='Official Name of host or organization'
                    required
                    value={values.eventBrand}
                    onChange={handleEventBrand}
                    onBlur={eventBrandBlur}
                  />
                  {values.eventBrandErr && (
                    <small className='error'>{values.eventBrandErrMsg}</small>
                  )}

                  {/* Official E-mail */}
                  <input
                    type='email'
                    name='event_email'
                    placeholder='Official E-mail of host or organization'
                    required
                    value={values.email}
                    onChange={handleEmail}
                    onBlur={emailBlur}
                  />
                  {values.emailErr && (
                    <small className='error'>{values.emailErrMsg}</small>
                  )}

                  {/* list of states  */}
                  <Box sx={{ minWidth: 250 }}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label'>
                        Select your state
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={values.state}
                        label='Select your state'
                        onChange={handleState}
                        onBlur={stateBlur}
                      >
                        {states.map((state, num) => (
                          <MenuItem value={state} key={num}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {values.stateErr && (
                    <small className='error'>{values.stateErrMsg}</small>
                  )}
                </div>
              </div>

              <div className='createEvent__right'>
                <div className='box'>
                  <div className='createEvent__bank'>
                    <input
                      inputMode='numeric'
                      pattern='[0-9]*'
                      title='Type in event account number'
                      maxLength={10}
                      minLength={10}
                      placeholder='Please type in event account number'
                      value={values.accountNumber}
                      onChange={handleAccountNumber}
                      onBlur={accountNumberBlur}
                      required
                    />
                    {values.accountNumberErr && (
                      <small className='error'>
                        {values.accountNumberErrMsg}
                      </small>
                    )}

                    {/* list of banks */}
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                          Select bank
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          value={values.bank}
                          label='Select your bank'
                          onChange={handleBank}
                          onBlur={bankBlur}
                        >
                          {banks.map((bank) => (
                            <MenuItem value={bank.code} key={bank.id}>
                              {bank.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    {values.bankErr && (
                      <small className='error'>{values.bankErrMsg}</small>
                    )}

                    {/* shows the name of account number */}
                    {values.varified && (
                      <small className='success'>{values.varifiedName}</small>
                    )}

                    {/* shows the name of account number */}
                    {!values.varified && (
                      <small className='error'>
                        {values.varificationBlurMsg}
                      </small>
                    )}
                  </div>

                  {/* event type */}
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label'>
                        Whats your event type?
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={values.eventType}
                        label='Whats your event type?'
                        onChange={handleType}
                        onBlur={eventTypeBlur}
                      >
                        <MenuItem value={'Party'}>Party</MenuItem>
                        <MenuItem value={'Show'}>Show</MenuItem>
                        <MenuItem value={'Get together'}>Get together</MenuItem>
                        <MenuItem value={'Games'}>Games</MenuItem>
                        <MenuItem value={'Corperate'}>Corperate</MenuItem>
                        <MenuItem value={'Concert'}>Concert</MenuItem>
                        <MenuItem value={'Humaniterian'}>Humaniterian</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  {values.eventTypeErr && (
                    <small className='error'>{values.eventTypeErrMsg}</small>
                  )}

                  {/* IMG or logo */}
                  <label htmlFor='createEvent__img'>
                    Select an event picture
                  </label>
                  <div className='createEvent__img'>
                    <input
                      type='file'
                      onChange={onImageChange}
                      placeholder='input your logo or image'
                      accept='.jpeg, .png, .jpg'
                      name='event-image'
                      filename={`event-image`}
                      multiple={false}
                      required
                    />
                    <img src={values.img} alt='event image' loading='lazy' />
                  </div>
                  {values.imgErr && (
                    <small className='error'>{values.imgErrMsg}</small>
                  )}

                  {/* Description */}
                  <textarea
                    name='message'
                    value={values.description}
                    onChange={handleDescription}
                    onBlur={descriptionBlur}
                    id=''
                    cols='30'
                    rows='5'
                    placeholder='Hype your event!'
                    maxLength={250}
                    required
                  ></textarea>
                  {values.descriptionErr && (
                    <small className='error'>{values.descriptionErrMsg}</small>
                  )}
                </div>
              </div>
            </div>

            {/* table */}
            <div className='createEvent__table'>
              <p>Create up to 6 different ticket types for this event </p>
              {/* <TicketType /> */}

              <div className='ticketType shadow-box '>
                <table>
                  <thead>
                    <tr>
                      <td>Name of Ticket</td>
                      <td>Price of Ticket</td>
                      <td>Quantity of Ticket</td>
                      <td>Number per guest</td>
                    </tr>
                  </thead>

                  <tbody>
                    {createdTickets.map((number, i) => (
                      <tr key={i} className='hideDesc'>
                        <td>
                          <input
                            type='text'
                            required
                            placeholder='regular'
                            value={createdTickets[i].name}
                            onChange={(e) => changeName(e, i)}
                          />
                        </td>
                        <td>
                          <input
                            type='number'
                            required
                            placeholder='2,000'
                            min={100}
                            value={createdTickets[i].price}
                            onChange={(e) => changePrice(e, i)}
                          />
                        </td>
                        <td>
                          <input
                            type='number'
                            required
                            placeholder='100'
                            value={createdTickets[i].quantity}
                            onChange={(e) => changeQuantity(e, i)}
                          />
                        </td>
                        <td>
                          <input
                            type='number'
                            required
                            placeholder='4'
                            max={createdTickets[i].quantity}
                            value={createdTickets[i].number}
                            onChange={(e) => changeNumber(e, i)}
                          />
                        </td>

                        <td className='desc'>
                          <textarea
                            placeholder='describe ticket perks'
                            maxLength='80'
                            value={createdTickets[i].description}
                            onChange={(e) => changeDescription(e, i)}
                          ></textarea>
                        </td>

                        <td className='ticketType__icons'>
                          <div>
                            <Tooltip title='Ticket descripion'>
                              <NotesIcon
                                className='icon__button'
                                onClick={(e) => handleTicketDescription(e, i)}
                              ></NotesIcon>
                            </Tooltip>

                            <Tooltip title='Delete ticket'>
                              <DeleteOutlineIcon
                                className='icon__button'
                                onClick={() => handleDelete(i)}
                              ></DeleteOutlineIcon>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className='ticketType__button'>
                  <input
                    type='button'
                    className='gradient'
                    onClick={handleAdd}
                    value='Add Ticket'
                  />
                </div>
              </div>
            </div>

            {/* submit */}
            <button type='submit' className='gradient' onClick={checkSubmit}>
              Submit
            </button>

            {/* message if there is a user or server error */}
            {values.ticketFormErr && (
              <small className='error'>{values.ticketFormErrMsg}</small>
            )}

            {/* message when ticket has been submitted */}
            {values.ticketFormSuccess && (
              <small className='success'>{values.ticketFormSuccessMsg}</small>
            )}

            {popup.popup3 && (
              <div className='popup__main'>
                <div
                  className='popup__hide'
                  onClick={() => {
                    setPopup({ ...popup, popup3: false });
                  }}
                ></div>
                <div className='popup__card shadow-box'>
                  <h1 className='login__text'>Please note!</h1>
                  <p>
                    A ticket cannot be deleted after more than one user has
                    purchased said ticket, hence ensure ALL information filled
                    while creating your ticket is accurate
                  </p>

                  <div className='popup__buttons' type='submit'>
                    <button className='gradient'>
                      {values.ticketFormPending ? (
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
                        setPopup({ ...popup, popup3: false });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

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
              To create your own events, we would require some information from
              you as a user of the platform. Please head to the log in page to
              create an account
            </p>

            <div className='popup__buttons'>
              <button className='gradient' onClick={() => navigate('/login')}>
                Log in
              </button>

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

      {/* users with the account type guest */}
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
              To host an event, fill in the information below and your account
              would be upgraded to Host!
            </p>

            <form
              onSubmit={debounce(handlePopupSubmit, 1000, {
                leading: true,
                trailing: false,
              })}
            >
              <input
                inputMode='numeric'
                pattern='[0-9]*'
                title='Please type in numbers only'
                maxLength={10}
                minLength={10}
                placeholder='Personal account number'
                value={values.personalAccount}
                onChange={handlePersonalaccount}
                required
              />
              <small className='error'>{popup.personalAccountErr}</small>

              {/* bank */}
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>
                    Select bank
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={values.personalBank}
                    label='Select your bank'
                    onChange={handlePersonalbank}
                    onBlur={handlePersonalBankBlur}
                  >
                    {banks.map((bank) => (
                      <MenuItem value={bank.code} key={bank.id}>
                        {bank.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <small className='error'>{popup.personalBankErr}</small>

              {/* shows the name of account number */}
              {popup.varified && (
                <small className='success'>{popup.varifiedName}</small>
              )}

              {/* shows the name of account number */}
              {!popup.varified && (
                <small className='error'>{popup.verificationBlurMsg}</small>
              )}

              <div className='popup__buttons'>
                <button className='gradient' type='submit'>
                  {popup.pending2 ? (
                    <LoadingSpin
                      size='15px'
                      width='1.7px'
                      secondaryColor='#007FFF'
                      primaryColor='#e7ebf0'
                    />
                  ) : (
                    'Submit'
                  )}
                </button>

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
              <small className='error'></small>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
