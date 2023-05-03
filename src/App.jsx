/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(({ id }) => product.categoryId === id) || null; // find by product.categoryId
  const user = usersFromServer
    .find(({ id }) => category.ownerId === id) || null; // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

const getFilteredProducts = (userId, query, selectedCategorie) => (
  selectedCategorie.length > 0
    ? products
      .filter(product => (userId ? product.user.id === userId : product))
      .filter((product) => {
        const productLowerCase = product.name.toLowerCase();
        const queryToLowerCase = query.toLowerCase();

        return productLowerCase.includes(queryToLowerCase);
      })
      .filter(product => selectedCategorie.includes(product.category.title))
    : products
      .filter(product => (userId ? product.user.id === userId : product))
      .filter((product) => {
        const productLowerCase = product.name.toLowerCase();
        const queryToLowerCase = query.toLowerCase();

        return productLowerCase.includes(queryToLowerCase);
      })
);

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState([]);

  const visibleProducts = getFilteredProducts(
    selectedUser,
    query,
    selectedCategorie,
  );

  const categoriesNames = [...new Set(
    categoriesFromServer.map(categorie => categorie.title),
  )];

  const handleReset = () => {
    setSelectedUser(0);
    setQuery('');
    setSelectedCategorie([]);
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
                className={selectedUser === 0 ? 'is-active' : ''}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser(0)}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  className={selectedUser === user.id ? 'is-active' : ''}
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
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

                {query
                && (
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
                className={selectedCategorie.length > 0
                  ? 'button is-success mr-6 is-outlined'
                  : 'button is-success mr-6'}
                onClick={() => setSelectedCategorie([])}
              >
                All
              </a>

              {categoriesNames.map(categoryName => (
                <a
                  data-cy="Category"
                  className={selectedCategorie.includes(categoryName)
                    ? 'button mr-2 my-1 is-info'
                    : 'button mr-2 my-1'}
                  href="#/"
                  key={categoryName}
                  onClick={() => setSelectedCategorie(currentCategorie => ([
                    ...currentCategorie,
                    categoryName,
                  ]))}
                >
                  {categoryName}
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
          {visibleProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
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
                  {visibleProducts.map((product) => {
                    const { user, category, id, name } = product;

                    return (
                      <tr data-cy="Product" key={id}>
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {id}
                        </td>

                        <td data-cy="ProductName">{name}</td>
                        <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                        <td
                          data-cy="ProductUser"
                          className={user.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger'}
                        >
                          {user.name}
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
