import './pageCreator.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import LoadingSpin from 'react-loading-spin';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ClosedCaptionOffIcon from '@mui/icons-material/ClosedCaptionOff';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { debounce } from 'lodash';
import { URL } from '../../App';

// for the different page forms
const PageEditor = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

  const [pages, setPages] = useState({
    data: null,
    error: false,
    pending: true,
    refresh: 0,

    delError: false,
  });

  const [delId, setdelId] = useState([]);

  // function that refreshes the page by increasing the refresh value by 1, hence working alongside usestate
  const handleRefresh = () => {
    setPages({
      ...pages,
      refresh: pages.refresh + 1,
      pending: true,
      error: false,
    });
  };

  // use effect to grab the meta data of page from database
  useEffect(() => {
    // scroll to top of the page
    window.scrollTo(0, 0);

    axios
      .get(`${URL}/edit-page`, { withCredentials: true })
      .then(({ data }) => {
        setPages({ ...pages, data: data, pending: false, error: false });
      })
      .catch((err) => {
        setPages({ ...pages, error: true, pending: false });
      });
  }, [pages.refresh]);

  // true or false values to show the different parts of the page
  const [all, setAll] = useState(true);
  const [head, setHead] = useState(false);
  const [addsubtopic, setAddsubtopic] = useState(false);
  const [editsubtopic, setEditsubtopic] = useState(false);

  // all pages information are displayed
  const handleAll = () => {
    setAll(true);
    setHead(false);
    setAddsubtopic(false);
    setEditsubtopic(false);
  };

  // form to edit the meta data of page head
  const handleHead = () => {
    setAll(false);
    setHead(true);
    setAddsubtopic(false);
    setEditsubtopic(false);
  };

  // form to create and edit the meta data of page subtopics
  const handleAddsubtopic = () => {
    setAll(false);
    setAddsubtopic(true);
    setHead(false);
    setEditsubtopic(false);
  };

  // shows all the subtopics under a particular page head
  const handleEditsubtopic = () => {
    setAll(false);
    setEditsubtopic(true);
    setHead(false);
    setAddsubtopic(false);
  };

  // for the page values
  const [values, setValues] = useState({
    // search input field:: value: search for page to be edited
    findPage: '',
    findPageError: false,
    findPageErrorMsg: '',

    // stores the id for any page which is to be edited in anyway
    id: '',

    // title field for header edit view:: value: input title of the page
    title: '',
    titleError: false,
    titleErrorMsg: '',

    // tags field for header edit view:: value: use comma seperated keywords to describe the page
    tags: '',
    tagsError: false,
    tagsErrorMsg: '',

    // description field for header edit view:: value: type in page description
    description: '',
    descriptionError: false,
    descriptionErrorMsg: '',

    // header field for header edit view:: value: type in page header (Not required)
    header: '',
    headerError: false,
    headerErrorMsg: '',

    // h2 field for the add subtopic view:: value: Type in subtopic header
    h2Tag: '',
    h2TagError: false,
    h2TagErrorMsg: '',

    // image field for the add subtopic view:: value: content of the subtopic
    imgTag: '',
    imgTagError: false,
    imgTagErrorMsg: '',

    // p tag field for the add subtopic view:: value: content of the subtopic
    pTag: '',
    pTagError: false,
    pTagErrorMsg: '',

    // true or false field to determine if 1 one has been submitted after submmit
    form1Pending: false,

    // true or false field to determine if 2 one has been submitted after submmit
    form2Pending: false,

    // true or false field to determine if 1 one has errors after submmit
    form1Error: false,
    form1ErrorMsg: '',

    // true or false field to determine if 2 one has errors after submmit
    form2Error: false,
    form2ErrorMsg: '',

    // true or false field to determine if 1 one is successful after submmit
    form1Success: true,
    form1SuccessMsg: '',

    // true or false field to determine if 1 one is successful after submmit
    form2Success: true,
    form2SuccessMsg: '',

    // hold all information of subtopics
    sub: null,
  });

  // html field data for all input fields
  const inputs = [
    {
      id: 1,
      name: 'findPage',
      type: 'text',
      placeHolder: 'Search for page to be edited',
      required: true,
    },
    {
      id: 2,
      name: 'title',
      type: 'text',
      placeHolder: 'Input the title of the page',
      required: true,
    },
    {
      id: 3,
      name: 'tags',
      type: 'text',
      placeHolder: 'Use comma seperated keywords to describe the page',
      required: true,
    },
    {
      id: 4,
      name: 'header',
      type: 'text',
      placeHolder: 'Type in page header (Not required)',
      required: false,
    },

    {
      id: 5,
      name: 'h2Tag',
      type: 'text',
      placeHolder: 'Type in subtopic header',
      required: true,
    },

    {
      id: 6,
      name: 'imgTag',
      type: 'text',
      placeHolder: 'Input image link',
      required: false,
    },
  ];

  // html form data for all text area fields
  const textarea = [
    {
      id: 1,
      name: 'description',
      placeHolder: 'Type in page description',
      required: true,
    },
    {
      id: 2,
      name: 'pTag',
      placeHolder: 'Content of the subtopic',
      required: true,
    },
  ];

  // handle the find page form (form1)
  const handleForm1 = (e) => {
    e.preventDefault();

    const sendData = { findPage: values.findPage };
    axios
      .post(`${URL}/edit-page/find`, sendData, {
        signal: controller.signal,
        withCredentials: true,
      })
      .then((data) => {

        controller.abort();
      })
      .catch((err) => {
        if (err.status === 404) {
        }
      });
  };

  // function to input data into page header editor form
  const handlePage = (page) => {
    handleHead();

    setValues({
      ...values,
      id: page._id,
      title: page.title,
      tags: page.tags,
      description: page.description,
      header: page.header,
    });
  };

  // when a page is deleted
  const handlePageDel = (page) => {
    setHead(false);
    setAll(true);
    setAddsubtopic(false);
    setEditsubtopic(false);

    const sendData = { id: page._id };

    axios
      .post(`${URL}/edit-page/delete`, sendData, {
        signal: controller.signal,
        withCredentials: true,
      })
      .then(({ data }) => {
        if (data.delSuccess === true) {
          setPages({ ...pages, data: null });
          handleRefresh();
        } else {
          setPages({
            ...pages,
            delError: data.delError,
          });

          setdelId([...delId, data.id]);
        }

        controller.abort();
      })
      .catch((err) => {
        setPages({
          ...pages,
          delError: true,
        });

        setdelId([...delId, sendData.id]);
      });
  };

  // front end input error handlers
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

  const handleForm1Submit = (e) => {
    e.preventDefault();

    if (
      values.titleError === false &&
      values.tagsError === false &&
      values.descriptionError === false &&
      values.headerError === false
    ) {
      setValues({
        ...values,
        form1Pending: true,
      });

      const sendData = {
        id: values.id,
        title: values.title,
        tags: values.tags,
        description: values.description,
        header: values.header,
      };

      axios
        .post(`${URL}/edit-page/update`, sendData, {
          signal: controller.signal,
          withCredentials: true,
        })
        .then(({ status, data }) => {
          if (data.titleError === true) {
            setValues({
              ...values,
              titleError: data.titleError,
              titleErrorMsg: data.error,
              form1Pending: false,
              form1Error: false,
              form1ErrorMsg: '',
            });
          } else if (data.form1Success === true) {
            setValues({
              ...values,
              form1Error: false,
              form1ErrorMsg: '',
              form1Pending: false,
              form1Success: data.form1Success,
              form1SuccessMsg: data.success,
              title: '',
              tags: '',
              description: '',
              header: '',
            });
            handleRefresh();
          } else if (data.form1Error === true) {
            setValues({
              ...values,
              form1Error: true,
              form1ErrorMsg: data.error,
              form1Pending: false,
            });
          }

          controller.abort();
        })
        .catch((err) => {
          setValues({
            ...values,
            form1Error: true,
            form1ErrorMsg: err.message,
            form1Pending: false,
          });
        });

      // prevents the form from submitting in the event that the page rerenders without clicking the submit  event
    } else {
      setValues({
        ...values,
        form1Error: true,
        form1ErrorMsg: 'Please check for errors in form inputs',
        form1Pending: false,
      });
    }
  };

  const handleAdd = (page) => {
    handleAddsubtopic();

    setValues({ ...values, id: page._id });
  };

  const h2TagBlur = () => {
    if (values.h2Tag.length < 3) {
      setValues({
        ...values,
        h2TagError: true,
        h2TagErrorMsg: 'Subtopic header must contain atleast 3 characters',
      });
    } else {
      setValues({ ...values, h2TagError: false, h2TagErrorMsg: '' });
    }
  };

  const pTagBlur = () => {
    if (values.pTag.length < 10) {
      setValues({
        ...values,
        pTagError: true,
        pTagErrorMsg: 'Each p tag must contain atleast 10 characters',
      });
    } else {
      setValues({ ...values, pTageError: false, pTagErrorMsg: '' });
    }
  };

  const onImageChange = (e) => {
    const [file] = e.target.files;

    file.size > 2097152
      ? setValues({
          ...values,
          imgTagError: true,
          imgTagErrorMsg: 'Image size is too large',
        })
      : setValues({
          ...values,
          imgTag: URL.createObjectURL(file),
          imgTagError: false,
          imgTagErrorMsg: '',
        });
  };

  const handleForm2Submit = (e) => {
    e.preventDefault();

    if (
      values.h2TagError === false &&
      values.pTageError === false &&
      values.imgTagError === false
    ) {
      setValues({
        ...values,
        form2Pending: true,
        form2Error: false,
        form2ErrorMsg: '',
      });

      const sendData = {
        id: values.id,
        h2: values.h2Tag,
        p: values.pTag,
        img: values.imgTag,
      };

      axios
        .post(`${URL}/edit-page/subtopic/update`, sendData, {
          signal: controller.signal,
          withCredentials: true,
        })
        .then((data) => {
          if (data.idError === true) {
            setValues({
              ...values,
              form2Pending: false,
              form2Success: false,
              form2Error: true,
              form2ErrorMsg: 'Refresh page, click on page to update again',
            });
          } else {
            setValues({
              ...values,
              form2Success: true,
              form2SuccessMsg: 'Subtopic created',
              form2Pending: false,
              form2Error: true,
              form2ErrorMsg: '',
              h2Tag: '',
              pTag: '',
              imgTag: '',
            });
            handleRefresh();
          }

          controller.abort();
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setValues({
              ...values,
              form2Success: false,
              form2Error: true,
              form2ErrorMsg: 'Page to be edited not found',
            });
          } else {
            setValues({
              ...values,
              form2Success: false,
              form2Error: true,
              form2ErrorMsg: err.message,
            });
          }
        });

      // prevents the form from submitting in the event that the page rerenders without clicking the submit  event
    } else {
      setValues({
        ...values,
        form2Error: true,
        form2ErrorMsg: 'Please check for errors in form inputs',
        form2Pending: false,
      });
    }
  };

  const handleAllSub = (page) => {
    handleEditsubtopic();

    setValues({ ...values, sub: page.p, id: page._id });
  };

  const handleSubDel = (sub, i) => {
    const sendData = { i, sub, id: values.id };

    axios
      .post(`${URL}/edit-page/subtopic/delete`, sendData, {
        signal: controller.signal,
        withCredentials: true,
      })
      .then(({ data }) => {
        handleRefresh();

        controller.abort();
      })
      .catch((err) => console.log(err));
  };

  const handleTopic = (sub) => {
    handleAddsubtopic();

    setValues({
      ...values,
      h2Tag: sub.h2,
      pTag: sub.p,
      imgTag: sub.img,
    });
  };

  return (
    <div className='pageEditor page'>
      <div className='pageEditor__box box'>
        <div className='pageEditor__text'>
          <h1>Ticket Adnan</h1>

          <p>
            This page is created to edit the content of other created pages, by
            clicking on edit and the category you want to edit.
          </p>
        </div>

        <div className='pageEditor__search'>
          <form
            autoComplete='off'
            onSubmit={debounce(handleForm1, 1000, {
              leading: true,
              trailing: false,
            })}
          >
            <span>
              <div className='searchPages'>
                <input
                  type={inputs[0].type}
                  placeholder={inputs[0].placeHolder}
                  name={inputs[0].name}
                  required={inputs[0].required}
                  value={values[inputs[0].name]}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                />
                <Tooltip title='Search pages'>
                  <SearchIcon className='icon__button' onClick={handleForm1} />
                </Tooltip>
              </div>
              {/* <small className='error'>This is an error</small> */}
            </span>
          </form>

          <div className='pageEditor__types'>
            <button className='gradient' onClick={handleAll}>
              <span>All pages</span>

              {all && <span className='dot'></span>}
            </button>

            <button className='gradient' onClick={handleHead}>
              <span>Edit page head</span>

              {head && <span className='dot'></span>}
            </button>

            <button className='gradient' onClick={handleAddsubtopic}>
              <span>Add subtopic</span>

              {addsubtopic && <span className='dot'></span>}
            </button>

            <button className='gradient' onClick={handleEditsubtopic}>
              <span>Edit subtopic</span>

              {editsubtopic && <span className='dot'></span>}
            </button>
          </div>

          {/* showing all available pages */}
          {all && (
            <div className='pageEditor__subTopic'>
              <h2>All pages</h2>
              {pages.pending && (
                <div className='page center half-page'>
                  <LoadingSpin
                    size='45px'
                    width='5.1px'
                    secondaryColor='#007FFF'
                    primaryColor='#e7ebf0'
                  />
                </div>
              )}

              {pages.error && (
                <div className='page center half-page'>
                  <button className='error__button' onClick={handleRefresh}>
                    Retry
                  </button>
                </div>
              )}
              {pages.data &&
                pages.data.map((page, i) => (
                  <div className='subtopic  shadow-box' key={i}>
                    <div className='subtopic__top'>
                      <div>
                        <h2>{page.title}</h2>
                        <p>{page.description}</p>
                      </div>
                    </div>

                    <div className='subtopic__bottom'>
                      <span>
                        {/* Edit head button */}
                        <Tooltip
                          title='Edit head'
                          onClick={() => handlePage(page)}
                        >
                          <EditIcon className='icon__button'></EditIcon>
                        </Tooltip>

                        {/* Add subtopic button */}
                        <Tooltip
                          title='Add subtitles'
                          onClick={() => handleAdd(page)}
                        >
                          <AddIcon className='icon__button'></AddIcon>
                        </Tooltip>

                        {/* Edit subtopic button */}
                        <Tooltip
                          title='Edit subtopic'
                          onClick={() => handleAllSub(page)}
                        >
                          <ClosedCaptionOffIcon className='icon__button'></ClosedCaptionOffIcon>
                        </Tooltip>

                        {/* delete button */}

                        {pages.delError && delId.includes(page._id) ? (
                          <Tooltip title='Delete error'>
                            <PriorityHighIcon
                              className='icon__button'
                              onClick={() => {
                                handlePageDel(page);
                              }}
                            ></PriorityHighIcon>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            title='Delete'
                            onClick={() => {
                              handlePageDel(page);
                            }}
                          >
                            <DeleteOutlineIcon className='icon__button'></DeleteOutlineIcon>
                          </Tooltip>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* form to edit basic page in the head information  */}
          {head && (
            <form
              autoComplete='off'
              onSubmit={debounce(handleForm1Submit, 1000, {
                leading: true,
                trailing: false,
              })}
            >
              <span>
                <input type='hidden' value={values.id} />
                <input
                  type={inputs[1].type}
                  name={inputs[1].name}
                  placeholder={inputs[1].placeHolder}
                  required={inputs[1].required}
                  value={values[inputs[1].name]}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                  onBlur={titleBlur}
                />
                {values.titleError && (
                  <small className='error'>{values.titleErrorMsg}</small>
                )}
              </span>

              <span>
                <input
                  type={inputs[2].type}
                  name={inputs[2].name}
                  placeholder={inputs[2].placeHolder}
                  required={inputs[2].required}
                  value={values[inputs[2].name]}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                  onBlur={tagsBlur}
                />
                {values.tagsError && (
                  <small className='error'>{values.tagsErrorMsg}</small>
                )}
              </span>

              <span>
                <textarea
                  name={textarea[0].name}
                  cols='30'
                  rows='10'
                  placeholder={textarea[0].placeHolder}
                  required={textarea[0].required}
                  value={values[textarea[0].name]}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                  onBlur={descriptionBlur}
                ></textarea>
                {values.descriptionError && (
                  <small className='error'>{values.descriptionErrorMsg}</small>
                )}
              </span>

              <span>
                <input
                  type={inputs[3].type}
                  name={inputs[3].name}
                  placeholder={inputs[3].placeHolder}
                  required={inputs[3].required}
                  value={values[inputs[3].name]}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                  onBlur={headerBlur}
                />
                {values.headerError && (
                  <small className='error'>{values.headerErrorMsg}</small>
                )}
              </span>

              <button type='submit' className='gradient'>
                {values.form1Pending ? (
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

              {values.form1Error && (
                <small className='error'>{values.form1ErrorMsg}</small>
              )}

              {values.form1Success && (
                <small className='success'>{values.form1SuccessMsg}</small>
              )}
            </form>
          )}

          {/* form to add or edit subtopic  */}
          {addsubtopic && (
            <form
              autoComplete='off'
              onSubmit={debounce(handleForm2Submit, 1000, {
                leading: true,
                trailing: false,
              })}
            >
              <span>
                <input
                  type={inputs[4].type}
                  placeholder={inputs[4].placeHolder}
                  name={inputs[4].name}
                  required={inputs[4].required}
                  value={values[inputs[4].name]}
                  onBlur={h2TagBlur}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                />
                {values.h2TagError && (
                  <small className='error'>{values.h2TagErrorMsg}</small>
                )}
              </span>

              <span>
                <textarea
                  name={textarea[1].name}
                  cols='30'
                  rows='10'
                  placeholder={textarea[1].placeHolder}
                  required={textarea[1].required}
                  value={values[textarea[1].name]}
                  onBlur={pTagBlur}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                ></textarea>
                {values.pTagError && (
                  <small className='error'>{values.pTagErrorMsg}</small>
                )}
              </span>

              <span className='image__inputs'>
                <div>
                  <input
                    type={inputs[5].type}
                    name={inputs[5].name}
                    placeholder={inputs[5].placeHolder}
                    required={inputs[5].required}
                    value={values[inputs[5].name]}
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
                  />

                  <input
                    type='file'
                    onChange={onImageChange}
                    placeholder='input your logo or image'
                    accept='.jpeg, .png, .jpg'
                  />
                </div>
                {values.imgTagError && (
                  <small className='error'>{values.imgTagErrorMsg}</small>
                )}
              </span>

              <img src={values.imgTag} alt='Paragraph img' loading='lazy' />

              <button type='submit' className='gradient'>
                {values.form2Pending ? (
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

              {values.form2Error && (
                <small className='error'>{values.form2ErrorMsg}</small>
              )}

              {values.form2Success && (
                <small className='success'>{values.form2SuccessMsg}</small>
              )}
            </form>
          )}

          {editsubtopic && (
            <div className='pageEditor__subTopic'>
              <h2>Page subtopics</h2>

              {values.sub &&
                values.sub.map((sub, i) => (
                  <div className='subtopic shadow-box' key={i}>
                    <div className='subtopic'>
                      <div>
                        <h2>{sub.h2}</h2>
                        <p>{sub.p}</p>
                        {sub.img && <img src={sub.img} alt='Subtitle photo' />}
                      </div>
                    </div>

                    <div className='subtopic__bottom'>
                      <span>
                        <Tooltip
                          title='Edit subtopic'
                          onClick={() => handleTopic(sub)}
                        >
                          <EditIcon className='icon__button'></EditIcon>
                        </Tooltip>

                        <Tooltip
                          title='Delete'
                          onClick={() => handleSubDel(sub, i)}
                        >
                          <DeleteOutlineIcon className='icon__button'></DeleteOutlineIcon>
                        </Tooltip>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
