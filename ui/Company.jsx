import React from 'react';

// component to display the company name and quantities of people who at event
export const Company = ({ data }) => {
  const text = Object.keys(data)
    .map((k) => `${k} (${data[k]})`)
    .join(', '); // const to get the company names and the number of people in the event right now

  return (
    <div className="flex text-start">
      People by company in the event right now:{'  '}
      <p>{text}</p>
    </div>
  );
};
