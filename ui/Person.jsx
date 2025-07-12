import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import moment from 'moment';

// component to display the person's information and check-in or check-out button
export const Person = ({ data, handleCheck }) => {
  const { _id, firstName, lastName, checkInDate, checkOutDate } = data;

  const [enoughTime, setEnoughTime] = useState(0);

  const fullname = `${firstName} ${lastName}`; // const to get the fullname of the person
  const buttonTextCont = checkInDate ? 'Check-out' : 'Check-in'; // const to change the button text depending on the checkInDate
  const isDisabled =
    (checkInDate && checkOutDate) || (enoughTime < 5000 && checkInDate); // const to disable the button if the person has already checked in and out

  function currentTimer() {
    if (checkInDate) {
      const timeDifference = Date.now() - checkInDate;
      setEnoughTime(timeDifference);
    }
  }

  const checkIn = checkInDate
    ? moment(checkInDate).format('MM/DD/YYYY, HH:mm')
    : 'N/A';
  const checkOut = checkOutDate
    ? moment(checkOutDate).format('MM/DD/YYYY, HH:mm')
    : 'N/A';

  const buttonClass = cn('tdbutton', {
    'bg-green-500 shadow-green-500/20 hover:shadow-green-500/40': !checkInDate,
    'bg-red-500 shadow-red-500/20 hover:shadow-red-500/40':
      data.checkInDate && !isDisabled,
    'bg-red-400 cursor-not-allowed': isDisabled,
  }); // const to change the button color depending on the checkInDate

  useEffect(() => {
    if (enoughTime < 5000) {
      setTimeout(() => {
        currentTimer();
      }, 1000);
    }
  }, [checkInDate, enoughTime]);

  useEffect(() => {
    if (checkInDate) {
      setEnoughTime(() => Date.now() - checkInDate);
    }
  }, []);

  return (
    <tr className="border-blue-gray-200 border-b">
      <td className="px-4 py-3">{fullname || 'N/A'}</td>
      <td className="px-4 py-3">{data.companyName || 'N/A'}</td>
      <td className="px-4 py-3">{data.title || 'N/A'}</td>
      <td className="text-nowrap px-4 py-3">{checkIn}</td>
      <td className="text-nowrap px-4 py-3">{checkOut}</td>
      <td className="pr-1">
        <button
          className={buttonClass}
          data-ripple-light="true"
          disabled={isDisabled}
          onClick={() => handleCheck(_id, checkInDate)}
          type="button"
        >
          {buttonTextCont} {fullname}
        </button>
      </td>
    </tr>
  );
};
