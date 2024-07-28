import React, { useState } from 'react';

const DataTable = ({ data, title, onComparisonToggle }) => {
    const [sortConfig, setSortConfig] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const sortedItems = React.useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredItems = sortedItems.filter(item =>
        Object.values(item).some(val => 
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="datatable">
            <h2>{title}</h2>
            <input
                type="text"
                placeholder="Search table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('make')}>Make</th>
                        <th onClick={() => requestSort('model')}>Model</th>
                        <th onClick={() => requestSort('combined_consumption')}>Combined Consumption</th>
                        <th onClick={() => requestSort('co2_emissions')}>CO2 Emissions</th>
                        <th onClick={() => requestSort('compare')}>Compare</th>
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