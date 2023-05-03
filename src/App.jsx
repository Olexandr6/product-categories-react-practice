import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const findValueById = (id, array) => array.find(item => item.id === id) || null;

const products = productsFromServer.map((product) => {
  const category = findValueById(product.categoryId, categoriesFromServer);
  // find by product.categoryId
  const user = findValueById(category.ownerId, usersFromServer); // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [visibleProducts, setProducts] = useState(products);
  const [query, setQuery] = useState('');

  const handleClick = (id) => {
    setSelectedUserId(id);

    const productsToShow = products.filter(product => (
      product.user.id === id
    ));

    setProducts(productsToShow);
  };

  const handleFilterReset = () => {
    setSelectedUserId(null);
    setProducts(products);
  };

  const handleSearchReset = () => {
    setQuery('');
    setProducts(products);
  };

  const handleResetAll = () => {
    setSelectedUserId(null);
    setQuery('');
    setProducts(products);
  };

  const isValidProduct = (productName, value) => {
    const formattedProductName = productName.toLowerCase();
    const formattedValue = value.toLowerCase().trim();

    return formattedProductName.includes(formattedValue);
  };

  const handleInputChange = ({ target }) => {
    const { value } = target;

    setQuery(value);
    let filteredProducts = products
      .filter(product => isValidProduct(product.name, value));

    if (selectedUserId) {
      filteredProducts = products.filter(product => (
        product.user.id === selectedUserId
        && isValidProduct(product.name, value)
      ));

      setProducts(filteredProducts);
    }

    setProducts(filteredProducts);
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
                className={cn({
                  'is-active': selectedUserId === null,
                })}
                onClick={handleFilterReset}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const { id, name } = user;
                const isActive = id === selectedUserId;

                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    key={id}
                    className={cn({
                      'is-active': isActive,
                    })}
                    onClick={() => handleClick(id)}
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
                  value={query}
                  onChange={handleInputChange}
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
                    onClick={handleSearchReset}
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
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length > 0 ? (
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
                {visibleProducts.map((product) => {
                  const { id, name, category, user } = product;
                  const ownerGender = user.sex;

                  return (
                    <tr data-cy="Product" key={id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': ownerGender === 'm',
                          'has-text-danger': ownerGender === 'f',
                        })}
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
