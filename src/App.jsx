import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(currentCategory => (
    product.categoryId === currentCategory.id
  ));
  const user = usersFromServer.find(currentUser => (
    currentUser.id === category.ownerId
  ));

  return {
    productId: product.id,
    productName: product.name,
    categoryIcon: category.icon,
    categoryName: category.title,
    userName: user.name,
    userSex: user.sex,
    userId: user.id,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleClickUser = (UserId) => {
    setSelectedUserId(UserId);
  };

  const inputValueLowerCase = searchInputValue.toLowerCase();

  const filteredProductsByName = products.filter(product => (
    product.productName.toLowerCase().includes(inputValueLowerCase)
  ));

  const filteredProductsByUser = filteredProductsByName.filter(product => (
    product.userId === selectedUserId
  ));

  const visibleProducts = selectedUserId
    ? filteredProductsByUser
    : filteredProductsByName;

  const onReset = () => {
    setSelectedUserId(null);
    setSearchInputValue('');
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
                onClick={() => handleClickUser(null)}
                className={classNames(
                  {
                    'is-active': selectedUserId === null,
                  },
                )}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => handleClickUser(user.id)}
                  className={classNames(
                    {
                      'is-active': selectedUserId === user.id,
                    },
                  )}
                >
                  {user.name}
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
                  value={searchInputValue}
                  onChange={event => setSearchInputValue(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {searchInputValue && (
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setSearchInputValue('')}
                  />
                  )}
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

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={onReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            {visibleProducts.length > 0 ? (
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
            ) : null}
            <tbody>
              {visibleProducts.length > 0 ? (
                visibleProducts.map(product => (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.productId}
                    </td>

                    <td data-cy="ProductName">
                      {product.productName}
                    </td>

                    <td data-cy="ProductCategory">
                      {product.categoryIcon}
                      <span> - </span>
                      {product.categoryName}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={product.userSex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'}
                    >
                      {product.userName}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <p data-cy="NoMatchingMessage">
                      No products matching selected criteria
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
