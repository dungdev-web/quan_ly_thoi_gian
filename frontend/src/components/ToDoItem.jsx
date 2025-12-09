export default function TodoItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex justify-between bg-gray-100 p-2 rounded mb-2">
      <span
        onClick={() => onToggle(task.id, !task.completed)}
        className={`cursor-pointer ${task.completed ? "line-through text-gray-400" : ""}`}
      >
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700"
      >
        ❌
      </button>
    </li>
  );
}
