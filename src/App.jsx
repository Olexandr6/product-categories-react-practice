import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const productCategory = categoriesFromServer.find(
    category => category.id === product.categoryId,
  );

  const categoryOwner = usersFromServer.find(
    user => user.id === productCategory.ownerId,
  );

  return { ...product, category: productCategory, user: categoryOwner };
});

export const App = () => {
  const [filteredUserId, setFilteredUserId] = useState(null);
  const [filteredCategoryIds, setFilteredCategoryIds] = useState([]);
  const [filteredName, setFilteredName] = useState('');

  const visibleProducts = products.filter((product) => {
    let isFiltered = true;

    if (filteredUserId !== null) {
      isFiltered = product.user.id === filteredUserId;
    }

    if (filteredName) {
      isFiltered = isFiltered
      && product.name.toLowerCase().includes(filteredName.toLowerCase());
    }

    if (filteredCategoryIds.length) {
      isFiltered = isFiltered
      && filteredCategoryIds.includes(product.categoryId);
    }

    return isFiltered;
  });

  const handleResetFilters = () => {
    setFilteredName('');
    setFilteredUserId(null);
    setFilteredCategoryIds([]);
  };

  const handleFilteredCategoryId = (id) => {
    setFilteredCategoryIds((prevCategoryIds) => {
      if (prevCategoryIds.includes(id)) {
        return prevCategoryIds.filter(categoryId => categoryId !== id);
      }

      return [...prevCategoryIds, id];
    });
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
                  'is-active': filteredUserId === null,
                })}
                onClick={() => setFilteredUserId(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => {
                    setFilteredUserId(user.id);
                  }}
                  className={classNames({
                    'is-active': filteredUserId === user.id,
                  })}
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
                  value={filteredName}
                  onChange={event => setFilteredName(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filteredName && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setFilteredName('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button mr-6 is-outlined', {
                  'is-success': !filteredCategoryIds.length,
                })}
                onClick={() => setFilteredCategoryIds([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': filteredCategoryIds.includes(category.id),
                  })}
                  href="#/"
                  key={category.id}
                  onClick={() => handleFilteredCategoryId(category.id)}
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
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length && (
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
                {visibleProducts.map(({ id, name, category, user }) => (
                  <tr data-cy="Product" key={id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {id}
                    </td>

                    <td data-cy="ProductName">{name}</td>
                    <td data-cy="ProductCategory">
                      {`${category.icon} - ${category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        user.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {user.name}
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
