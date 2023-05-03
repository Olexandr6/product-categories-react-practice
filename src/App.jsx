import React from 'react';
import './App.scss';

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
  };
});

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

            <a
              data-cy="FilterUser"
              href="#/"
            >
              User 1
            </a>

            <a
              data-cy="FilterUser"
              href="#/"
              className="is-active"
            >
              User 2
            </a>

            <a
              data-cy="FilterUser"
              href="#/"
            >
              User 3
            </a>
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
            { products.map(product => (
              <tr data-cy="Product">
                <td className="has-text-weight-bold" data-cy="ProductId">
                  { product.productId }
                </td>

                <td data-cy="ProductName">
                  {product.productName}
                </td>

                <td data-cy="ProductCategory">
                  { product.categoryIcon }
                  <span> - </span>
                  { product.categoryName }
                </td>

                <td
                  data-cy="ProductUser"
                  className={product.userSex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger'}
                >
                  { product.userName }
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
