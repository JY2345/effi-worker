import React, { useState, useEffect } from 'react';
import {
  fetchColumnsForBoard,
  fetchTasksForColumn,
  addColumnToBoard,
  deleteColumnById,
  updateTaskOrder,
  moveTaskToAnotherColumn,
} from './api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Columns({ boardId, socket }) {
  const [columns, setColumns] = useState([]);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumn, setNewColumn] = useState({ name: '', boardId: '' });

  useEffect(() => {
    const fetchColumnsAndTasks = async () => {
      try {
        const columnsData = await fetchColumnsForBoard(boardId);
        const columnsWithTasksPromises = columnsData.map(async (column) => {
          const tasks = await fetchTasksForColumn(column.id);
          return { ...column, tasks };
        });
        const columnsWithTasks = await Promise.all(columnsWithTasksPromises);
        setColumns(columnsWithTasks);
      } catch (error) {
        console.error('컬럼 또는 태스크를 불러오는 데 실패했습니다:', error);
      }
    };

    if (boardId) {
      fetchColumnsAndTasks();
    }
  }, [boardId]);

  const handleAddColumnClick = () => {
    setIsAddingColumn(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewColumn((prevState) => ({ ...prevState, [name]: value }));
  };

  /**
   * 컬럼 추가
   */
  const handleSaveColumn = async () => {
    try {
      await addColumnToBoard(boardId, newColumn.name);
      setIsAddingColumn(false);
      const updatedColumns = await fetchColumnsForBoard(boardId);
      setColumns(updatedColumns);
    } catch (error) {
      console.error('컬럼 추가에 실패했습니다:', error);
    }
  };

  /**
   * 컬럼 삭제
   */
  const handleDeleteColumn = async (columnId) => {
    try {
      const isConfirmed = window.confirm('컬럼을 삭제하시겠습니까?');

      if (isConfirmed) {
        try {
          await deleteColumnById(columnId);
          const updatedColumns = await fetchColumnsForBoard(boardId);
          setColumns(updatedColumns);
          alert('컬럼이 삭제되었습니다.');
        } catch (error) {
          console.error('컬럼 삭제에 실패했습니다:', error);
          alert('컬럼 삭제에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('컬럼 삭제에 실패했습니다:', error);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const startColumn = columns.find(
      (col) => String(col.id) == source.droppableId,
    );
    const finishColumn = columns.find(
      (col) => String(col.id) == destination.droppableId,
    );
    const taskToMove = startColumn.tasks.data.find(
      (task, index) => index === source.index,
    );

    // 같은 컬럼 내에서 이동하는 경우!!
    if (startColumn === finishColumn) {
      const newTasks = Array.from(startColumn.tasks.data);
      const [reorderedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, reorderedTask);

      const newColumn = {
        ...startColumn,
        tasks: {
          ...startColumn.tasks,
          data: newTasks,
        },
      };

      const taskOrder = newTasks.map((task) => task.id);
      await updateTaskOrder(newColumn.id, taskOrder);

      const updatedColumns = columns.map((col) =>
        col.id === newColumn.id ? newColumn : col,
      );
      setColumns(updatedColumns);
    } else {
      // 다른 컬럼으로 이동하는 경우
      await moveTaskToAnotherColumn(finishColumn.id, taskToMove.id);

      const updatedStartColumnTasks = await fetchTasksForColumn(startColumn.id);
      const updatedFinishColumnTasks = await fetchTasksForColumn(
        finishColumn.id,
      );
      // UI도... 업데이트
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((column) => {
          if (column.id === startColumn.id) {
            return { ...column, tasks: updatedStartColumnTasks };
          } else if (column.id === finishColumn.id) {
            return { ...column, tasks: updatedFinishColumnTasks };
          } else {
            return column;
          }
        });
        return newColumns;
      });
    }
    socket.emit('moveCard', {
      boardId: boardId, 
      taskId: taskToMove.id, 
      sourceColumnId: startColumn.id,
      targetColumnId: finishColumn.id,
    });
  };

  return (
    <div>
      <button onClick={handleAddColumnClick} className="add-board-btn">
        컬럼 추가
      </button>
      {isAddingColumn && (
        <div>
          <input
            name="name"
            value={newColumn.name}
            onChange={handleChange}
            placeholder="컬럼 이름"
          />
          <button onClick={handleSaveColumn}>저장</button>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns">
          {columns.map((column, columnIndex) => (
            <Droppable key={column.id} droppableId={String(column.id)}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="column"
                >
                  <div className="column-title">{column.name}</div>
                  <button
                    onClick={() => handleDeleteColumn(column.id)}
                    className="delete-column-btn"
                  >
                    삭제
                  </button>
                  <ul className="task-list">
                    {column.tasks.data &&
                      column.tasks.data.map((task, taskIndex) => (
                        <Draggable
                          key={task.id}
                          draggableId={String(task.id)}
                          index={taskIndex}
                        >
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="task"
                            >
                              <h3>{task.name}</h3>
                              <p>{task.info}</p>
                            </li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Columns;
