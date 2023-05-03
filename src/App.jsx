/* eslint-disable max-len */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const productsWithDetails = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(cat => cat.id === product.categoryId);
  const owner = usersFromServer.find(user => user.id === category.ownerId);

  return {
    ...product,
    category,
    owner,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productList, setProductList] = useState(productsWithDetails);
  const [value, setValue] = useState('');

  const [idClass, setIdClass] = useState('fas fa-sort');
  const [idProduct, setProductClass] = useState('fas fa-sort');
  const [idCategory, setCategoryClass] = useState('fas fa-sort');
  const [idUser, setUserClass] = useState('fas fa-sort');

  function handleUserSelection(userId) {
    setSelectedUser(userId);

    if (userId === null) {
      setProductList(productsWithDetails);
    } else {
      setProductList(
        productsWithDetails.filter(product => product.owner.id === userId),
      );
    }
  }

  function handleCategorySelection(title) {
    if (title === null) {
      setProductList(productsWithDetails);
    } else {
      setProductList(
        // eslint-disable-next-line max-len
        productsWithDetails.filter(product => product.category.title === title),
      );
    }
  }

  const correctTarget = query => query
    .toLowerCase()
    .includes(value.toLowerCase().trim());

  function handleSearch(val) {
    setValue(val);
  }

  const idClassName = () => {
    if (idClass === 'fas fa-sort') {
      setIdClass('fas fa-sort-up');
    } else if (idClass === 'fas fa-sort-up') {
      setIdClass('fas fa-sort-down');
    } else {
      setIdClass('fas fa-sort');
    }
  };

  const idProducts = () => {
    if (idProduct === 'fas fa-sort') {
      setProductClass('fas fa-sort-up');
    } else if (idProduct === 'fas fa-sort-up') {
      setProductClass('fas fa-sort-down');
    } else {
      setProductClass('fas fa-sort');
    }
  };

  const idCategories = () => {
    if (idCategory === 'fas fa-sort') {
      setCategoryClass('fas fa-sort-up');
    } else if (idCategory === 'fas fa-sort-up') {
      setCategoryClass('fas fa-sort-down');
    } else {
      setCategoryClass('fas fa-sort');
    }
  };

  const idUsers = () => {
    if (idUser === 'fas fa-sort') {
      setUserClass('fas fa-sort-up');
    } else if (idUser === 'fas fa-sort-up') {
      setUserClass('fas fa-sort-down');
    } else {
      setUserClass('fas fa-sort');
    }
  };

  const visibleProducts = productList.filter(product => correctTarget(product.name));

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
                className={selectedUser === null ? 'is-active' : ''}
                onClick={() => {
                  setSelectedUser(null);
                  handleUserSelection(null);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={selectedUser === user.id ? 'is-active' : ''}
                  onClick={
                    () => {
                      setSelectedUser(user.id);
                      // eslint-disable-next-line max-len
                      handleUserSelection(user.id);
                    }
                  }
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
                  value={value}
                  onChange={e => handleSearch(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {value !== '' && (
                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setValue('')}
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
                  'is-outlined': selectedCategory !== null,
                })}
                onClick={() => {
                  setSelectedCategory(null);
                  handleCategorySelection(null);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  key={category.id}
                  className={classNames('button mr-2 my-1', {
                    'is-info': selectedCategory === category.id,
                  })}
                  href="#/"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    handleCategorySelection(category.title);
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
                  setProductList(productsWithDetails);
                  setSelectedCategory(null);
                  setValue('');
                  setSelectedUser(null);
                }}
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

                        <a href="#/" onClick={idClassName}>
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={idClass}
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/" onClick={idProducts}>
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={idProduct}
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/" onClick={idCategories}>
                          <span className="icon">
                            <i data-cy="SortIcon" className={idCategory} />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/" onClick={idUsers}>
                          <span className="icon">
                            <i data-cy="SortIcon" className={idUser} />
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
          }

        </div>
      </div>
    </div>
  );
};
