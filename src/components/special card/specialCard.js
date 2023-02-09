import './specialCard.css';
import { useNavigate } from 'react-router-dom';

const SpecialCard = ({ info }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(info.specialCard_pricing.link);
  };

  return (
    <div className='specialCard shadow-box'>
      <span>
        <h3>{info.specialCard_pricing.h3}</h3>
        <p>{info.specialCard_pricing.p}</p>
      </span>
      <button className='gradient' onClick={handleClick}>
        {info.specialCard_pricing.button}
      </button>
    </div>
  );
};

export default SpecialCard;
