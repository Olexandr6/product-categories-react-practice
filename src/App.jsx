/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(cat => cat.id === product.categoryId); // find by product.categoryId
  const user = usersFromServer.find(person => person.id === category.ownerId); // find by category.ownerId

  const genderClass = user.sex === 'm'
    ? 'has-text-link'
    : 'has-text-danger';

  return {
    ...product,
    category,
    user,
    genderClass,
  };
});

export const App = () => {
  const [visibleProducts, setVisibleProducts] = useState(products);
  const [selectedUser, setSelectedUser] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const formattedQuery = query.trim().toLowerCase();

    const doesProductNameMatchesQuery = product => (
      product.name.toLowerCase().includes(formattedQuery)
    );

    const filteredProducts = products.filter(product => (
      doesProductNameMatchesQuery(product)
    ));

    setVisibleProducts(filteredProducts);

    if (!formattedQuery) {
      setVisibleProducts(products);
    }
  }, [query, products]);

  const handleUserClick = (user) => {
    setSelectedUser(user);

    const filteredProducts = visibleProducts
      .filter(product => product.user.id === user.id);

    setVisibleProducts(filteredProducts);
  };

  const handleAllUsersClick = () => {
    setSelectedUser(0);
    setVisibleProducts(products);
  };

  const handleQueryChange = event => (
    setQuery(event.target.value)
  );

  // const formattedQuery = query.trim().toLowerCase();

  // const doesProductNameMatchesQuery = product => (
  //   product.name.toLowerCase().includes(formattedQuery)
  // );

  // const filteredProducts = products.filter(product => (
  //   doesProductNameMatchesQuery(product)
  // ));

  // setVisibleProducts(filteredProducts);

  // if (!formattedQuery) {
  //   setVisibleProducts(products);
  // }

  const clearQuery = () => {
    setQuery('');
    setVisibleProducts(products);
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
                  'is-active': !selectedUser,
                })}
                onClick={handleAllUsersClick}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={classNames({
                    'is-active': selectedUser.id === user.id,
                  })}
                  onClick={() => handleUserClick(user)}
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
                  onChange={handleQueryChange}
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
                      onClick={clearQuery}
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
              {(visibleProducts.length)
                && (
                <a
                  data-cy="ResetAllButton"
                  href="#/"
                  className="button is-link is-outlined is-fullwidth"
                  onClick={handleAllUsersClick}
                >
                  Reset all filters
                </a>
                )
              }

            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            {!visibleProducts.length
              && `No products matching selected criteria`}
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
              {visibleProducts.map(product => (
                <tr data-cy="Product">
                  <td
                    className="has-text-weight-bold"
                    data-cy="ProductId"
                    key={product.id}
                  >
                    {product.id}
                  </td>

                  <td data-cy="ProductName">
                    {product.name}
                  </td>

                  <td data-cy="ProductCategory">
                    {`${product.category.icon} - ${product.category.title}`}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={product.genderClass}
                  >
                    {product.user.name}
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
