/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const visibleCategory = categoriesFromServer.find(
    category => category.id === product.categoryId,
  );
  const visibleUser = usersFromServer.find(
    user => user.id === visibleCategory.ownerId,
  );

  return {
    id: product.id,
    name: product.name,
    category: visibleCategory,
    user: visibleUser,
  };
});

const getColorForUser = sex => (
  sex === 'm' ? 'has-text-link' : 'has-text-danger'
);

export const App = () => (
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
            >
              All
            </a>

            {usersFromServer.map(user => (
              <a
                data-cy="FilterUser"
                href="#/"
                key={user.id}
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
                value="qwe"
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

            {categoriesFromServer.map(category => (
              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
                key={category.id}
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
            {products.map(product => (
              <>
                <tr
                  data-cy="Product"
                  key={product.id}
                >
                  <td
                    data-cy="ProductId"
                    className="has-text-weight-bold"
                  >
                    {product.id}
                  </td>
                  <td
                    data-cy="ProductName"
                  >
                    {product.name}
                  </td>
                  <td
                    data-cy="ProductCategory"
                  >
                    <span>
                      {product.category.icon}
                      {' - '}
                    </span>
                    {product.category.title}
                  </td>
                  <td
                    data-cy="ProductUser"
                    className={getColorForUser(product.user.sex)}
                  >
                    {product.user.name}
                  </td>
                </tr>

              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
