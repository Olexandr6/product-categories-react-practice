import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(currentCategory => (
    currentCategory.id === product.categoryId
  )) || null;
  const user = usersFromServer.find(currentUser => (
    currentUser.id === category.ownerId
  )) || null;

  return ({
    ...product,
    category,
    user,
  });
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [activeUserId, setActiveUserId] = useState(null);
  const [inputName, setInputName] = useState('');

  const isNameMatchInputName = name => (
    name
      .toLowerCase()
      .includes(inputName.toLowerCase().trim()));

  const getVisibleProducts = () => {
    let visibleProducts = products;

    if (selectedUser !== 'All') {
      visibleProducts = visibleProducts.filter(
        product => product.user.name === selectedUser,
      );
    }

    if (inputName !== '') {
      visibleProducts = visibleProducts.filter(
        product => isNameMatchInputName(product.user.name),
      );
    }

    return visibleProducts;
  };

  const visibleProducts = useMemo(
    getVisibleProducts,
    [products, selectedUser, inputName],
  );

  const handlerSortByUser = (name, id) => {
    setSelectedUser(name);
    setActiveUserId(id);
  };

  const handleSortByUserReset = () => {
    setSelectedUser('All');
    setActiveUserId(null);
  };

  const handleInputSortByName = (event) => {
    setInputName(event.target.value);
    setSelectedUser('All');
  };

  const hendleClearInput = () => {
    setInputName('');
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
                className={classNames({ 'is-active': !activeUserId })}
                onClick={handleSortByUserReset}
              >
                All
              </a>

              {usersFromServer.map(({ id, name }) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({ 'is-active': id === activeUserId })}
                  onClick={() => handlerSortByUser(name, id)}
                >
                  {name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={inputName}
                  onChange={handleInputSortByName}
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
                    onClick={hendleClearInput}
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

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
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
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

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
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
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
              {visibleProducts.map(({ id, name, category, user }) => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {id}
                  </td>

                  <td data-cy="ProductName">{name}</td>
                  <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={user.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger'}
                  >
                    {user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
