/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(category1 => category1.id === product.categoryId); // find by product.categoryId
  const user = usersFromServer
    .find(user1 => user1.id === category.ownerId); // find by category.ownerId

  return { ...product, category, user };
});

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('All');

  const filteredProducts = products.filter((product) => {
    const formattedQuery = query.toLowerCase();
    const formattedName = product.name.toLowerCase();

    return formattedName.includes(formattedQuery)
      && (product.user.id === selectedUser || selectedUser === 'All');
  });

  const [visibleProducts, setVisibleProducts] = useState(filteredProducts);
  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  useEffect(() => {
    setVisibleProducts(filteredProducts);
  }, [selectedUser, query]);

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
                className={classNames({
                  'is-active': selectedUser === 'All',
                })}
                onClick={() => {
                  handleUserSelect('All');
                }}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': selectedUser === user.id,
                  })}
                  onClick={() => {
                    handleUserSelect(user.id);
                  }}
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
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                <span className="icon is-right">
                  <button
                    type="button"
                    data-cy="ClearButton"
                    className="delete is-small"
                    onClick={() => {
                      setQuery('');
                    }}
                  />
                </span>
                )}

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
                onClick={() => {
                  setQuery('');
                  setSelectedUser('All');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="box table-container">
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
                {visibleProducts.map(product => (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        ) : (
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
        )}
      </div>
    </div>
  );
};
