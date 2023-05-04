import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getCategory(categoryId) {
  const foundCategory = categoriesFromServer.find(category => (
    category.id === categoryId
  ));

  return foundCategory || null;
}

function getUser(ownerId) {
  const foundUser = usersFromServer.find(user => user.id === ownerId);

  return foundUser || null;
}

const products = productsFromServer.map((product) => {
  const category = getCategory(product.categoryId);
  const user = getUser(category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedCategoriesId, setSelectedCategoriesId] = useState([]);
  const [sortField, setSortField] = useState('');
  const [isReversed, setIsReversed] = useState(false);

  let visibleProducts = [...products];

  if (selectedUserId) {
    visibleProducts = visibleProducts.filter(
      ({ user }) => user.id === selectedUserId,
    );
  }

  if (query) {
    const lowerCaseQuery = query.toLowerCase().trim();

    visibleProducts = visibleProducts.filter(
      ({ name }) => name.toLowerCase().includes(lowerCaseQuery),
    );
  }

  if (selectedCategoriesId.length) {
    visibleProducts = visibleProducts.filter(
      product => selectedCategoriesId.includes(product.category.id),
    );
  }

  const selectedCategory = (categoryToAddId) => {
    setSelectedCategoriesId(current => ([
      ...current,
      categoryToAddId,
    ]));
  };

  const unselectedCategory = (categoryToDeleteId) => {
    setSelectedCategoriesId(current => current
      .filter(currentId => currentId !== categoryToDeleteId));
  };

  const isSelected = id => selectedCategoriesId
    .some(selectedId => selectedId === id);

  const clearSelection = () => {
    setSelectedCategoriesId([]);
  };

  const handleReset = () => {
    setSelectedUserId(0);
    setQuery('');
    setSelectedCategoriesId([]);
  };

  const sortBy = (columnName) => {
    const isFirstClick = sortField !== columnName;
    const isSecondClick = !isFirstClick && !isReversed;

    setSortField(isFirstClick || isSecondClick ? columnName : '');
    setIsReversed(isSecondClick);
  };

  const resetSorting = () => {
    setSortField('');
    setIsReversed(false);
  };

  if (sortField) {
    visibleProducts.sort(
      (a, b) => {
        switch (sortField) {
          case 'id':
            return a.id - b.id;

          case 'name':
            return a[sortField].localeCompare(b[sortField]);

          case 'title':
            return a.category.title.localeCompare(b.category.title);

          case 'userName':
            return a.user.name.localeCompare(b.user.name);

          default:
            return 0;
        }
      },
    );
  }

  if (isReversed) {
    visibleProducts.reverse();
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
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUserId(0)}
                className={classNames(
                  { 'is-active': !selectedUserId },
                )}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={classNames(
                    { 'is-active': selectedUserId === user.id },
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
                className={classNames('button', 'is-success', 'mr-6',
                  { 'is-outlined': selectedCategoriesId.length !== 0 })
                }
                onClick={clearSelection}
              >
                All
              </a>

              {categoriesFromServer.map(({ id, title }) => (
                isSelected(id)
                  ? (
                    <a
                      data-cy="Category"
                      className="button mr-2 my-1 is-info"
                      key={id}
                      href="#/"
                      onClick={() => unselectedCategory(id)}
                    >
                      {title}
                    </a>
                  ) : (
                    <a
                      data-cy="Category"
                      className="button mr-2 my-1"
                      key={id}
                      href="#/"
                      onClick={() => selectedCategory(id)}
                    >
                      {title}
                    </a>
                  )
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
          {!visibleProducts.length
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

                        <a href="#/" onClick={() => sortBy('id')}>
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={classNames('fas', {
                                'fa-sort': sortField !== 'id',
                                'fa-sort-up': sortField === 'id' && !isReversed,
                                'fa-sort-down': sortField === 'id'
                                  && isReversed,
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product
                        <a
                          href="#/"
                          onClick={() => {
                            resetSorting();
                            sortBy('name');
                          }}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={classNames('fas', {
                                'fa-sort': sortField !== 'name',
                                'fa-sort-up': sortField === 'name'
                                  && !isReversed,
                                'fa-sort-down': sortField === 'name'
                                  && isReversed,
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a
                          href="#/"
                          onClick={() => {
                            resetSorting();
                            sortBy('title');
                          }}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={classNames('fas', {
                                'fa-sort': sortField !== 'title',
                                'fa-sort-up': sortField === 'title'
                                  && !isReversed,
                                'fa-sort-down':
                                  sortField === 'title'
                                  && isReversed,
                              })}
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a
                          href="#/"
                          onClick={() => {
                            resetSorting();
                            sortBy('userName');
                          }}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={classNames('fas', {
                                'fa-sort': sortField !== 'userName',
                                'fa-sort-up': sortField === 'userName'
                                  && !isReversed,
                                'fa-sort-down': sortField === 'userName'
                                  && isReversed,
                              })}
                            />
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
            )
          }
        </div>
      </div>
    </div>
  );
};
