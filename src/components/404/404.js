import './404.css';
import Helmet from 'react-helmet';

const NotFound = () => {
  return (
    <div className='not-found'>
      {/* meta and SEO information */}
      <Helmet>
        <title>404 | ticket adnan</title>
        <meta name='description' content='' />
        <meta name='tags' content='' />
      </Helmet>

      <div className='not-found__card shadow-box'>
        <b>404 </b> | Page Cannot Be Found
      </div>
    </div>
  );
};

export default NotFound;
