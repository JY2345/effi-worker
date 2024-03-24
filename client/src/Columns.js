import React, { useState, useEffect } from 'react';
import {
  fetchColumnsForBoard,
  fetchTasksForColumn,
  addColumnToBoard,
  deleteColumnById,
  updateTaskOrder,
  updateColumnOrder,
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
      updateColumnsAndTasks();
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
          updateColumnsAndTasks();
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
    const { source, destination, type } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }
    if (type === 'column') {
      const newColumnsOrder = Array.from(columns);
      const [reorderedColumn] = newColumnsOrder.splice(source.index, 1);
      newColumnsOrder.splice(destination.index, 0, reorderedColumn);

      const columnOrder = newColumnsOrder.map((column) => column.id);
      await updateColumnOrder(boardId, columnOrder);
      setColumns(newColumnsOrder);
    } else if (type === 'task') {
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

        const updatedStartColumnTasks = await fetchTasksForColumn(
          startColumn.id,
        );
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
    }
  };

  // const handleAddTaskToColumn = async (columnId, taskName) => {
  //   try {
  //     await addTaskToColumn(columnId, taskName);
  //     const updatedTasks = await fetchTasksForColumn(columnId);

  //     // 상태 업데이트: 컬럼의 태스크 목록을 업데이트합니다.
  //     setColumns((prevColumns) =>
  //       prevColumns.map((column) => {
  //         if (column.id === columnId) {
  //           return { ...column, tasks: updatedTasks };
  //         }
  //         return column;
  //       }),
  //     );
  //   } catch (error) {
  //     console.error('태스크 추가에 실패했습니다:', error);
  //   }
  // };

  const updateColumnsAndTasks = async () => {
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

  return (
    <div>
      <button onClick={handleAddColumnClick} className="add-column-btn">
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
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="columns"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.map((column, index) => (
                <Draggable
                  key={column.id}
                  draggableId={String(column.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="column"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <h2 className="column-title">{column.name}</h2>
                      <button
                        className="delete-column-btn"
                        onClick={() => handleDeleteColumn(column.id)}
                      >
                        삭제
                      </button>
                      <Droppable droppableId={String(column.id)} type="task">
                        {(provided) => (
                          <ul
                            className="task-list"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {column.tasks?.data?.map((task, taskIndex) => (
                              <Draggable
                                key={task.id}
                                draggableId={String(task.id)}
                                index={taskIndex}
                              >
                                {(provided) => (
                                  <li
                                    className="task"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <h3>{task.name}</h3>
                                    <p>{task.info}</p>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Columns;
