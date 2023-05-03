/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(categ => categ.id === product.categoryId);
  const user = usersFromServer
    .find(person => person.id === category.ownerId);

  return { ...product, category, user };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [query, setQuery] = useState('');
  const [selectCategory, setSelectedCategory] = useState([]);

  const filteredProducts = products.filter((product) => {
    const formattedQuery = query.toLowerCase();
    const formattedName = product.name.toLowerCase();
    const categoryToShow = selectCategory.includes(product.category.title);

    return formattedName.includes(formattedQuery)
      && (product.user.id === selectedUser || selectedUser === 'All')
      && (categoryToShow || selectCategory.length === 0);
  });

  const [visibleProducts, setVisibleProducts] = useState(filteredProducts);
  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  useEffect(() => {
    setVisibleProducts(filteredProducts);
  }, [selectedUser, query, selectCategory]);

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
                  'is-active': selectedUser === 'All',
                })}
                onClick={() => {
                  handleUserSelect('All');
                }}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': selectedUser === user.id,
                  })}
                  onClick={() => {
                    handleUserSelect(user.id);
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
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                <span className="icon is-right">
                  <button
                    type="button"
                    data-cy="ClearButton"
                    className="delete is-small"
                    onClick={() => {
                      setQuery('');
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
                className={classNames('button is-success mr-6',
                  { 'is-outlined': selectCategory.length !== 0 })}
                onClick={() => {
                  setSelectedCategory([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  href="#/"
                  className={classNames('button mr-2 my-1', {
                    'is-info': selectCategory.includes(category.title),
                  })}
                  onClick={() => {
                    setSelectedCategory(
                      (prevFilters) => {
                        const copyOfPrev = [...prevFilters];

                        if (!copyOfPrev.includes(category.title)) {
                          copyOfPrev.push(category.title);
                        } else {
                          const indexToDel = copyOfPrev
                            .indexOf(category.title);

                          copyOfPrev.splice(indexToDel, 1);
                        }

                        return copyOfPrev;
                      },
                    );
                  }}
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
                onClick={() => {
                  setQuery('');
                  setSelectedUser('All');
                  setSelectedCategory([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="box table-container">
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
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        ) : (
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
        )}
      </div>
    </div>
  );
};
