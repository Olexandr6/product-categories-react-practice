/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(({ id }) => id === product.categoryId);
  const user = usersFromServer
    .find(({ id }) => category.ownerId === id);

  return {
    ...product,
    category,
    user,
  };
});

function normalizeString(string) {
  return string.toLowerCase().trim();
}

export const App = () => {
  const [visibleProducts, setVisibleProducts] = useState(products);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(['']);

  let productsToShow = visibleProducts
    .filter(product => (selectedUserId === 0
      ? true
      : product.user.id === selectedUserId));

  productsToShow = productsToShow.filter((product) => {
    const normalizedProductName = normalizeString(product.name);
    const normalizedInputValue = normalizeString(inputValue);

    return normalizedProductName.includes(normalizedInputValue);
  });

  productsToShow = productsToShow
    .filter(product => (selectedFilters.length !== 0
      ? selectedFilters.includes(product.category.title)
      : true));

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
                onClick={() => setSelectedUserId(0)}
                className={classNames(
                  { 'is-active': !selectedUserId },
                )}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  id={user.id}
                  key={user.id}
                  className={classNames(
                    { 'is-active': selectedUserId === user.id },
                  )}
                  onClick={() => setSelectedUserId(user.id)}
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
                  value={inputValue}
                  onChange={event => setInputValue(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {inputValue && (
                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setInputValue('')}
                  />
                </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button is-success mr-6',
                  { 'is-outlined': selectedFilters.length !== 0 })}
                onClick={() => setSelectedFilters([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={classNames('button mr-2 my-1',
                    { 'is-info': selectedFilters.includes(category.title) })}
                  href="#/"
                  key={category.id}
                  onClick={() => setSelectedFilters(
                    (prevFilters) => {
                      const copyOfPrev = [...prevFilters];

                      if (!copyOfPrev.includes(category.title)) {
                        copyOfPrev.push(category.title);
                      } else {
                        const indexToDel = copyOfPrev
                          .indexOf(category.title);

                        copyOfPrev.splice(indexToDel, 1);
                      }

                      return copyOfPrev;
                    },
                  )}
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
                onClick={() => {
                  setSelectedUserId(0);
                  setInputValue('');
                  setSelectedFilters([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {productsToShow.length === 0
          && (
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
          )}

          {productsToShow.length !== 0
            && (
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
                {productsToShow.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      <span>
                        {product.category.icon}
                      </span>
                      {` - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames(
                        { 'has-text-link': product.user.sex === 'm' },
                        { 'has-text-danger': product.user.sex === 'f' },
                      )}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
        </div>
      </div>
    </div>
  );
};
