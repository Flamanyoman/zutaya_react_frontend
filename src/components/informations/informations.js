import './informations.css';
import { useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import LoadingSpin from 'react-loading-spin';
import { userContext } from '../../contexts/userContext';
import { URL } from '../../App';

const Informations = () => {
  // function to prevent data from being sent to the server multiple times, by aborting after first send
  const controller = new AbortController();

  // user data
  const { user, setUser } = useContext(userContext);

  // get the end url from the terminal ie information/:id
  const { id } = useParams();

  // meta data and dom data displayed on the page
  const [pages, setPages] = useState({
    title: 'Ticket Adnan',
    description: null,
    tags: null,

    info: '',

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

  // function that gets the content of the page from the database once when the page loads
  useEffect(() => {
    // scroll to top of the page
    window.scrollTo(0, 0);

    axios
      .get(`${URL}/information/${id}`, { withCredentials: true })
      .then(({ data }) => {
        setPages({
          ...pages,
          title: data.title,
          description: data.description,
          tags: data.tags,
          pending: false,
          error: false,
          info: data.p,
        });

        // get user information
        axios
          .get(`${URL}/auth`, {
            withCredentials: true,
          })
          .then(({ data }) => setUser({ data }))
          .catch((err) => setUser(null));
      })
      .catch((err) =>
        setPages({
          ...pages,
          error: true,
          pending: false,
          title: 'Ticket Adnan',
          description: null,
          tags: null,
          info: '',
        })
      );
  }, [pages.refresh, id]);

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

      {pages.info && (
        <div className='box'>
          {/* meta and SEO information */}
          <Helmet>
            <title>{pages.title}</title>
            <meta name='description' content={pages.description} />
            <meta name='tags' content={pages.tags} />
          </Helmet>

          <h1 className='information__title'>
            {pages.info && pages.info.title}
          </h1>

          <div className='information__repeater'>
            {pages.info &&
              pages.info.map((item) => (
                <div className='information__item' key={item._id}>
                  <div className='information__p'>
                    <h2>{item.h2}</h2>
                    <p>{item.p}</p>
                  </div>

                  <div className='information__img'>
                    {item.img && (
                      <img
                        src={item.img}
                        alt='ticket adnan img'
                        loading='lazy'
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Informations;
