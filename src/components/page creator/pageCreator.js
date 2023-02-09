import './pageCreator.css';
import { useState } from 'react';
import LoadingSpin from 'react-loading-spin';
import axios from 'axios';
import { debounce } from 'lodash';
import { URL } from '../../App';

const PageCreator = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

  // this page is created to add information required for static pages to the database
  const [values, setValues] = useState({
    title: '',
    titleError: false,
    titleErrorMsg: '',

    tags: '',
    tagsError: false,
    tagsErrorMsg: '',

    description: '',
    descriptionError: false,
    descriptionErrorMsg: '',

    header: '',
    headerError: false,
    headerErrorMsg: '',

    id: '',
    idError: '',
    idErrorMsg: '',

    formPending: false,

    formError: false,
    formErrorMsg: '',

    formSuccess: true,
    formSuccessMsg: '',
  });

  const inputs = [
    {
      id: 1,
      name: 'title',
      type: 'text',
      placeHolder: 'Input the title of the page',
      required: true,
    },
    {
      id: 2,
      name: 'tags',
      type: 'text',
      placeHolder: 'Use comma seperated keywords to describe the page',
      required: true,
    },
    {
      id: 3,
      name: 'header',
      type: 'text',
      placeHolder: 'Type in page header (Not required)',
      required: false,
    },

    {
      id: 4,
      name: 'id',
      type: 'text',
      placeHolder: 'Type in page ID (Not required)',
      required: false,
    },
  ];

  const textarea = [
    {
      id: 1,
      name: 'description',
      placeHolder: 'Type in page description',
      required: true,
    },
  ];

  const titleBlur = () => {
    // errors for title field
    if (values.title.length < 3) {
      setValues({
        ...values,
        titleError: true,
        titleErrorMsg: 'Title must contains at least 3 characters',
      });
    } else if (!values.title.includes(' | ticket adnan')) {
      setValues({
        ...values,
        titleError: true,
        titleErrorMsg: 'title format is [Name] | ticket adnan',
      });
    } else {
      setValues({ ...values, titleError: false, formSuccess: false });
    }
  };

  const tagsBlur = () => {
    // errors for tags field
    if (values.tags.length < 3) {
      setValues({
        ...values,
        tagsError: true,
        tagsErrorMsg: 'tags must contains at least 3 characters',
      });
    } else if (!values.tags.includes(', ')) {
      setValues({
        ...values,
        tagsError: true,
        tagsErrorMsg: 'Tags are comma seperated keywords',
      });
    } else {
      setValues({ ...values, tagsError: false, formSuccess: false });
    }
  };

  const descriptionBlur = () => {
    if (values.description.length < 10 || values.description > 120) {
      setValues({
        ...values,
        descriptionError: true,
        descriptionErrorMsg: 'Description must be between 10 to 120 characters',
      });
    } else {
      setValues({ ...values, descriptionError: false, formSuccess: false });
    }
  };

  const headerBlur = () => {
    if (values.header.length > 0 && values.header.length < 3) {
      setValues({
        ...values,
        headerError: true,
        headerErrorMsg: 'Header must be empty or atleast than 3 characters',
      });
    } else {
      setValues({ ...values, headerError: false, formSuccess: false });
    }
  };

  const idBlur = () => {
    if (values.id.length > 0 && values.id.length < 3) {
      setValues({
        ...values,
        idError: true,
        idErrorMsg: 'ID must be empty or atleast 3 characters',
      });
    } else {
      setValues({
        ...values,
        idError: false,
        idErrorMsg: '',
        formSuccess: false,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      values.titleError === false &&
      values.tagsError === false &&
      values.descriptionError === false &&
      values.headerError === false &&
      values.idError === false
    ) {
      setValues({
        ...values,
        formPending: true,
      });

      const sendData = {
        title: values.title,
        tags: values.tags,
        description: values.description,
        header: values.header,
        id: values.id,
      };

      axios
        .post(`${URL}/create-page`, sendData, {
          signal: controller.signal,
          withCredentialss: true,
        })
        .then(({ status, data }) => {
          if (data.titleError === true) {
            setValues({
              ...values,
              titleError: data.titleError,
              titleErrorMsg: data.error,
              formPending: false,
              formError: false,
              formErrorMsg: '',
            });
          } else if (data.formSuccess === true) {
            setValues({
              ...values,
              formError: false,
              formErrorMsg: '',
              formPending: false,
              formSuccess: data.formSuccess,
              formSuccessMsg: data.success,
              title: '',
              tags: '',
              description: '',
              header: '',
              id: '',
            });
          }

          controller.abort();
        })
        .catch((err) => {
          setValues({
            ...values,
            formError: true,
            formErrorMsg: err.message,
            formPending: false,
          });
        });
    } else {
      setValues({
        ...values,
        formError: true,
        formErrorMsg: 'Please check for errors in form inputs',
        formPending: false,
      });
    }
  };

  return (
    <div className='pageCreator page'>
      <div className='pageCreator__box box'>
        <div className='pageCreator__text'>
          <h1>Ticket Adnan</h1>
          <p>
            This page was built to create new pages for the ticket adnan website
            and includes basic information such as SEO.
          </p>
        </div>

        <form
          className='pageCreator__input'
          onSubmit={debounce(handleSubmit, 1000, {
            leading: true,
            trailing: false,
          })}
          autoComplete='off'
        >
          <span>
            <input
              onBlur={titleBlur}
              type={inputs[0].type}
              name={inputs[0].name}
              required={inputs[0].required}
              placeholder={inputs[0].placeHolder}
              value={values[inputs[0].name]}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            {values.titleError && (
              <small className='error'>{values.titleErrorMsg}</small>
            )}
          </span>

          <span>
            <input
              onBlur={tagsBlur}
              type={inputs[1].type}
              name={inputs[1].name}
              required={inputs[1].required}
              placeholder={inputs[1].placeHolder}
              value={values[inputs[1].name]}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            {values.tagsError && (
              <small className='error'>{values.tagsErrorMsg}</small>
            )}
          </span>

          <span>
            <textarea
              onBlur={descriptionBlur}
              name={textarea[0].name}
              cols='30'
              rows='10'
              minLength={10}
              maxLength={120}
              required={textarea[0].required}
              placeholder={textarea[0].placeHolder}
              value={values[textarea[0].name]}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            ></textarea>
            {values.descriptionError && (
              <small className='error'>{values.descriptionErrorMsg}</small>
            )}
          </span>

          <span>
            <input
              onBlur={headerBlur}
              type={inputs[2].type}
              name={inputs[2].name}
              placeholder={inputs[2].placeHolder}
              value={values[inputs[2].name]}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            {values.headerError && (
              <small className='error'>{values.headerErrorMsg}</small>
            )}
          </span>

          <span>
            <input
              onBlur={idBlur}
              type={inputs[3].type}
              name={inputs[3].name}
              required={inputs[3].required}
              placeholder={inputs[3].placeHolder}
              value={values[inputs[3].name]}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
            {values.idError && (
              <small className='error'>{values.idErrorMsg}</small>
            )}
          </span>

          <button type='submit' className='gradient'>
            {values.formPending ? (
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
          {values.formError && (
            <small className='error'>{values.formErrorMsg}</small>
          )}

          {values.formSuccess && (
            <small className='success'>{values.formSuccessMsg}</small>
          )}
        </form>
      </div>
    </div>
  );
};

export default PageCreator;
