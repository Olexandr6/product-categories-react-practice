import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const foundCategory = categoriesFromServer
    .find(category => category.id === product.categoryId);
  const foundUser = foundCategory
    ? usersFromServer.find(user => user.id === foundCategory.ownerId) : null;

  const fullProduct = {
    ...product,
    categoryTitle: foundCategory.title,
    categoryIcon: foundCategory.icon,
    userName: foundUser.name,
    userSex: foundUser.sex,
    userId: foundUser.id,
  };

  return fullProduct;
});

export const App = () => {
  const [visibleProducts, setVisibleProducts] = useState(products);
  const [userSelected, setUserSelected] = useState(0);
  const [query, setQuery] = useState('');

  const handleFilterByOwner = (userId) => {
    setUserSelected(userId);
    const filteredProducts = visibleProducts
      .filter(product => product.userId === userSelected);

    setVisibleProducts([...filteredProducts]);
  };

  const handleFilterAll = () => {
    setVisibleProducts([...products]);
    setUserSelected(0);
  };

  const filterByInput = () => {
    const filteredProducts = visibleProducts.filter(
      product => product.name.toLowerCase().includes(query.toLowerCase()),
    );

    setVisibleProducts(filteredProducts);
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
                key={0}
                onClick={handleFilterAll}
                className={classNames(
                  userSelected === 0 ? 'is-active' : '',
                )}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => handleFilterByOwner(user.id)}
                  className={classNames(
                    userSelected === user.id ? 'is-active' : '',
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
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  onKeyUp={filterByInput}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setQuery('')}
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
                  key={category.id}
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

              {products.map(product => (
                <tr data-cy="Product">
                  <td
                    className="has-text-weight-bold"
                    data-cy="ProductId"
                    key={product.id}
                  >
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {product.categoryIcon}
                    -
                    {product.categoryTitle}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={classNames('has-text-link', {
                      'has-text-danger': product.userSex === 'f',
                    })}
                  >
                    {product.userName}
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
