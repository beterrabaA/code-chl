import React, { useState } from 'react';
import { Communities } from '../communities/communities';
import { useTracker } from 'meteor/react-meteor-data';
import { People } from '../people/people';
import { Person } from './Person.jsx';
import { Company } from './Company.jsx';

export const App = () => {
  // --- states --- //

  const [selectedComm, setSelectedComm] = useState(''); // selected community state
  const [page, setPage] = useState(0);

  // --- consts --- //

  const communities = useTracker(() => Communities.find().fetch(), []); // get the communities from the database
  const people = useTracker(() => People.find().fetch(), []); // get people from the database

  const filteredPeople = people.filter(
    (person) => person.communityId === selectedComm
  ); // filter the people by the selected community

  const peopleAtEvent = filteredPeople.filter(
    (person) =>
      person.checkInDate && !person.checkOutDate && !person.companyName
  ); // filter the people by the selected community

  const peopleAtEventByCompanies = filteredPeople.filter(
    (person) => person.checkInDate && !person.checkOutDate && person.companyName
  ); // filter the people by the selected community

  const totalPeopleNotChecked =
    filteredPeople.length -
    (peopleAtEvent.length + peopleAtEventByCompanies.length); // get the total people not checked in

  const rowLimit = 10;

  const slicedFilteredPeople = filteredPeople.slice(
    rowLimit * page,
    rowLimit * (page + 1)
  ); // slice the filtered people to show 15 at the beginning

  const totalPages = Math.ceil(filteredPeople.length / rowLimit);

  const peopleByCompanies = peopleAtEventByCompanies.reduce((acc, person) => {
    acc[person.companyName] = (acc[person.companyName] || 0) + 1;
    return acc;
  }, {}); // get the people by companies

  // --- functions --- //

  /**
   * Check the person in or out and update the database
   * @name checkPerson
   * @author beterraba
   * @description function to check the person in or out and update the database
   * @param {string} _id index of the person
   * @param {string} checkInDate check in date of the person
   * @returns {void}
   */
  const checkPerson = (_id, checkInDate) => {
    const momentDate = Date.now(); // get the current date and time

    const checkDate = checkInDate
      ? { checkOutDate: momentDate }
      : { checkInDate: momentDate };

    People.updateAsync(_id, { $set: checkDate }); // update the person's checkInDate or checkOutDate
  };

  /**
   * Increase the page
   * @name increasePage
   * @description function to increase the page
   */
  const increasePage = () => {
    if (page < totalPages - 1) setPage(page + 1); // if the page is less than the total pages, increase the page
  }; // function to increase the page

  const decreasePage = () => {
    if (page > 0) setPage(page - 1); // if the page is greater than 0, decrease the page
  }; // function to decrease the page

  return (
    <div className="mx-7 mt-2">
      <h1 className="text-lg font-bold">Event Check-in</h1>
      <section>
        <section className="mx-auto max-w-sm pb-2">
          <select
            id="communities-select"
            name="communities"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-base font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            onChange={(event) => setSelectedComm(event.target.value)}
            value={selectedComm}
          >
            <option
              defaultValue="Select an event"
              disabled
              id="select-default-option"
              hidden
              selected
              value=""
            >
              Select an event
            </option>
            {communities.map((community) => (
              <option
                id={community._id}
                key={community._id}
                value={community._id}
              >
                {community.name}
              </option>
            ))}
          </select>
        </section>
        <section className="flex w-full items-center justify-center rounded-md bg-blue-100 py-2 text-center text-lg tracking-tight">
          <div>
            <p>
              People in the event right now:{' '}
              <span className="font-semibold">{peopleAtEvent.length}</span>
            </p>
            <Company data={peopleByCompanies} />
            <p>
              People not checked in:{' '}
              <span className="font-semibold">{totalPeopleNotChecked}</span>
            </p>
          </div>
        </section>
        <section className="mb-6 mt-2">
          {filteredPeople.length === 0 ? (
            <h1 className="text-center text-xl font-medium">
              No event seleted
            </h1>
          ) : (
            <div className="flex min-h-screen place-items-start justify-center">
              <div className="w-11/12 overflow-x-visible rounded-xl bg-white shadow-md">
                <table className="min-w-full overflow-x-auto">
                  <thead className="">
                    <tr className="bg-blue-gray-100 text-left text-gray-700">
                      <th className="px-4 py-3">Fullname</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Check-In</th>
                      <th className="px-4 py-3">Check-Out</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  {filteredPeople.length && (
                    <tbody className="text-blue-gray-900">
                      {slicedFilteredPeople.map((element) => (
                        <Person
                          data={element}
                          handleCheck={checkPerson}
                          key={element._id}
                        />
                      ))}
                    </tbody>
                  )}
                </table>
                <div className="flex items-center justify-between p-3">
                  <p className="block text-sm text-slate-700">
                    Page {page + 1} of {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <button
                      className="rounded border border-slate-300 px-3 py-2.5 text-center text-xs font-semibold text-slate-800 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                      disabled={page <= 0}
                      onClick={() => decreasePage()}
                    >
                      Previous
                    </button>
                    <button
                      className="rounded border border-slate-300 px-3 py-2.5 text-center text-xs font-semibold text-slate-800 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      disabled={page >= totalPages - 1}
                      type="button"
                      onClick={() => increasePage()}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </div>
  );
};
