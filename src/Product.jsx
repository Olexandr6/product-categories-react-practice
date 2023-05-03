import React from 'react';

export const Product = ({ id, name, category, user }) => (
  <tr data-cy="Product">
    <td className="has-text-weight-bold" data-cy="ProductId">
      {id}
    </td>

    <td data-cy="ProductName">{name}</td>
    <td data-cy="ProductCategory">
      <span
        role="img"
        aria-label="grocery"
      >
        {category.icon}
      </span>
      -
      {category.title}
    </td>

    <td
      data-cy="ProductUser"
      className="has-text-danger"
    >
      {user.name}
    </td>
  </tr>
);
