import { useState, React } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(categoryFromServer => categoryFromServer.id === product.categoryId);
  const user = usersFromServer
    .find(userFromServer => userFromServer.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [preparedProducts, setPreparedProducts] = useState(products);
  const [selectedUser, setSelectedUser] = useState(null);
  const [querry, setQuerry] = useState('');
  const [foundNothing, setFoundNothing] = useState(false);

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
                onClick={() => {
                  setSelectedUser(null);
                  setPreparedProducts(products);
                }}
              >
                All
              </a>

              {
              usersFromServer.map((user) => {
                const {
                  name,
                  id,
                } = user;

                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    key={id}
                    className={selectedUser === user ? 'is-active' : ''}
                    onClick={() => {
                      setSelectedUser(user);
                      const filteredProducts = products.filter(product => (
                        selectedUser.id === product.user.id
                      ));

                      setPreparedProducts(filteredProducts);
                      setFoundNothing(filteredProducts.length === 0);
                    }}
                  >
                    {name}
                  </a>
                );
              })
            }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={querry}
                  onChange={(event) => {
                    setQuerry(event.target.value);
                    setPreparedProducts(
                      products.filter(product => (
                        product.name.toLowerCase()
                          .includes(event.target.value.toLowerCase())
                      )),
                    );
                  }}
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
                    disabled={querry === ''}
                    onClick={() => {
                      setQuerry('');
                      setPreparedProducts(products);
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
                onClick={() => {
                  setSelectedUser(null);
                  setQuerry('');
                  setPreparedProducts(products);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {foundNothing
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            ) : (
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
                  {preparedProducts.map((product) => {
                    const {
                      id,
                      name,
                      category,
                      user,
                    } = product;

                    return (
                      <tr data-cy="Product">
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
                          className={
                          user.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger'
                        }
                        >
                          {user.name}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
