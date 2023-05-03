/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    newCategory => newCategory.id === product.categoryId,
  );

  const user = usersFromServer.find(
    newUser => newUser.id === category.ownerId,
  );

  return {
    ...product,
    category,
    user,
  };
});

function isIncludes(searchString, string) {
  return string.toLowerCase().includes(searchString.toLowerCase());
}

export const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [currentProducts, setcurrentProducts] = useState(products);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [searchString, setSearchString] = useState('');

  const filteredProducts = currentProducts.filter(currentProduct => (
    isIncludes(searchString, currentProduct.name)
  ));

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={classNames({
                  'is-active': currentFilter === 'All',
                })}
                data-cy="FilterAllUsers"
                href="#/"
                value="All"
                onClick={() => {
                  setcurrentProducts(products);
                  setCurrentFilter('All');
                }}
              >
                All
              </a>

              {usersFromServer.map((currentUser) => {
                const { id, name } = currentUser;

                return (
                  <a
                    className={classNames({
                      'is-active': currentFilter === name,
                    })}
                    data-cy="FilterUser"
                    key={id}
                    href="#/"
                    onClick={() => {
                      const productsOfUser = products.filter(
                        ({ user }) => user.name === name,
                      );

                      setcurrentProducts(productsOfUser);
                      setCurrentFilter(name);
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
                  value={searchString}
                  onChange={(event) => {
                    setSearchString(event.target.value);
                  }}
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

              {categoriesFromServer.map((category) => {
                const { id, title } = category;

                return (
                  <a
                    key={id}
                    href="#/"
                    data-cy="Category"
                    className={classNames(
                      'button',
                      'mr-2',
                      'is-outlined',
                    )}
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
          {filteredProducts.length === 0
            ? (
              <div>
                No products matching selected criteria
              </div>
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
                  {
                    filteredProducts.map((product) => {
                      const {
                        id,
                        name,
                        category,
                        user,
                      } = product;

                      const { icon, title } = category;
                      const { sex, name: userName } = user;

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
                            {`${icon} - ${title}`}
                          </td>

                          <td
                            data-cy="ProductUser"
                            className={classNames({
                              'has-text-link': sex === 'm',
                              'has-text-danger': sex === 'f',
                            })}
                          >
                            {userName}
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

// <tr data-cy="Product">
//   <td className="has-text-weight-bold" data-cy="ProductId">
//     1
//   </td>

//   <td data-cy="ProductName">Milk</td>
//   <td data-cy="ProductCategory">🍺 - Drinks</td>
//   <td
//     data-cy="ProductUser"
//     className="has-text-link"
//   >
//     Max
//   </td>
// </tr>
