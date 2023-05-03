import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const findByIdFromArray = (searchArray, searchedId) => (
  searchArray.find(({ id }) => id === searchedId) || null);

const products = productsFromServer.map((product) => {
  const category = findByIdFromArray(
    categoriesFromServer, product.categoryId,
  ) || null;
  const user = findByIdFromArray(usersFromServer, category.ownerId) || null;

  return {
    ...product,
    category,
    owner: user,
  };
});

export const App = () => {
  const [selectedUserFilter, setSelectedUserFilter] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleReset = () => {
    setSelectedUserFilter(null);
    setQuery('');
    setSelectedCategories([]);
  };

  const handleCategorySelection = id => setSelectedCategories(current => [
    ...current,
    id,
  ]);

  const productsFilteredByOwner = selectedUserFilter !== null
    ? products.filter(product => product.owner.id === selectedUserFilter.id)
    : products;

  const productsFilteredByProductName = query !== ''
    ? productsFilteredByOwner.filter((product) => {
      const normalizedProductName = product.name.toLowerCase();
      const normalizedInput = query.toLowerCase().trim();

      return (
        normalizedProductName.includes(normalizedInput));
    })
    : productsFilteredByOwner;

  const productsToShow = selectedCategories.length > 0
    ? productsFilteredByProductName.filter(product => (
      selectedCategories.includes(product.category.id)))
    : productsFilteredByProductName;

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
                  'is-active': selectedUserFilter === null,
                })}
                onClick={() => setSelectedUserFilter(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': user.name === selectedUserFilter?.name,
                  })}
                  key={user.id}
                  onClick={() => setSelectedUserFilter(user)}
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

                {!query || (
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
                className={classNames('button is-success mr-6', {
                  'is-outlined': selectedCategories.length !== 0,
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': selectedCategories.includes(category.id),
                  })}
                  href="#/"
                  onClick={() => handleCategorySelection(category.id)}
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
                onClick={() => handleReset()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {productsToShow.length > 0
            ? (
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
                  {productsToShow.map(product => (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={classNames({
                          'has-text-link': product.owner.sex === 'm',
                          'has-text-danger': product.owner.sex === 'f',
                        })}
                      >
                        {product.owner.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
            : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
