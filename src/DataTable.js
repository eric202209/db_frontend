import React, { useState } from 'react';

const DataTable = ({ data, title, onComparisonToggle }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="datatable">
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Combined Consumption</th>
                        <th>CO2 Emissions</th>
                        <th>Compare</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(currentItems) && currentItems.map((vehicle, index) => (
                        <tr key={index}>
                            <td>{vehicle.make || ''}</td>
                            <td>{vehicle.model || ''}</td>
                            <td>{vehicle.combined_consumption || ''}</td>
                            <td>{vehicle.co2_emissions || ''}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={() => onComparisonToggle(vehicle)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={data.length}
                paginate={paginate}
            />
        </div>
    );
};

const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick={() => paginate(number)} href="!#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default DataTable;