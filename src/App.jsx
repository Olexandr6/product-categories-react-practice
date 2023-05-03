/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getAllData = () => productsFromServer.map((prod) => {
  const category = categoriesFromServer
    .find(cat => cat.id === prod.categoryId);
  const user = usersFromServer
    .find(currUser => currUser.id === category.ownerId);

  return {
    ...prod,
    category,
    user,
  };
});

export const App = () => {
  const [allData, setAllData] = useState([]);
  const [visibleData, setVisibleData] = useState(allData);
  const [activeUser, setActiveUser] = useState('All');
  const [selectedCategorys, setSelectedCategorys] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setAllData(getAllData());
    setVisibleData(getAllData());
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setVisibleData(allData
      .filter(data => data.name
        .toLowerCase()
        .includes(event.target.value.toLowerCase())));
  };

  const handleClearBtnClick = () => {
    setInputValue('');
  };

  const handleUserFilter = (name) => {
    if (name !== 'All') {
      setActiveUser(name);
      setVisibleData(allData
        .filter(data => data.user.name.toLowerCase() === name.toLowerCase()));
    }

    if (name === 'All') {
      setVisibleData(allData);
    }
  };

  const handleCategorySelection = (title) => {
    if (selectedCategorys.includes(title)) {
      setSelectedCategorys(selectedCategorys
        .filter(cat => cat !== title));
    } else {
      setSelectedCategorys([...selectedCategorys, title]);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': activeUser === 'All' })}
                onClick={() => {
                  handleUserFilter('All');
                }}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const { name, id } = user;

                return (
                  <a
                    key={id}
                    data-cy="FilterUser"
                    href="#/"
                    className={cn({ 'is-active': activeUser === name })}
                    onClick={() => {
                      handleUserFilter(name);
                    }}
                  >
                    {name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={inputValue}
                  onChange={handleInputChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={handleClearBtnClick}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map((category) => {
                const { title, id } = category;

                return (
                  <a
                    data-cy="Category"
                    className={cn('button mr-2 my-1',
                      { 'is-info': selectedCategorys.includes(title) })}
                    href="#/"
                    onClick={() => {
                      handleCategorySelection(title);
                    }}
                    key={id}
                  >
                    {title}
                  </a>
                );
              })}

            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          { !visibleData.length
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleData.map((data) => {
                    const { name, id, user, category } = data;

                    return (
                      <tr data-cy="Product" key={id}>
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {id}
                        </td>

                        <td data-cy="ProductName">{name}</td>
                        <td data-cy="ProductCategory">
                          {`${category.icon} - ${category.title}`}
                        </td>

                        <td
                          data-cy="ProductUser"
                          className={cn({
                            'has-text-link': user.sex === 'm',
                            'has-text-danger': user.sex === 'f',
                          })}
                        >
                          {user.name}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};
