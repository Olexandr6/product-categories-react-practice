/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-fallthrough */
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
  const [chosenUserName, setChosenUser] = useState('');
  const [inputQuery, setInputQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortType, setSortType] = useState('none');
  const [isReversed, setReverse] = useState(false);

  const tableColumns = [
    'ID',
    'Product',
    'Category',
    'User',
  ];

  let visibleProducts = [...products];

  const handleReset = () => {
    setChosenUser('');
    setInputQuery('');
    setSelectedCategories([]);
  };

  switch (sortType) {
    case 'none': {
      visibleProducts = [...products];
    }

    case 'ID': {
      visibleProducts.sort((a, b) => {
        const comparance = a.id - b.id;

        return isReversed ? -comparance : comparance;
      });
      break;
    }

    case 'Product':
    {
      visibleProducts.sort((a, b) => {
        const comparance = a.name.localeCompare(b.name);

        return isReversed ? -comparance : comparance;
      });
      break;
    }

    case 'Category':
    {
      visibleProducts.sort((a, b) => {
        const comparance = a.category.title.localeCompare(b.category.title);

        return isReversed ? -comparance : comparance;
      });
      break;
    }

    case 'User': {
      visibleProducts.sort((a, b) => {
        const comparance = a.user.name.localeCompare(b.user.name);

        return isReversed ? -comparance : comparance;
      });
      break;
    }

    default: throw new Error('wrong sort type');
  }

  if (chosenUserName.length) {
    visibleProducts = visibleProducts
      .filter(product => product.user.name === chosenUserName);
  }

  if (inputQuery.length) {
    const lowerQuery = inputQuery.toLowerCase().trim();

    visibleProducts = visibleProducts
      .filter(product => product.name.toLowerCase().includes(lowerQuery));
  }

  if (selectedCategories.length) {
    visibleProducts = visibleProducts
      .filter(product => selectedCategories.includes(product.categoryId));
  }

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
                  onChange={event => setInputQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {inputQuery.length > 0 && (
                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => {
                      setInputQuery('');
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
                className={cn('button', 'is-success', 'mr-6', {
                  'is-outlined': selectedCategories.length,
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'my-1', {
                    'is-info': selectedCategories.includes(category.id),
                  })}
                  href="#/"
                  onClick={() => {
                    if (selectedCategories.includes(category.id)) {
                      setSelectedCategories(selectedCategories
                        .filter(id => id !== category.id));

                      return;
                    }

                    setSelectedCategories(
                      [...selectedCategories,
                        category.id],
                    );
                  }}
                >
                  {category.title}
                </a>
              ))
              }
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
                {tableColumns.map(column => (
                  <th key={column}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      {column}

                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={cn('fas',
                              { 'fa-sort': sortType === 'none' },
                              { 'fa-sort-up':
                                sortType === column && !isReversed },
                              { 'fa-sort-down':
                                sortType === column && isReversed })}
                            onClick={() => {
                              if (sortType !== column) {
                                setSortType(column);

                                return;
                              }

                              if (sortType === column && !isReversed) {
                                setReverse(true);

                                return;
                              }

                              if (sortType === column && isReversed) {
                                setSortType('none');
                                setReverse(false);
                              }
                            }}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                ))}

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
