import React from 'react';

const FinancialForm = ({ onSubmit, isSubmitting }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const formData = Object.fromEntries(data.entries());
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="income" className="block text-sm font-medium text-gray-700">
            Income
          </label>
          <input
            type="number"
            name="income"
            id="income"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="totalExpenses" className="block text-sm font-medium text-gray-700">
            Total Expenses
          </label>
          <input
            type="number"
            name="totalExpenses"
            id="totalExpenses"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="event" className="block text-sm font-medium text-gray-700">
            Event
          </label>
          <select
            name="event"
            id="event"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white"
          >
            <option value="" disabled>Select an event</option>
            <option value="child_education">Child Education</option>
            <option value="child_marriage">Child Marriage</option>
            <option value="buying_car">Buying a Car</option>
            <option value="medical_emergency">Medical Emergency</option>
            <option value="home_renovation">Home Renovation</option>
            <option value="job_loss">Job Loss</option>
            <option value="vacation_planning">Vacation Planning</option>
            <option value="retirement_planning">Retirement Planning</option>
            <option value="starting_a_business">Starting a Business</option>
            <option value="buying_a_house">Buying a House</option>
          </select>
        </div>
        <div>
          <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700">
            Inflation Rate
          </label>
          <input
            type="number"
            name="inflationRate"
            id="inflationRate"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="medical" className="block text-sm font-medium text-gray-700">
            Medical Expenses
          </label>
          <input
            type="number"
            name="medical"
            id="medical"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default FinancialForm;
