import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(cat => cat.id === product.categoryId); // find by product.categoryId
  const user = usersFromServer.find(us => us.id === category.ownerId); // find by category.ownerId

  return ({
    ...product,
    category,
    user,
  }
  );
});

const productQuery = (source, query) => (
  source.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())
);

function getVisibleProducts(activeUserID, query, activeCategory) {
  return (
    products.filter((product) => {
      const isQuery = query ? productQuery(product.name, query) : true;
      const isUser = activeUserID ? product.user.id === activeUserID : true;
      const isCategory = activeCategory ? product.category.id === activeCategory : true;

      return isQuery && isUser && isCategory;
    }));
}

export const App = () => {
  const [activeUserID, setActiveUserID] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [query, setQuery] = useState('');

  const visibleProducts = getVisibleProducts(activeUserID, query, activeCategory);

  const handleReset = () => {
    setActiveUserID(0);
    setActiveCategory(0);
    setQuery('');
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
                onClick={event => setActiveUserID(0)}
                className={classNames({
                  'is-active': !activeUserID,
                })}
              >
                All
              </a>

              {usersFromServer.map(({ name, id }) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={id}
                  onClick={event => setActiveUserID(id)}
                  className={classNames({
                    'is-active': activeUserID === id,
                  })}
                >
                  {name}
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

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={event => setQuery('')}
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
                onClick={event => setActiveCategory(0)}
              >
                All
              </a>

              {categoriesFromServer.map(({ title, id }) => (
                <a
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', { 'is-info': activeCategory === id })}
                  href="#/"
                  key={id}
                  onClick={event => setActiveCategory(id)}
                >
                  {title}
                </a>
              ))}
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
          {!visibleProducts.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

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
                  <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={classNames({
                      'has-text-link': user.sex === 'm',
                      'has-text-danger': user.sex === 'f',
                    })}
                  >
                    {user.name}
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
