import './longcards.css';
import { Link } from 'react-router-dom';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const Longcards = ({ features }) => {
  return (
    <div className='home__features-list'>
      {features.map((feature) => (
        <div className='longcard' key={feature.id}>
          <div className='box'>
            <p>{feature.title}</p>
            <Link to={feature.link}>
              See more <ArrowRightAltIcon />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Longcards;
