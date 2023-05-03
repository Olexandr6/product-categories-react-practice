/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(cat => cat.id === product.categoryId);

  const user = usersFromServer
    .find(productUser => productUser.id === category.ownerId);

  return { ...product,
    category,
    user };
});

export const App = () => {
  const [visibleProducts, setVisibleProducts] = useState(products);
  const [chosenUserName, setChosenUser] = useState('');
  const [inputQuery, setInputQuery] = useState('');

  const handleQueryChange = (event) => {
    const { value } = event.target;

    setInputQuery(value);
    filterProducts('productName', value);
  };

  const filterProducts = (filterType, filterValue) => {
    switch (filterType) {
      case 'none':
        setVisibleProducts(products);
        break;

      case 'userName': {
        setVisibleProducts(products
          .filter(product => product.user.name === filterValue));

        if (inputQuery.length > 0) {
          setVisibleProducts(current => current
            .filter(product => product.name
              .toLowerCase().includes(inputQuery.toLowerCase())));
        }

        break;
      }

      case 'productName':
      { setVisibleProducts(products
        .filter(product => product.name
          .toLowerCase().includes(filterValue.toLowerCase())));

      if (chosenUserName.length > 0) {
        setVisibleProducts(current => current
          .filter(product => product.user.name === chosenUserName));
      }

      break; }

      default: throw new Error('wrong filter type');
    }
  };

  const handleReset = () => {
    setChosenUser('');
    setInputQuery('');
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
                className={cn({ 'is-active': chosenUserName === '' })}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => {
                  setChosenUser('');
                  filterProducts('none');
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={cn({ 'is-active': chosenUserName === user.name })}
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => {
                    setChosenUser(user.name);
                    filterProducts('userName', user.name);
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
                  value={inputQuery}
                  onChange={handleQueryChange}
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
                    onClick={() => {
                      setInputQuery('');
                      setVisibleProducts(products);
                    }}
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
                onClick={handleReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
          )}

          {visibleProducts.length > 0 && (
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
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={cn(
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
