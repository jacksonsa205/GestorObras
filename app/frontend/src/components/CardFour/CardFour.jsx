import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts';
import './CardFour.css'; // Certifique-se de criar um arquivo CSS para estilizar o componente

const CustomDot = (props) => {
  const { cx, cy , tagColor} = props;
  return (
    <circle cx={cx} cy={cy} r={3} fill={tagColor} stroke="none" />
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p>{`${payload[0].payload.subject}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="cardFour-stars">
      {Array(fullStars).fill().map((_, i) => <span key={i} className="star full">★</span>)}
      {halfStar && <span className="star half">★</span>}
      {Array(emptyStars).fill().map((_, i) => <span key={i} className="star empty">★</span>)}
      <span className="rating-value">{rating}</span>
    </div>
  );
};

const CardFour = ({ icon, title, subTitle,tagColor, data, nota }) => {
  const rating = nota ; // Exemplo de nota

  return (
    <div className="cardFour-card">
      <div className="cardFour-avatar"><FontAwesomeIcon icon={icon} /></div>
      <h2 className="cardFour-name" style={{ color: tagColor }}>{title}</h2>
      <p className="cardFour-job-title">{subTitle}</p>
      <RadarChart cx={100} cy={75} outerRadius={70} width={205} height={150} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={false} />
        <Radar 
          name="John Smith" 
          dataKey="A" 
          stroke={tagColor}
          fillOpacity={0} 
          dot={<CustomDot />} 
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
      <div className="cardFour-info">
        <div className="cardFour-info-item">
          <span className="cardFour-info-title">Nota:</span>
          <StarRating rating={rating} />
        </div>
      </div>
    </div>
  );
};

export default CardFour;