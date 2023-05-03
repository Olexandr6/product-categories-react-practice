/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getUserById(id) {
  const foundUser = usersFromServer.find(user => user.id === id);

  return foundUser || null;
}

function getCategoryId(id) {
  const foundCategory = categoriesFromServer
    .find(category => category.id === id);

  return foundCategory || null;
}

const products = productsFromServer.map((product) => {
  const category = getCategoryId(product.categoryId);
  const user = getUserById(category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [userId, setUserId] = useState(null);
  const [categoryId, setCategoryId] = useState([]);
  const [query, setQuery] = useState('');

  const visibleProduct = products.filter((product) => {
    let filter = true;

    if (userId !== null) {
      filter = product.user.id === userId;
    }

    if (query) {
      filter = filter
       && product.name.toLowerCase().includes(query.toLowerCase().trim());
    }

    if (categoryId.length) {
      filter = filter
        && categoryId.includes(product.categoryId);
    }

    return filter;
  });

  const handleFilterCategoryId = (id) => {
    setCategoryId((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter(category => category !== id);
      }

      return [...prevState, id];
    });
  };

  const handleReset = () => {
    setUserId(null);
    setCategoryId([]);
    setQuery('');
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
                className={classNames({
                  'is-active': setUserId === null,
                })}
                onClick={() => setUserId(null)}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': userId === user.id,
                  })}
                  onClick={() => setUserId(user.id)}
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
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames(
                  'button is-outlined mr-6', {
                    'is-success': !setCategoryId.length,
                  },
                )}
                onClick={() => setCategoryId([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={classNames(
                    'button mr-2 my-1', {
                      'is-info': categoryId.includes(category.id),
                    },
                  )}
                  href="#/"
                  key={category.id}
                  onClick={() => handleFilterCategoryId(category.id)}
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
                onClick={handleReset}
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
              {visibleProduct.map((product) => {
                const isMale = product.user.sex === 'm';
                const isFemale = product.user.sex === 'f';

                return (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">
                      {product.name}
                    </td>
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames({ 'has-text-link': isMale,
                        'has-text-danger': isFemale })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
