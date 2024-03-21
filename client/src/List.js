import React from 'react';
import Card from './Card';

function List({ title, cards }) {
  return (
    <div className="list">
      <div className="list-title">{title}</div>
    </div>
  );
}

export default List;
